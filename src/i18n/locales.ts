/* 지원 언어. 한국어가 canonical(=src/data), 나머지는 오버레이. */
/* intl 은 날짜·숫자를 그 언어로 찍을 때 쓰는 BCP 47 태그예요(Intl / toLocaleString). */
export const locales = [
  { code: 'ko', label: '한국어', intl: 'ko-KR' },
  { code: 'en', label: 'English', intl: 'en-US' },
  { code: 'ja', label: '日本語', intl: 'ja-JP' },
  { code: 'zh', label: '中文', intl: 'zh-CN' },
] as const;

export type LocaleCode = (typeof locales)[number]['code'];
export const DEFAULT_LOCALE: LocaleCode = 'ko';
export const STORAGE_KEY = 'udoweb-locale';

/** 언어 코드 → Intl 로케일 태그. */
export function intlTag(code: LocaleCode): string {
  return locales.find((l) => l.code === code)?.intl ?? 'ko-KR';
}
