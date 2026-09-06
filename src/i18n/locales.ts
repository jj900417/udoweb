/* 지원 언어. 한국어가 canonical(=src/data), 나머지는 오버레이. */
export const locales = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
] as const;

export type LocaleCode = (typeof locales)[number]['code'];
export const DEFAULT_LOCALE: LocaleCode = 'ko';
export const STORAGE_KEY = 'udoweb-locale';
