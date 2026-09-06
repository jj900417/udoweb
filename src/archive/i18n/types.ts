/*
 * 아카이브 번역 = **ID 키 패치**.
 *
 * 일반 UI 문안(src/data)은 배열 index 로 병합하지만, 아카이브 레코드는 계속 추가되고
 * 순서가 바뀌므로 index 병합을 쓰면 언젠가 조용히 오역된다. 그래서 여기서는
 * entries['artist-0001'] 처럼 **불변 ID** 로만 잇는다.
 *
 * 번역 가능한 필드는 아래 목록으로 닫아 둔다 — id·slug·좌표·URL·등록번호처럼
 * 번역되면 안 되는 값이 실수로 덮이지 않게 한다.
 */
import type { ArchiveId, MediaId, PlaceRefId } from '../ids';
import type { LocaleCode } from '../../i18n/locales';

export type ArchivePatch = {
  readonly title?: string;
  readonly subtitle?: string;
  readonly summary?: string;
  /** 문단 배열은 **통째로** 교체한다(index 병합 금지). */
  readonly body?: readonly string[];
  readonly tags?: readonly string[];
  readonly creditLine?: string;
  readonly dateDisplay?: string;
  readonly era?: string;
  readonly medium?: string;
  readonly dimensions?: string;
  readonly venue?: string;
  readonly citation?: string;
  readonly holdingNote?: string;
  readonly village?: string;
  readonly displayName?: string;
  readonly occupations?: readonly string[];
  readonly statement?: readonly string[];
  readonly context?: readonly string[];
  readonly themes?: readonly string[];
  readonly placeNotes?: Readonly<Partial<Record<PlaceRefId, string>>>;
};

export type MediaPatch = {
  readonly alt?: string;
  readonly creditLine?: string;
};

export type ArchiveTranslation = {
  readonly locale: LocaleCode;
  /** Partial<Record<..>> 로 선언해 조회 결과가 `| undefined` 로 잡히게 한다. */
  readonly entries: Readonly<Partial<Record<ArchiveId, ArchivePatch>>>;
  readonly media: Readonly<Partial<Record<MediaId, MediaPatch>>>;
};
