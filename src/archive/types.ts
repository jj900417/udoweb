/*
 * 아카이브 엔티티 타입.
 *
 * 원칙
 * - 모든 엔티티는 불변 ID + slug + publishStatus 를 갖는다.
 * - 관계는 ID 배열로만 잇는다. 한 방향으로만 선언하고 역방향은 repository 가 파생한다
 *   (Work 가 artistIds 를 갖고 Artist 는 작품을 모른다 — 양쪽이 어긋날 일이 없다).
 * - 날짜는 정밀도를 함께 저장한다. "1930년대"를 "1934-01-01"로 만들지 않는다.
 * - 권리·동의가 확인되지 않은 것은 repository 인덱스에 아예 들어가지 않는다.
 * - 개인정보(연락처·주소·동의서 원본 경로·원본 master 경로)는 **필드 자체를 두지 않는다.**
 *   public 저장소에 그런 칸이 있으면 언젠가 채워진다.
 */
import type {
  ArchiveId,
  ArtistId,
  CollectionId,
  EntityKind,
  ExhibitionId,
  HistoryEntryId,
  LibraryItemId,
  MediaId,
  PlaceRefId,
  SessionId,
  SourceId,
  VoiceClipId,
  VoicePersonId,
  WorkId,
} from './ids';

/* ─── 값 객체 ────────────────────────────────────────────────────────── */

/** 편집 상태. 공개 화면에는 'published' 만 나간다(repository 에서 강제). */
export type PublishStatus = 'draft' | 'review' | 'published' | 'restricted';

export type DatePrecision = 'exact' | 'year' | 'decade' | 'approximate' | 'unknown';

export type ArchiveDate = {
  /** ISO 접두사만: '1932-04-03' | '1932' | '1930'(연대 시작) | ''(모를 때). */
  readonly value: string;
  readonly precision: DatePrecision;
  /** 화면에 그대로 쓸 표기('1930년대', '광복 직후'). 번역 대상. */
  readonly display?: string;
};

export type DateRange = {
  readonly start: ArchiveDate;
  readonly end?: ArchiveDate;
  readonly ongoing?: boolean;
};

export type RightsStatus = 'verified' | 'pending' | 'restricted' | 'unknown';

export type Rights = {
  readonly copyrightHolder: string;
  /** 화면에 반드시 표시되어야 하는 credit 문구. 번역 대상. */
  readonly creditLine: string;
  readonly webDisplayAllowed: boolean;
  readonly rightsStatus: RightsStatus;
  readonly exhibitionAllowed?: boolean;
  readonly publicationAllowed?: boolean;
  readonly licenseNote?: string;
  /** 'YYYY-MM-DD' — 허락 기간 끝. 지났으면 비공개로 취급한다. */
  readonly permissionExpiresOn?: string;
};

/** 구술 자료의 공개 동의 범위. 'public' 이 아니면 웹에 나가지 않는다. */
export type ConsentScope = 'public' | 'onsite' | 'research' | 'none';

export type ConsentRecord = {
  readonly obtained: boolean;
  readonly scope: ConsentScope;
  readonly obtainedOn?: string;
  /** 공개 범위에 대한 메모(내부 연락처·동의서 경로를 적는 칸이 아니다). */
  readonly note?: string;
};

export type MediaKind = 'image' | 'audio' | 'video' | 'document';
export type MediaVariant = 'thumb' | 'display' | 'full';

/**
 * 미디어 **메타데이터**. URL 은 여기 없다 — media.ts 의 mediaUrl() 이 만든다.
 * 저장소가 R2 로 옮겨가도 이 타입은 그대로 두고 함수만 바꾼다.
 */
export type MediaRef = {
  readonly id: MediaId;
  readonly kind: MediaKind;
  /** 저장소 중립 키: 'works/work-0001/main.jpg'. URL 도 public 경로도 아니다. */
  readonly key: string;
  readonly variants: readonly MediaVariant[];
  readonly width?: number;
  readonly height?: number;
  readonly durationSec?: number;
  /** 대체 텍스트. 작품 설명과 다른 것이다(설명은 엔티티의 summary/body). 번역 대상. */
  readonly alt: string;
  /** 미디어는 자기 권리를 따로 갖는다 — 레코드는 공개, 사진 한 장만 비공개가 가능. */
  readonly rights: Rights;
};

export type PlaceLink = {
  readonly placeId: PlaceRefId;
  /** '이 사진을 찍은 자리' 같은 메모. 번역 대상. */
  readonly note?: string;
};

