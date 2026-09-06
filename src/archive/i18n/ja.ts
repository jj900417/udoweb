import type { ArchiveTranslation } from './types';

/*
 * アーカイブ記録の日本語訳。キーが無い項目は韓国語のまま表示される。
 *
 * 키는 **엔티티 ID**다(배열 순서 아님). 번역되지 않은 항목·필드는 한국어 원문이 남는다.
 * 구술 원문(dialectText)은 원자료이므로 번역으로 덮지 않는다 — 옮김이 필요하면
 * standardKorean/ context 를 쓰고, 확인되지 않은 내용을 지어내지 않는다.
 */
export const ja: ArchiveTranslation = {
  locale: 'ja',
  entries: {},
  media: {},
};
