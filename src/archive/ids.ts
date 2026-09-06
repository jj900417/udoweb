/*
 * 아카이브 ID 체계.
 *
 * ID 는 **절대 바뀌지 않는다.** 사람이 읽는 제목(title)·주소(slug)는 바뀔 수 있지만
 * ID 는 고정이고, 엔티티 사이의 관계는 오직 ID 로만 잇는다(이름·배열 위치 금지).
 *
 * 타입은 template literal 로 잡는다 — `as const` 레코드에서 캐스트 없이 종류가 검사되고,
 * 'work-0001' 같은 문자열이 런타임에도 스스로 종류를 말해준다(혼합 배열에 wrapper 불필요).
 */
export type ArtistId = `artist-${string}`;
export type WorkId = `work-${string}`;
export type CollectionId = `collection-${string}`;
export type ExhibitionId = `exhibition-${string}`;
export type LibraryItemId = `library-${string}`;
export type HistoryEntryId = `history-${string}`;
export type SourceId = `source-${string}`;
export type VoicePersonId = `person-${string}`;
export type SessionId = `session-${string}`;
export type VoiceClipId = `clip-${string}`;
export type SoundId = `sound-${string}`;
export type MediaId = `media-${string}`;
export type PlaceRefId = `place-${string}`;

/** 아카이브 엔티티 ID 전체. 관계 배열(relatedIds 등)의 원소 타입. */
export type ArchiveId =
  | ArtistId
  | WorkId
  | CollectionId
  | ExhibitionId
  | LibraryItemId
  | HistoryEntryId
  | SourceId
  | VoicePersonId
  | SessionId
  | VoiceClipId
  | SoundId;

export type EntityKind =
  | 'artist'
  | 'work'
  | 'collection'
  | 'exhibition'
  | 'library'
  | 'history'
  | 'source'
  | 'voicePerson'
  | 'session'
  | 'voiceClip'
  | 'sound';

/** ID 접두사 → 종류. 새 종류를 추가하면 여기와 KIND_PATH 를 같이 늘린다. */
const PREFIX_TO_KIND: ReadonlyArray<readonly [string, EntityKind]> = [
  ['artist-', 'artist'],
  ['work-', 'work'],
  ['collection-', 'collection'],
  ['exhibition-', 'exhibition'],
  ['library-', 'library'],
  ['history-', 'history'],
  ['source-', 'source'],
  ['person-', 'voicePerson'],
  ['session-', 'session'],
  ['clip-', 'voiceClip'],
  ['sound-', 'sound'],
];

/** 'work-0001' → 'work'. 알 수 없는 문자열이면 null (절대 throw 하지 않는다). */
export function kindOfId(id: string): EntityKind | null {
  for (const [prefix, kind] of PREFIX_TO_KIND) {
    if (id.startsWith(prefix)) return kind;
  }
  return null;
}

/** 종류별 URL 세그먼트. 라우트 문자열을 페이지마다 짓지 않기 위해 여기 모은다. */
export const KIND_PATH: Readonly<Record<EntityKind, string>> = {
  artist: '/archive/artists',
  work: '/archive/works',
  collection: '/archive/collections',
  exhibition: '/archive/exhibitions',
  library: '/archive/library',
  history: '/history',
  source: '/archive/library', // 출처는 단독 페이지가 없다 — 서재로 보낸다
  voicePerson: '/voices',
  session: '/voices',
  voiceClip: '/voices',
  sound: '/sounds',
};

/** 상세 페이지 경로. 상세 라우트가 없는 종류(source·session·clip)는 목록 경로를 준다. */
export function entityPath(kind: EntityKind, slug: string): string {
  const base = KIND_PATH[kind];
  if (kind === 'source' || kind === 'session' || kind === 'voiceClip') return base;
  return `${base}/${slug}`;
}