/* ─── 엔티티 공통 ────────────────────────────────────────────────────── */

type EntityBase<TId extends ArchiveId, TKind extends EntityKind> = {
  readonly id: TId;
  readonly kind: TKind;
  /** URL 조각. 종류 안에서 유일. */
  readonly slug: string;
  readonly publishStatus: PublishStatus;
  /** 한국어 canonical. 번역 대상. */
  readonly title: string;
  readonly subtitle?: string;
  readonly summary?: string;
  /** 문단 배열. 번역은 배열 통째로 교체한다(index 병합 금지). */
  readonly body?: readonly string[];
  readonly rights: Rights;
  readonly sourceIds: readonly SourceId[];
  readonly places: readonly PlaceLink[];
  readonly tags: readonly string[];
  /** 편집 기록용 'YYYY-MM-DD'. */
  readonly updatedAt: string;
};

/* ─── 기록: 사람과 작품 ──────────────────────────────────────────────── */

export type ArtistRole =
  | 'photographer'
  | 'writer'
  | 'painter'
  | 'craft'
  | 'researcher'
  | 'resident'
  | 'other';

export type Artist = EntityBase<ArtistId, 'artist'> & {
  readonly displayName: string;
  readonly hanja?: string;
  readonly romanized?: string;
  readonly roles: readonly ArtistRole[];
  readonly birth?: ArchiveDate;
  readonly death?: ArchiveDate;
  readonly village?: string;
  readonly activePeriod?: DateRange;
  readonly statement?: readonly string[];
  readonly portraitMediaId?: MediaId;
  readonly externalUrl?: string;
};

export type Work = EntityBase<WorkId, 'work'> & {
  /** 비어 있을 수 있다(작자 미상). */
  readonly artistIds: readonly ArtistId[];
  readonly created: ArchiveDate;
  readonly medium?: string;
  readonly dimensions?: string;
  readonly accessionNumber?: string;
  readonly collectionIds: readonly CollectionId[];
  readonly exhibitionIds: readonly ExhibitionId[];
  /** 순서 있음 — [0] 이 대표 이미지. */
  readonly mediaIds: readonly MediaId[];
  readonly relatedIds: readonly ArchiveId[];
};

export type Collection = EntityBase<CollectionId, 'collection'> & {
  readonly curatorArtistIds: readonly ArtistId[];
  /** 종류가 섞일 수 있다 — ArchiveId 가 스스로 종류를 말하므로 wrapper 가 필요 없다. */
  readonly memberIds: readonly ArchiveId[];
  readonly coverMediaId?: MediaId;
};

export type Exhibition = EntityBase<ExhibitionId, 'exhibition'> & {
  readonly period: DateRange;
  readonly venue?: string;
  readonly online: boolean;
  readonly artistIds: readonly ArtistId[];
  readonly workIds: readonly WorkId[];
  readonly posterMediaId?: MediaId;
  readonly externalUrl?: string;
};

/* ─── 서재 ──────────────────────────────────────────────────────────── */

export type LibraryItemType =
  | 'book'
  | 'udoji'
  | 'periodical'
  | 'thesis'
  | 'report'
  | 'newspaper'
  | 'map'
  | 'av'
  | 'other';

export type LibraryItem = EntityBase<LibraryItemId, 'library'> & {
  readonly itemType: LibraryItemType;
  /** 자유 문자열 저자(아카이브 인물이 아닐 수 있다). */
  readonly authors: readonly string[];
  /** 저자가 아카이브에 등록된 사람일 때만. */
  readonly authorArtistIds: readonly ArtistId[];
  readonly publisher?: string;
  readonly published: ArchiveDate;
  readonly isbn?: string;
  readonly pageCount?: number;
  /** '우도면사무소 열람' 같은 소장·열람 안내. 번역 대상. */
  readonly holdingNote?: string;
  readonly externalUrl?: string;
  readonly coverMediaId?: MediaId;
  readonly relatedIds: readonly ArchiveId[];
};

/* ─── 역사 ──────────────────────────────────────────────────────────── */

export type HistoryCategory =
  | 'settlement'
  | 'village'
  | 'haenyeo'
  | 'agriculture'
  | 'transport'
  | 'education'
  | 'infrastructure'
  | 'tourism'
  | 'culture'
  | 'other';

