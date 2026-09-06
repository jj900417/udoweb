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

function merge<T>(base: T, over: unknown): T {
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

function readStoredLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
    if (saved && saved in overlays) return saved;
  } catch {
    /* storage blocked — fall through to default */
  }
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(readStoredLocale);

  const setLocale = useCallback((l: LocaleCode) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
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
