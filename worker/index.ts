/*
 * Cloudflare Worker — udonow.co.kr
 *
 * 1) 정적 자산(dist/)을 SPA 폴백으로 서빙 (assets 바인딩; wrangler.jsonc)
 * 2) /api/udo/*  → 우도 나우 앱 서버의 **읽기 전용 공개 엔드포인트** 동일출처 프록시
 * 3) /media/*    → 앱 서버의 사진 파일 프록시
 * 4) /api/support → 고객지원 문의를 앱 서버 건의사항 창구로 넘기는 **유일한 쓰기 경로**
 * 5) /privacy·/terms 등 → 앱 서버의 법적 문서를 브랜드 도메인으로 중계
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

/*
 * 앱 서버의 법적 문서. **고정 집합**이다(사용자 입력이 경로에 들어가지 않는다).
 * 방침·약관 원문은 앱 서버가 단일 소스이고 버전이 붙는다 — 저장소에 복제하면
 * 개정될 때 웹만 옛 문서를 들고 있게 된다. 그래서 여기서 그대로 중계한다.
 * 문서 안의 링크가 서로 이 5개를 가리키므로 하나라도 빠지면 링크가 404 가 된다.
 */
const LEGAL_PAGES = [
  '/privacy',
  '/terms',
  '/account-delete',
  '/legal/privacy/2026-07',
  '/legal/privacy/2026-08',
];

/*
 * 고객지원 문의(/support) → 앱 서버 건의사항 창구.
 *
 * 앱 서버가 이미 하는 일: 유형 프리셋 검증·길이 검증·이메일 형식 검증·IP 시간당 제한·
 * 저장·운영자 콘솔 노출. 그래서 여기서는 **저장소를 새로 만들지 않고** 앞단 방어만 한다.
 */
const FEEDBACK_PATH = '/v1/feedback';
/** 앱 서버 FEEDBACK_CATEGORIES 와 1:1. 다른 값은 앱 서버가 400 으로 거부한다. */
const SUPPORT_CATEGORIES = ['feature', 'bug', 'info_fix', 'inquiry', 'other'];
const SUPPORT_PLATFORMS = ['ios', 'android', 'web', 'other'];
/** 본문 상한 — 제목 100 + 내용 5000 자에 여유를 둔 값. 넘으면 읽지 않고 끊는다. */
const SUPPORT_MAX_BYTES = 20_000;
/** 사람이 제목과 내용을 채우는 데 이보다 덜 걸릴 수 없다. 봇 필터. */
const SUPPORT_MIN_ELAPSED_MS = 2000;

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

/* ─── 고객지원 문의 ────────────────────────────────────────────────── */

/** 문자열 필드 하나 — 문자열이 아니면 빈 값으로 본다(타입 혼동 방어). */
function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * 문의 한 건을 앱 서버로 넘긴다.
 *
 * 여기서 막는 것(앱 서버가 못 보는 것):
 *  - 다른 사이트에서 부르는 폼 제출(같은 출처만)
 *  - 거대한 본문
 *  - 허니팟에 걸린 자동 제출 — **성공처럼 보이게 돌려준다.** 봇이 실패를 학습하면
 *    필드를 피해서 다시 온다. 사람에게는 영향이 없다(그 칸은 화면 밖에 있다).
 *  - 알 수 없는 필드 통과. 앱 서버로는 **아는 키만** 새로 조립해서 보낸다.
 *
 * 앱 서버가 계속 맡는 것: 값 재검증, IP 시간당 제한, 저장, 운영자 콘솔.
 *
 * ⚠ 본문·이메일을 로그에 남기지 않는다. 남길 일이 생겨도 유형과 길이까지만.
 */
