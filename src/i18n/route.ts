import { DEFAULT_LOCALE, locales, type LocaleCode } from './locales';

/**
 * 언어를 주소로도 고를 수 있게 하는 것.
 *
 * 지금까지 언어는 기기 설정으로만 정해졌고, 그건 사람에게는 좋은 규칙이에요 —
 * 폰을 일본어로 쓰는 사람이 들어오면 일본어가 나오니까요. 그런데 검색엔진에는
 * 주소가 하나뿐이라 **한 언어만 색인돼요.** 일본어 문서는 세상에 존재하지 않는
 * 것과 같아요.
 *
 * 그래서 주소를 하나 더 만들어요. 한국어는 접두어 없이 `/about`, 나머지는
 * `/ja/about` 처럼요. 접두어가 있으면 그 언어로 고정되고, 없으면 예전 그대로
 * 기기 설정을 따라요 — **기존 주소와 기존 동작이 하나도 안 바뀌어요.**
 *
 * 링크는 고치지 않아요. React Router 의 `basename` 이 `<Link to="/about">` 을
 * 알아서 `/ja/about` 으로 바꿔 주거든요. 화면 코드는 접두어를 몰라도 돼요.
 */
export const LOCALE_PREFIXES: Record<Exclude<LocaleCode, 'ko'>, string> = {
  en: '/en',
  ja: '/ja',
  zh: '/zh',
};

/** 이 언어로 가는 주소의 앞부분. 한국어는 빈 문자열이에요(canonical). */
export function basenameFor(locale: LocaleCode): string {
  return locale === DEFAULT_LOCALE ? '' : LOCALE_PREFIXES[locale as Exclude<LocaleCode, 'ko'>];
}

export interface LocaleRoute {
  /** 주소가 언어를 정했으면 그 언어, 아니면 `null`(기기 설정에 맡겨요). */
  locale: LocaleCode | null;
  /** React Router 에 넘길 basename. */
  basename: string;
  /** 접두어를 뗀 경로. `/ja/about` → `/about` */
  path: string;
}

/**
 * 주소에서 언어를 떼어내요.
 *
 * `/ja` 처럼 접두어만 있는 경우도 `/` 로 봐요 — 그게 그 언어의 홈이니까요.
 * `/january` 가 `/ja` 로 잘못 걸리지 않도록 **경계까지 확인**해요.
 */
export function splitLocale(pathname: string): LocaleRoute {
  for (const [code, prefix] of Object.entries(LOCALE_PREFIXES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return {
        locale: code as LocaleCode,
        basename: prefix,
        path: pathname.slice(prefix.length) || '/',
      };
    }
  }
  return { locale: null, basename: '', path: pathname || '/' };
}

/** 같은 화면의 다른 언어 주소. 언어 선택기와 hreflang 이 같이 써요. */
export function localizedPath(locale: LocaleCode, path: string): string {
  const clean = path === '/' ? '' : path;
  return `${basenameFor(locale)}${clean}` || '/';
}

/** 네 언어 전부. sitemap 과 hreflang 이 이 목록으로 만들어져요. */
export const LOCALE_CODES: readonly LocaleCode[] = locales.map((entry) => entry.code);
