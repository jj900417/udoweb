/**
 * 라우트마다 HTML 을 미리 구워요.
 *
 * `vite build` 는 빈 껍데기 `index.html` 하나만 내놔요. 그걸 그대로 올리면
 * 크롤러는 `<div id="root"></div>` 를 받고 돌아가요 — 사이트에 글이 아무리 많아도
 * 검색에는 없는 것과 같아요.
 *
 * 여기서는 화면을 서버에서 그려서 경로마다 파일로 써요:
 *
 *     dist/index.html            /            (한국어)
 *     dist/about/index.html      /about
 *     dist/ja/about/index.html   /ja/about
 *
 * 브라우저는 예전과 똑같이 동작해요. 받은 HTML 위에 React 가 붙을 뿐이에요.
 *
 * ⚠️ **바뀌는 정보는 안 굽혀요.** 배 시간·요금·가게는 앱 서버가 단일 소스라
 * 여기서 부르지 않아요(불변식 #4·#8). 그런 자리는 빈 상태로 구워지고 브라우저가
 * 채워요 — 굳은 배 시간이 검색 결과에 남는 것보다 그게 나아요.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

/*
 * SSR 번들은 `dist/` **밖**에 둬요.
 *
 * 안에 두면 Cloudflare 가 `dist/` 를 통째로 공개 자산으로 올려서
 * `/server/entry-server.js` 로 서빙돼요. 지금 그 안에 비밀은 없지만(클라이언트
 * 번들에 이미 있는 코드와 같은 문안), 서버 빌드 산출물이 공개 경로에 있는 건
 * 그 자체로 잘못이고 언젠가 진짜 새는 자리가 돼요.
 */
const { render, contentFor } = await import(join(root, '.ssr/entry-server.js'));

const template = await readFile(join(dist, 'index.html'), 'utf8');

/** 한국어는 접두어가 없어요 — 그게 canonical 이에요. */
const LOCALES = ['ko', 'en', 'ja', 'zh'];
const prefix = (locale) => (locale === 'ko' ? '' : `/${locale}`);

const SITE_URL = 'https://udonow.co.kr';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** `</script>` 가 든 문안이 문서를 끊지 않도록. */
function embedJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * 이 페이지의 머리말.
 *
 * 지금까지 모든 페이지가 홈의 제목·설명을 달고 나갔어요. 검색 결과에서 어느
 * 페이지인지 구분이 안 됐다는 뜻이에요.
 */
function head({ path, locale, seo, siteName }) {
  const url = `${SITE_URL}${prefix(locale)}${path === '/' ? '/' : path}`;
  const alternates = LOCALES.map(
    (code) =>
      `<link rel="alternate" hreflang="${code}" href="${escapeHtml(
        `${SITE_URL}${prefix(code)}${path === '/' ? '/' : path}`,
      )}">`,
  );

  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    ...alternates,
    /* 우리가 가진 언어가 아닌 사람에게는 한국어 홈을 보여줘요. */
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(
      `${SITE_URL}${path === '/' ? '/' : path}`,
    )}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}">`,
    `<meta property="og:locale" content="${escapeHtml(locale)}">`,
    /*
     * 절대 URL 이어야 해요. 카톡·페북 스크래퍼는 상대 경로를 해석하지 않아서
     * `/og.png` 라고 쓰면 이미지가 아예 안 떠요.
     */
    `<meta property="og:image" content="${SITE_URL}/og.png">`,
    '<meta name="twitter:card" content="summary_large_image">',
  ].join('\n    ');
}

/**
 * 홈에만 넣는 구조화 데이터.
 *
 * 검색엔진에게 이 사이트가 **무엇에 관한 것인지** 정해진 단어로 말해 줘요.
 * 확인되지 않은 것은 넣지 않아요 — 운영 주체가 확정되기 전이라 조직 정보는
 * 사이트 이름과 주소까지만 말해요(불변식 #10: '공식' 표현 금지).
 */
function structuredData({ locale, seo, siteName }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: `${SITE_URL}${prefix(locale)}/`,
    description: seo.description,
    inLanguage: locale,
  };
}

