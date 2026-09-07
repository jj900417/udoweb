import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { content } from './data';
import { LocaleProvider, merge, type Overlay } from './i18n';
import type { LocaleCode } from './i18n/locales';
import { basenameFor } from './i18n/route';
import { en } from './i18n/translations/en';
import { ja } from './i18n/translations/ja';
import { zh } from './i18n/translations/zh';
import { ThemeProvider } from './theme';

/**
 * 빌드할 때 화면을 HTML 로 미리 그려 두는 쪽 입구.
 *
 * 지금까지 방문자는 빈 `<div id="root">` 를 받고 브라우저가 JS 로 화면을 그렸어요.
 * 사람에게는 잘 보이지만 **검색엔진에게는 빈 페이지**예요 — 구글은 JS 를 실행해
 * 보기도 하지만 느리고 불확실하고, 네이버는 사실상 안 해요. 기록도 소개도 검색에
 * 안 잡히는 이유가 그거였어요.
 *
 * 여기서 그린 HTML 을 파일로 구워 두면 크롤러가 첫 응답에서 바로 본문을 읽어요.
 * 브라우저는 평소처럼 그 위에 붙어서 나머지를 이어받고요.
 *
 * ⚠️ **바뀌는 정보는 굽지 않아요.** 배 시간·요금·가게 영업시간은 앱 서버가 단일
 * 소스라(불변식 #4) 여기서 불러오지 않아요. 그런 컴포넌트는 서버에서 빈 상태로
 * 그려지고 브라우저가 실데이터를 받아 채워요. 굳은 배 시간을 HTML 에 박아 두면
 * 틀린 안내가 검색 결과에 남아요 — 마지막 배를 놓치는 종류의 사고예요(불변식 #8).
 */
const overlays: Record<LocaleCode, Overlay | null> = { ko: null, en, ja, zh };

/** 그 언어의 문안. 화면과 `<title>` 이 같은 병합을 거치게 해요. */
export function contentFor(locale: LocaleCode) {
  return merge(content, overlays[locale]);
}

/**
 * 한 경로 × 한 언어를 HTML 조각으로.
 *
 * `path` 는 접두어를 뗀 경로(`/about`)를 받아요. `StaticRouter` 에는 접두어를
 * 도로 붙여 넘겨야 해요 — 브라우저에서 `BrowserRouter` 가 읽는 `window.location`
 * 이 그 형태라, 여기서만 다르게 주면 서버가 그린 것과 브라우저가 그린 것이
 * 어긋나요(hydration mismatch).
 */
export function render(path: string, locale: LocaleCode): string {
  const basename = basenameFor(locale);
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <LocaleProvider forced={locale}>
          <StaticRouter
            basename={basename || undefined}
            location={`${basename}${path === '/' ? '/' : path}`}
          >
            <App />
          </StaticRouter>
        </LocaleProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