async function submitSupport(request: Request, url: URL): Promise<Response> {
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return json({ error: 'not-allowed' }, 403);

  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > SUPPORT_MAX_BYTES) return json({ error: 'too-large' }, 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: 'bad-json' }, 400);
  }
  /* content-length 를 안 보내는 요청도 있으므로 실제 길이로 한 번 더 본다. */
  if (raw.length > SUPPORT_MAX_BYTES) return json({ error: 'too-large' }, 413);

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return json({ error: 'bad-json' }, 400);
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'bad-json' }, 400);
  }

  /* 봇 — 조용히 흡수한다. 앱 서버로는 가지 않는다. */
  const elapsed = typeof payload.elapsed === 'number' ? payload.elapsed : 0;
  if (str(payload.hp, 64) !== '' || elapsed < SUPPORT_MIN_ELAPSED_MS) {
    return json({ ok: true });
  }

  const category = str(payload.category, 20);
  const title = str(payload.title, 100);
  const message = str(payload.message, 5000);
  const email = str(payload.email, 254);
  if (!SUPPORT_CATEGORIES.includes(category)) return json({ error: 'invalid' }, 400);
  if (!title || !message) return json({ error: 'invalid' }, 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid' }, 400);

  const platform = str(payload.platform, 16).toLowerCase();
  const body: Record<string, unknown> = {
    category,
    title,
    message,
    meta: {
      /* 앱 서버 Feedback 컬럼 길이에 맞춘 값. 기기 모델은 저장할 칸이 없어 받지 않는다. */
      platform: SUPPORT_PLATFORMS.includes(platform) ? platform : 'web',
      app_version: str(payload.app_version, 20),
      os_version: str(payload.os_version, 40),
      locale: str(payload.locale, 16),
      destination_slug: 'udo',
    },
  };
  if (email) body.email = email;

  try {
    const r = await fetch(`${ORIGIN}${FEEDBACK_PATH}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        /*
         * 진짜 방문자 IP 를 넘긴다. 이걸 빼면 앱 서버의 시간당 IP 제한이 **워커의
         * 나가는 IP 하나**에 걸려, 한 사람이 10건을 보내면 그 뒤로 모든 방문자의
         * 문의가 막힌다. 이 헤더는 Cloudflare 엣지가 덮어쓰므로 방문자가 위조할 수 없다.
         */
        ...(request.headers.get('cf-connecting-ip')
          ? { 'cf-connecting-ip': request.headers.get('cf-connecting-ip') as string }
          : {}),
      },
      body: JSON.stringify(body),
    });
    if (r.ok) return json({ ok: true });
    if (r.status === 429) return json({ error: 'too-many' }, 429);
    if (r.status === 400 || r.status === 422) return json({ error: 'invalid' }, 400);
    return json({ error: 'upstream-unavailable' }, 502);
  } catch {
    return json({ error: 'upstream-unavailable' }, 502);
  }
}

/* ─── 법적 문서 중계 ───────────────────────────────────────────────── */

/** LEGAL_PAGES 에 있는 경로만. 앱 서버 HTML 을 그대로 돌려준다. */
async function proxyLegal(pathname: string): Promise<Response> {
  try {
    const r = await fetch(`${ORIGIN}${pathname}`, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    } as RequestInit);
    return new Response(r.body, {
      status: r.status,
      headers: {
        'content-type': r.headers.get('content-type') ?? 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
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

    if (url.pathname === '/api/support') {
      if (request.method !== 'POST') return harden(json({ error: 'POST only' }, 405));
      const out = harden(await submitSupport(request, url));
      /* 문의 응답은 어디에도 남기지 않는다. */
      out.headers.set('cache-control', 'no-store');
      return out;
    }

    if (url.pathname.startsWith('/api/udo/') || url.pathname.startsWith('/media/')) {
      if (request.method !== 'GET') return json({ error: 'GET only' }, 405);
      const proxied = url.pathname.startsWith('/media/') ? proxyMedia(url) : proxyApi(url);
      return harden(await proxied);
    }
    if (url.pathname.startsWith('/api/')) return harden(json({ error: 'not-found' }, 404));

    /* 개인정보처리방침·이용약관 — 앱 서버 문서를 이 도메인에서 연다(단일 소스 유지). */
    if (LEGAL_PAGES.includes(url.pathname)) {
      if (request.method !== 'GET') return harden(json({ error: 'GET only' }, 405));
      return harden(await proxyLegal(url.pathname));
    }

    return harden(await env.ASSETS.fetch(request));
  },
};
