/*
 * Cloudflare Worker — udonow.co.kr
 *
 * 1) 정적 자산(dist/)을 SPA 폴백으로 서빙 (assets 바인딩; wrangler.jsonc)
 * 2) /api/udo/*  → 우도 나우 앱 서버의 **읽기 전용 공개 엔드포인트** 동일출처 프록시
 * 3) /media/*    → 앱 서버의 사진 파일 프록시
 *
 * 왜 프록시인가: 앱 서버가 CORS 헤더를 주지 않아 브라우저가 직접 못 부른다.
 * (myweb 의 /api/jeju 프록시와 같은 패턴.)
 *
 * 원칙
 * - GET 만. 엔드포인트는 **고정 allowlist**. 쿼리 파라미터도 allowlist.
 * - 사용자 입력을 upstream 경로로 그대로 넘기지 않는다(SSRF 방지).
 * - 응답은 엣지에서 짧게 캐시(운항 상태 60초, 나머지 5분, 사진 1일).
 */

const ORIGIN = 'https://udo-info.fly.dev';

/** 프록시 허용 엔드포인트 → 엣지 캐시 TTL(초). 여기 없는 경로는 404. */
const ENDPOINTS: Record<string, number> = {
  status: 60,
  timetable: 900,
  forecast: 600,
  tide: 900,
  'tide/day': 900,
  cctv: 900,
  'v1/app/requirements': 3600,
  spots: 300,
  festivals: 300,
  shops: 300,
  gallery: 300,
};

/** upstream 으로 넘겨도 되는 쿼리 파라미터. */
const ALLOWED_PARAMS = ['region', 'lang', 'category', 'limit', 'date', 'slug'];

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function proxyApi(url: URL): Promise<Response> {
  const endpoint = url.pathname.slice('/api/udo/'.length).replace(/\/+$/, '');
  const ttl = ENDPOINTS[endpoint];
  if (ttl === undefined) return json({ error: 'not-found' }, 404);

  const upstream = new URL(`${ORIGIN}/${endpoint}`);
  for (const key of ALLOWED_PARAMS) {
    const value = url.searchParams.get(key);
    if (value) upstream.searchParams.set(key, value.slice(0, 64));
  }

  try {
    const r = await fetch(upstream.toString(), {
      cf: { cacheTtl: ttl, cacheEverything: true },
    } as RequestInit);
    return new Response(r.body, {
      status: r.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': `public, max-age=${ttl}`,
      },
    });
  } catch {
    return json({ error: 'upstream-unavailable' }, 502);
  }
}

async function proxyMedia(url: URL): Promise<Response> {
  /* /media/photos/<name>.jpg 형태만 통과 — 경로 탈출·임의 URL 금지. */
  if (!/^\/media\/[A-Za-z0-9._/-]+$/.test(url.pathname) || url.pathname.includes('..')) {
    return json({ error: 'not-found' }, 404);
  }
  try {
    const r = await fetch(`${ORIGIN}${url.pathname}`, {
      cf: { cacheTtl: 86400, cacheEverything: true },
    } as RequestInit);
    return new Response(r.body, {
      status: r.status,
      headers: {
        'content-type': r.headers.get('content-type') ?? 'application/octet-stream',
        'cache-control': 'public, max-age=86400',
      },
    });
  } catch {
    return json({ error: 'upstream-unavailable' }, 502);
  }
}

/*
 * http 로 들어온 요청을 https 로 넘긴다.
 *
 * 주소창에 'udonow.co.kr' 만 치면 브라우저는 http 로 먼저 붙는다. 그대로 두면
 * 주소창에 '주의 요함'이 뜨고, 그 상태의 접속은 중간에서 내용을 바꿀 수 있다.
 * (Cloudflare 대시보드의 'Always Use HTTPS' 와 같은 일을 코드에서 한다 —
 *  설정이 바뀌어도 저장소에 남아 있도록.)
 */
function httpsRedirect(url: URL): Response {
  const target = new URL(url.toString());
  target.protocol = 'https:';
  return Response.redirect(target.toString(), 301);
}

/** https 응답에 붙이는 최소 보안 헤더. */
function harden(response: Response): Response {
  const out = new Response(response.body, response);
  // 6개월 동안 이 호스트는 https 로만 접속한다. includeSubDomains 는 넣지 않는다 —
  // 가게 서브도메인(*.udonow.co.kr)은 별도 서버가 맡고 있어 함께 강제하면 안 된다.
  out.headers.set('strict-transport-security', 'max-age=15552000');
  out.headers.set('x-content-type-options', 'nosniff');
  out.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  return out;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.protocol === 'http:') return httpsRedirect(url);

    if (url.pathname.startsWith('/api/udo/') || url.pathname.startsWith('/media/')) {
      if (request.method !== 'GET') return json({ error: 'GET only' }, 405);
      const proxied = url.pathname.startsWith('/media/') ? proxyMedia(url) : proxyApi(url);
      return harden(await proxied);
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'not-found' }, 404);

    return harden(await env.ASSETS.fetch(request));
  },
};