const HEAD_START = '<!-- head:start';
const HEAD_END = '<!-- head:end -->';

/** 마커 사이를 갈아끼워요. 마커가 없으면 조용히 넘어가지 않고 멈춰요. */
function replaceHead(html, replacement) {
  const start = html.indexOf(HEAD_START);
  const end = html.indexOf(HEAD_END);
  if (start === -1 || end === -1) {
    throw new Error(
      'index.html 에서 head 마커를 찾지 못했어요. <!-- head:start --> ~ <!-- head:end --> 가 있어야 해요.',
    );
  }
  return html.slice(0, start) + replacement + html.slice(end + HEAD_END.length);
}

let written = 0;
const urls = [];

for (const locale of LOCALES) {
  const content = contentFor(locale);
  const siteName = content.site?.name ?? '우도';
  const paths = Object.keys(content.seo ?? {});

  for (const path of paths) {
    const seo = content.seo[path];
    const body = render(path, locale);

    let html = template
      .replace('<html lang="ko"', `<html lang="${locale}"`)
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

    /*
     * 템플릿의 기본 머리말을 이 페이지 것으로 바꿔요.
     *
     * 마커 사이만 건드려요. 예전에는 `<title>`부터 `twitter:card`까지를 정규식으로
     * 잡았는데, 그러면 **주석 안에 우연히 들어간 `<title>` 글자**에도 걸려서 그
     * 위의 태그를 삼켰어요(실제로 구글 소유권 확인 태그가 그렇게 사라졌어요).
     * 마커는 그런 사고가 나지 않아요.
     */
    html = replaceHead(html, head({ path, locale, seo, siteName }));

    if (path === '/') {
      html = html.replace(
        '</head>',
        `  <script type="application/ld+json">${embedJson(
          structuredData({ locale, seo, siteName }),
        )}</script>\n  </head>`,
      );
    }

    const outDir = join(dist, `${prefix(locale)}${path}`.replace(/^\//, '') || '.');
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), html, 'utf8');
    written += 1;
    urls.push({ loc: `${SITE_URL}${prefix(locale)}${path === '/' ? '/' : path}`, path, locale });
  }
}

/*
 * 없는 주소에 답할 404 페이지.
 *
 * Cloudflare 가 이 파일을 404 상태로 돌려줘요. 예전에는 아무 주소나 홈을 200 으로
 * 받았는데, 그건 검색엔진에게 "여기 페이지가 있다"는 말이라 없는 페이지가 색인돼요.
 */
{
  const locale = 'ko';
  const content = contentFor(locale);
  const body = render('/__not-found__', locale);
  const seo = {
    title: `${content.seo['/'].title} — 페이지를 찾을 수 없어요`,
    description: content.seo['/'].description,
  };
  let html = replaceHead(
    template.replace('<div id="root"></div>', `<div id="root">${body}</div>`),
    `${head({ path: '/', locale, seo, siteName: content.site?.name ?? '우도' })}\n    <meta name="robots" content="noindex">`,
  );
  await writeFile(join(dist, '404.html'), html, 'utf8');
}

/* sitemap — 크롤러에게 무엇이 있는지 알려 주는 목록이에요. */
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
    ' xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls.map(
    ({ loc, path }) =>
      `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n` +
      LOCALES.map(
        (code) =>
          `    <xhtml:link rel="alternate" hreflang="${code}" href="${escapeHtml(
            `${SITE_URL}${prefix(code)}${path === '/' ? '/' : path}`,
          )}"/>`,
      ).join('\n') +
      '\n  </url>',
  ),
  '</urlset>',
].join('\n');
await writeFile(join(dist, 'sitemap.xml'), `${sitemap}\n`, 'utf8');

/* robots.txt — 사이트맵이 어디 있는지 알려 주는 게 핵심이에요. */
await writeFile(
  join(dist, 'robots.txt'),
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n'),
  'utf8',
);

process.stdout.write(`prerender: ${written}개 페이지 · sitemap ${urls.length}개 URL\n`);