export type HistoryEntry = EntityBase<HistoryEntryId, 'history'> & {
  readonly when: ArchiveDate;
  /** 타임라인 묶음 라벨('일제강점기', '1970년대'). 번역 대상. */
  readonly era?: string;
  readonly category: HistoryCategory;
  /** 타임라인 밀도 조절용 — 개요 화면에서는 major/notable 만 보이게 할 수 있다. */
  readonly significance: 'minor' | 'notable' | 'major';
  readonly relatedIds: readonly ArchiveId[];
  readonly mediaIds: readonly MediaId[];
};

/* ─── 출처 ──────────────────────────────────────────────────────────── */

export type SourceType =
  | 'book'
  | 'udoji'
  | 'article'
  | 'paper'
  | 'newspaper'
  | 'oral-history'
  | 'photo'
  | 'public-record'
  | 'website'
  | 'other';

export type Source = EntityBase<SourceId, 'source'> & {
  readonly sourceType: SourceType;
  /** 화면에 그대로 나가는 한 줄 인용. 번역 대상. 확인하지 않은 쪽수를 적지 않는다. */
  readonly citation: string;
  readonly author?: string;
  readonly editor?: string;
  readonly publisher?: string;
  readonly year?: ArchiveDate;
  readonly edition?: string;
  readonly volume?: string;
  readonly page?: string;
  readonly url?: string;
  readonly accessedOn?: string;
  readonly archiveName?: string;
  readonly libraryItemId?: LibraryItemId;
  readonly reliability: 'primary' | 'secondary' | 'unverified';
};

/* ─── 목소리 ────────────────────────────────────────────────────────── */

export type VoicePerson = EntityBase<VoicePersonId, 'voicePerson'> & {
  /** 화면에 쓰는 이름. 실명 비공개면 '해녀 김○○ 어르신' 처럼만 둔다. */
  readonly displayName: string;
  /** true 면 실명을 공개하지 않기로 한 것 — 다른 곳에 실명을 적지 않는다. */
  readonly anonymized: boolean;
  readonly birth?: ArchiveDate;
  readonly death?: ArchiveDate;
  readonly village?: string;
  readonly occupations: readonly string[];
  readonly consent: ConsentRecord;
  readonly portraitMediaId?: MediaId;
};

export type OralHistorySession = EntityBase<SessionId, 'session'> & {
  readonly personIds: readonly VoicePersonId[];
  readonly recordedOn: ArchiveDate;
  readonly location?: string;
  readonly interviewer?: string;
  readonly durationSec?: number;
  readonly language: 'ko-jejueo' | 'ko' | 'other';
  readonly themes: readonly string[];
  readonly clipIds: readonly VoiceClipId[];
  readonly consent: ConsentRecord;
};

export type VoiceClip = EntityBase<VoiceClipId, 'voiceClip'> & {
  readonly sessionId: SessionId;
  readonly personIds: readonly VoicePersonId[];
  readonly startSec?: number;
  readonly endSec?: number;
  /** 제주어 원문(들리는 대로). 번역이 아니라 원자료다. */
  readonly dialectText: readonly string[];
  /** 표준어 옮김. 없으면 표시하지 않는다(임의로 지어내지 않는다). */
  readonly standardKorean?: readonly string[];
  /** 이 말에 담긴 이야기 — 편집자 주. 번역 대상. */
  readonly context?: readonly string[];
  readonly audioMediaId?: MediaId;
  readonly themes: readonly string[];
  readonly relatedIds: readonly ArchiveId[];
};

/* ─── 합집합 + 타입가드 ─────────────────────────────────────────────── */

export type ArchiveEntity =
  | Artist
  | Work
  | Collection
  | Exhibition
  | LibraryItem
  | HistoryEntry
  | Source
  | VoicePerson
  | OralHistorySession
  | VoiceClip;

export const isArtist = (e: ArchiveEntity): e is Artist => e.kind === 'artist';
export const isWork = (e: ArchiveEntity): e is Work => e.kind === 'work';
export const isCollection = (e: ArchiveEntity): e is Collection => e.kind === 'collection';
export const isExhibition = (e: ArchiveEntity): e is Exhibition => e.kind === 'exhibition';
export const isLibraryItem = (e: ArchiveEntity): e is LibraryItem => e.kind === 'library';
export const isHistoryEntry = (e: ArchiveEntity): e is HistoryEntry => e.kind === 'history';
export const isSource = (e: ArchiveEntity): e is Source => e.kind === 'source';
export const isVoicePerson = (e: ArchiveEntity): e is VoicePerson => e.kind === 'voicePerson';
export const isSession = (e: ArchiveEntity): e is OralHistorySession => e.kind === 'session';
export const isVoiceClip = (e: ArchiveEntity): e is VoiceClip => e.kind === 'voiceClip';
