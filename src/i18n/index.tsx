import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { content, type Content } from '../data';
import { DEFAULT_LOCALE, STORAGE_KEY, type LocaleCode } from './locales';
import { en } from './translations/en';
import { ja } from './translations/ja';
import { zh } from './translations/zh';

/*
 * 번역 = 한국어 canonical 위에 얹는 부분 오버레이.
 * - 객체: 키 단위로 덮어쓴다.
 * - 배열: index 단위로 덮어쓴다(순서를 canonical 과 맞출 것). 길이가 짧으면
 *   나머지 항목은 한국어 그대로 남는다 — 번역을 점진적으로 채울 수 있다.
 * 고유값(전화번호·URL·좌표·id)은 오버레이에 넣지 않는다.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T;

/* canonical 이 `as const` 라 리터럴 타입이 되므로, 오버레이 쪽은 넓혀서 받는다. */
export type DeepPartial<T> = T extends readonly (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Widen<T>;

export type Overlay = DeepPartial<Content>;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** 빌드 시 prerender 도 같은 병합을 써요 — 화면과 검색 결과가 갈라지지 않게. */
export function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    return base.map((item, i) => merge(item, over[i])) as unknown as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(over)) return base;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(over)) {
      if (key in out) out[key] = merge(out[key], over[key]);
    }
    return out as unknown as T;
  }
  return over as T;
}

const overlays: Record<LocaleCode, Overlay | null> = { ko: null, en, ja, zh };

type Ctx = {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  content: Content;
};

const LocaleContext = createContext<Ctx | null>(null);

/*
 * 브라우저·폰이 알려주는 선호 언어에서 우리가 가진 언어를 고른다.
 *
 * navigator.languages 는 사용자가 정한 **우선순위 목록**이다('ja-JP','en-US','ko').
 * 앞에서부터 보며 처음 맞는 것을 쓴다 — 'ja-JP' 처럼 지역이 붙어 오므로 앞의
 * 기본 태그만 본다. 중국어는 zh-CN·zh-TW·zh-Hans 가 모두 오지만 우리는 한 벌뿐이라
 * 전부 zh 로 모은다.
 *
 * 하나도 못 맞추면(프랑스어 등 우리가 가진 게 없는 언어) 기본값인 한국어로 둔다.
 */
function detectLocale(): LocaleCode | null {
  const preferred =
    typeof navigator === 'undefined'
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : [];
  if (preferred.length === 0) return null;

  for (const tag of preferred) {
    const base = tag.toLowerCase().split('-')[0];
    if (base in overlays) return base as LocaleCode;
  }
  return null;
}

/*
 * 언어를 정하는 규칙 — **기기 설정이 항상 이긴다.**
 *
 * 들어올 때마다 폰·브라우저의 언어를 다시 읽어 그대로 맞춘다. 폰을 영어로 바꾸면
 * 영어로, 한국어로 되돌리면 한국어로 나온다. 감지가 안 되면 한국어(DEFAULT_LOCALE).
 *
 * 선택기로 직접 고른 언어는 **그 방문 동안만** 유지한다(sessionStorage). 그래서
 * localStorage 가 아니다 — localStorage 에 넣으면 한 번의 선택이 기기 설정을 영영
 * 눌러버려서, 나중에 폰 언어를 바꿔도 웹이 따라가지 못한다.
 */
function readSessionPick(): LocaleCode | null {
  try {
    const pick = sessionStorage.getItem(STORAGE_KEY);
    return pick && pick in overlays ? (pick as LocaleCode) : null;
  } catch {
    return null; /* storage 가 막힌 환경 — 감지만으로 간다 */
  }
}

function resolveLocale(): LocaleCode {
  /*
   * 예전 버전이 localStorage 에 넣어 둔 선택을 지운다. 남겨 두면 아무 힘도 없으면서
   * 나중에 저장소를 들여다볼 때 혼란만 준다.
   */
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return readSessionPick() ?? detectLocale() ?? DEFAULT_LOCALE;
}

export function LocaleProvider({
  children,
  forced,
}: {
  children: ReactNode;
  /**
   * 주소가 정한 언어(`/ja/...`). 있으면 이게 이겨요.
   *
   * 접두어 없는 주소에서는 예전 그대로 기기 설정이 이겨요 — 규칙이 바뀐 게
   * 아니라, 사람이 **주소로 언어를 직접 말한 경우**가 새로 생긴 거예요.
   * 그래야 일본어 페이지에 링크를 걸거나 검색결과에서 들어올 수 있어요.
   */
  forced?: LocaleCode;
}) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => forced ?? resolveLocale());

  const setLocale = useCallback((l: LocaleCode) => {
    setLocaleState(l);
    try {
      /* 이번 방문 동안만 기억한다 — 다음에 들어오면 다시 기기 언어를 따른다. */
      sessionStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, content: merge(content, overlays[locale]) }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}

/** 콘텐츠 접근의 유일한 경로. 컴포넌트는 src/data 를 직접 import 하지 않는다. */
export function useContent(): Content {
  return useLocale().content;
}
