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
  cctv: 300,
  'v1/app/requirements': 3600,
  'v1/destinations/udo/banners': 300,
  'v1/destinations/udo/transport/vessels': 30,
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
    /*
     * 캐시 키에 **시간 버킷**을 넣는다(`_t`).
     *
     * 앱 서버는 `cache-control: public, max-age=300, s-maxage=300,
     * stale-while-revalidate=300` 을 준다. 이 헤더 때문에 엣지가 응답을 콜로별로
     * 들고 있다가, 한 번 굳으면 TTL 이 지나도 계속 같은(원본 fly-request-id 까지 같은)
     * 오래된 복사본을 되돌려줬다 — 실제로 항구 CCTV 목록이 옛 카메라 1대로 몇 시간씩
     * 고정됐다. Worker 쪽에서 캐시를 꺼도 콜로에 따라 결과가 갈렸다(HKG 는 옛것, NRT 는 새것).
     *
     * TTL 마다 값이 바뀌는 파라미터를 붙이면 키 자체가 회전하므로, 굳은 복사본은
     * 다음 버킷에서 절대 재사용되지 않는다. 오래됨의 상한이 TTL 로 되돌아온다.
     * 앱 서버는 모르는 쿼리 파라미터를 무시한다(확인함).
     */
    upstream.searchParams.set('_t', String(Math.floor(Date.now() / 1000 / ttl)));

    const r = await fetch(upstream.toString(), {
      cf: { cacheTtl: ttl, cacheEverything: true },
    } as RequestInit);
    return new Response(r.body, {
      status: r.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        /*
         * 브라우저 캐시는 짧게(최대 30초). 엣지 캐시는 위 cacheTtl 로 이미 앱 서버를
         * 가려주므로, 여기서 길게 잡아 봐야 얻는 것 없이 **사용자 쪽에 옛 응답이 굳는
         * 창구**만 하나 더 생긴다. 실제로 카메라 목록이 바뀐 뒤에도 브라우저가 15분간
         * 옛 목록을 들고 있어 "아까는 됐는데 지금은 안 된다"가 됐다.
         */
        'cache-control': `public, max-age=${Math.min(ttl, 30)}`,
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

/* ─── 항구 CCTV 릴레이 ──────────────────────────────────────────────── */
/*
 * 제주시 월파 CCTV 는 **http 전용**이라(스트림 서버가 https 를 받지 않는다) https 인 이
 * 사이트 안에서는 브라우저가 재생을 막는다(혼합 콘텐츠). 그래서 이 워커가 https 로
 * 받아 http 원본에서 가져다 넘긴다.
 *
 * 안전장치 — 공개 프록시가 되지 않도록:
 *  - 원본 host:port 를 **하드코딩 allowlist** 로 고정한다(SSRF 방지). 다른 주소는 400.
 *  - 경로는 `.m3u8` / `.ts` 만 통과. GET 만.
 *  - m3u8 은 본문을 다시 써서 세그먼트도 이 릴레이를 타게 한다(상대 경로 → 절대 URL).
 *  - 세그먼트는 엣지에 캐시한다 → 뷰어가 늘어도 **상류 부하는 카메라 수에 비례**한다.
 */
/*
 * 원본은 제주시 스트림 서버(211.114.96.121:1935, http 전용)다.
 * 그런데 Workers 는 **비표준 포트(1935)로 나갈 수 없다.** 그래서 같은 존에
 * 프록시된 호스트 `cctv-o.udonow.co.kr` 을 두고(Origin Rule: 목적지 포트 1935,
 * Configuration Rule: 그 호스트만 SSL Flexible) 워커는 443 으로 그 호스트를 부른다.
 * Cloudflare 엣지가 뒤에서 1935 로 연결한다.
 */
const CCTV_ORIGIN = 'http://211.114.96.121:1935/';
const CCTV_PROXY_ORIGIN = 'https://cctv-o.udonow.co.kr/';

function isAllowedCctvUrl(raw: string): boolean {
  const base = raw.startsWith(CCTV_ORIGIN)
    ? CCTV_ORIGIN
    : raw.startsWith(CCTV_PROXY_ORIGIN)
      ? CCTV_PROXY_ORIGIN
      : null;
  if (!base) return false;
  const path = raw.slice(base.length);
  if (path.includes('..') || path.includes('@')) return false;
  return /\.(m3u8|ts)(\?.*)?$/.test(path);
}

/** 앱 서버가 주는 http 원본 주소를 실제로 받아올 수 있는 프록시 호스트로 바꾼다. */
function toFetchable(raw: string): string {
  return raw.startsWith(CCTV_ORIGIN) ? CCTV_PROXY_ORIGIN + raw.slice(CCTV_ORIGIN.length) : raw;
}

async function relayCctv(url: URL, request: Request): Promise<Response> {
  const target = url.searchParams.get('url') ?? '';
  if (!isAllowedCctvUrl(target)) return json({ error: 'not-allowed' }, 400);

  const isPlaylist = target.includes('.m3u8');
  const fetchUrl = toFetchable(target);
  const upstream = await fetch(fetchUrl, {
    headers: { 'user-agent': request.headers.get('user-agent') ?? 'udonow-web' },
    cf: isPlaylist
      ? { cacheTtl: 2, cacheEverything: true }   // 재생목록은 자주 바뀐다
      : { cacheTtl: 60, cacheEverything: true }, // 세그먼트는 한 번 받으면 그대로
  } as RequestInit);

  if (!upstream.ok) return json({ error: 'upstream', status: upstream.status }, 502);

  const relayBase = `${url.origin}/api/cctv?url=`;
  if (!isPlaylist) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': 'video/mp2t',
        'cache-control': 'public, max-age=60',
        'access-control-allow-origin': url.origin,
      },
    });
  }

  /* m3u8 안의 상대 경로를 원본 기준 절대 URL 로 만든 뒤 릴레이 주소로 감싼다. */
  const text = await upstream.text();
  const dir = fetchUrl.slice(0, fetchUrl.lastIndexOf('/') + 1);
  const rewritten = text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return line;
      const absolute = trimmed.startsWith('http') ? trimmed : dir + trimmed;
      return relayBase + encodeURIComponent(absolute);
    })
    .join('\n');

  return new Response(rewritten, {
    headers: {
      'content-type': 'application/vnd.apple.mpegurl',
      'cache-control': 'no-store',
      'access-control-allow-origin': url.origin,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.protocol === 'http:') return httpsRedirect(url);

    if (url.pathname === '/api/cctv') {
      if (request.method !== 'GET') return json({ error: 'GET only' }, 405);
      return harden(await relayCctv(url, request));
    }

    if (url.pathname.startsWith('/api/udo/') || url.pathname.startsWith('/media/')) {
      if (request.method !== 'GET') return json({ error: 'GET only' }, 405);
      const proxied = url.pathname.startsWith('/media/') ? proxyMedia(url) : proxyApi(url);
      return harden(await proxied);
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'not-found' }, 404);

    return harden(await env.ASSETS.fetch(request));
  },
};
