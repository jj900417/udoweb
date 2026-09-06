/*
 * 아카이브 저장소(repository).
 *
 * 페이지는 레코드 배열을 직접 읽지 않는다 — 여기 셀렉터만 쓴다. Phase 2 에서
 * 데이터가 API 로 옮겨가도 createArchive 에 다른 dataset 을 먹이면 되고 화면 코드는
 * 그대로다(docs/archive-architecture.md).
 *
 * ★ 공개 판정은 **인덱스를 만들 때 한 번만** 한다. 비공개 레코드는 byId 에 애초에
 *   들어가지 않으므로, 어떤 셀렉터·관계 해석기도 draft 를 흘릴 수 없다.
 *   필터를 잊을 두 번째 장소가 없다는 것이 이 설계의 핵심이다.
 */
import type { ArchiveDataset } from './records';
import { dataset as staticDataset } from './records';
import type {
  ArchiveId,
  ArtistId,
  CollectionId,
  EntityKind,
  ExhibitionId,
  MediaId,
  PlaceRefId,
  SessionId,
  SourceId,
  VoicePersonId,
} from './ids';
import type {
  ArchiveDate,
  ArchiveEntity,
  Artist,
  Collection,
  Exhibition,
  HistoryEntry,
  LibraryItem,
  LibraryItemType,
  MediaRef,
  OralHistorySession,
  Rights,
  Source,
  VoiceClip,
  VoicePerson,
  Work,
} from './types';
import {
  isArtist,
  isCollection,
  isExhibition,
  isHistoryEntry,
  isLibraryItem,
  isSession,
  isSource,
  isVoiceClip,
  isVoicePerson,
  isWork,
} from './types';
import type { ArchiveIndex, DroppedRef, RelatedGroup } from './relations';
import { EMPTY, collectDeclaredIds, getRelated, resolveAny, resolveMany, resolveOne } from './relations';
import type { ArchiveTranslation } from './i18n/types';
import { archiveTranslations, localizeEntity, localizeMedia } from './i18n';
import type { LocaleCode } from '../i18n/locales';

export type Visibility = {
  /** 개발 미리보기 전용. 프로덕션 빌드에서는 항상 false. */
  readonly includeUnpublished: boolean;
  /** 'YYYY-MM-DD'. 권리 만료 판정을 결정적으로 하기 위해 주입한다. */
  readonly today: string;
};

export type SortKey = 'default' | 'dateAsc' | 'dateDesc' | 'title';

export type ListOptions<T> = {
  readonly tag?: string;
  readonly placeId?: PlaceRefId;
  readonly sort?: SortKey;
  readonly limit?: number;
  readonly filter?: (item: T) => boolean;
};

export type ArchiveStats = {
  readonly total: number;
  readonly hidden: number;
  readonly droppedRefs: number;
};

/* ─── 공개 판정 ─────────────────────────────────────────────────────── */

function rightsClear(rights: Rights, today: string): boolean {
  if (!rights.webDisplayAllowed) return false;
  if (rights.rightsStatus !== 'verified') return false;
  if (rights.permissionExpiresOn && rights.permissionExpiresOn < today) return false;
  return true;
}

function statusClear(entity: ArchiveEntity, v: Visibility): boolean {
  if (v.includeUnpublished) return entity.publishStatus !== 'restricted';
  return entity.publishStatus === 'published';
}

/**
 * 구술 자료는 동의 범위가 'public' 일 때만 나간다.
 * 클립은 자기 동의가 따로 없고 세션·인물의 동의를 따른다(가장 엄격한 쪽).
 */
function consentClear(entity: ArchiveEntity, data: ArchiveDataset): boolean {
  const ok = (c: { obtained: boolean; scope: string }) => c.obtained && c.scope === 'public';

  if (isVoicePerson(entity)) return ok(entity.consent);
  if (isSession(entity)) {
    if (!ok(entity.consent)) return false;
    return entity.personIds.every((pid) => {
      const person = data.people.find((p) => p.id === pid);
      return person ? ok(person.consent) : false;
    });
  }
  if (isVoiceClip(entity)) {
    const session = data.sessions.find((s) => s.id === entity.sessionId);
    if (!session) return false;
    return consentClear(session, data);
  }
  return true;
}

function isVisible(entity: ArchiveEntity, v: Visibility, data: ArchiveDataset): boolean {
  if (!statusClear(entity, v)) return false;
  if (!rightsClear(entity.rights, v.today)) return false;
  return consentClear(entity, data);
}

/* ─── 정렬 ──────────────────────────────────────────────────────────── */

/** 연대('1930')는 중간값으로, 모르는 날짜는 가장 뒤로. */
export function dateSortKey(d: ArchiveDate | undefined): number {
  if (!d || d.precision === 'unknown' || !d.value) return Number.NEGATIVE_INFINITY;
  const [y, m, day] = d.value.split('-');
  const year = Number(y);
  if (Number.isNaN(year)) return Number.NEGATIVE_INFINITY;
  const base = d.precision === 'decade' ? year + 5 : year;
  const month = m ? Number(m) : 1;
  const date = day ? Number(day) : 1;
  return base * 10000 + (Number.isNaN(month) ? 1 : month) * 100 + (Number.isNaN(date) ? 1 : date);
}

function entityDate(e: ArchiveEntity): ArchiveDate | undefined {
  if (isWork(e)) return e.created;
  if (isHistoryEntry(e)) return e.when;
  if (isExhibition(e)) return e.period.start;
  if (isLibraryItem(e)) return e.published;
  if (isSession(e)) return e.recordedOn;
  if (isArtist(e)) return e.activePeriod?.start ?? e.birth;
  if (isVoicePerson(e)) return e.birth;
  return undefined;
}

function compare(a: ArchiveEntity, b: ArchiveEntity, sort: SortKey): number {
  if (sort === 'title') return a.title.localeCompare(b.title, 'ko') || a.id.localeCompare(b.id);
  const ka = dateSortKey(entityDate(a));
  const kb = dateSortKey(entityDate(b));
  if (ka !== kb) return sort === 'dateAsc' ? ka - kb : kb - ka;
  return a.title.localeCompare(b.title, 'ko') || a.id.localeCompare(b.id);
}

function applyOptions<T extends ArchiveEntity>(items: readonly T[], opts?: ListOptions<T>): readonly T[] {
  if (items.length === 0) return EMPTY;
  let out = items.slice();
  if (opts?.tag) out = out.filter((i) => i.tags.includes(opts.tag as string));
  if (opts?.placeId) out = out.filter((i) => i.places.some((p) => p.placeId === opts.placeId));
  if (opts?.filter) out = out.filter(opts.filter);
  const sort = opts?.sort ?? 'default';
  if (sort !== 'default') out.sort((a, b) => compare(a, b, sort));
  if (opts?.limit !== undefined) out = out.slice(0, opts.limit);
  return out.length > 0 ? out : EMPTY;
}

/* ─── 공개 인터페이스 ───────────────────────────────────────────────── */

export type Archive = {
  listArtists(opts?: ListOptions<Artist>): readonly Artist[];
  listWorks(opts?: ListOptions<Work>): readonly Work[];
  listCollections(opts?: ListOptions<Collection>): readonly Collection[];
  listExhibitions(opts?: ListOptions<Exhibition>): readonly Exhibition[];
  listLibraryItems(opts?: ListOptions<LibraryItem> & { itemType?: LibraryItemType }): readonly LibraryItem[];
  listHistory(opts?: ListOptions<HistoryEntry> & { era?: string }): readonly HistoryEntry[];
  listVoicePeople(opts?: ListOptions<VoicePerson>): readonly VoicePerson[];
  listVoiceClips(opts?: ListOptions<VoiceClip>): readonly VoiceClip[];

  getArtistBySlug(slug: string | undefined): Artist | null;
  getWorkBySlug(slug: string | undefined): Work | null;
  getCollectionBySlug(slug: string | undefined): Collection | null;
  getExhibitionBySlug(slug: string | undefined): Exhibition | null;
  getLibraryItemBySlug(slug: string | undefined): LibraryItem | null;
  getHistoryBySlug(slug: string | undefined): HistoryEntry | null;
  getVoicePersonBySlug(slug: string | undefined): VoicePerson | null;
  getEntityById(id: string | undefined): ArchiveEntity | null;

  listWorksByArtist(id: ArtistId): readonly Work[];
  listExhibitionsByArtist(id: ArtistId): readonly Exhibition[];
  listCollectionMembers(id: CollectionId): readonly ArchiveEntity[];
  listWorksInExhibition(id: ExhibitionId): readonly Work[];
  listSessionsByPerson(id: VoicePersonId): readonly OralHistorySession[];
  listClipsBySession(id: SessionId): readonly VoiceClip[];
  listClipsByPerson(id: VoicePersonId): readonly VoiceClip[];
  listByPlace(placeId: PlaceRefId): readonly ArchiveEntity[];
  listSources(ids: readonly SourceId[]): readonly Source[];
  getRelatedFor(entity: ArchiveEntity): readonly RelatedGroup[];

  getMedia(id: MediaId | undefined): MediaRef | null;
  getMediaList(ids: readonly MediaId[]): readonly MediaRef[];

  readonly index: ArchiveIndex;
  readonly stats: ArchiveStats;
};

export function createArchive(
  data: ArchiveDataset,
  translation: ArchiveTranslation | null,
  visibility: Visibility,
): Archive {
  const all: ArchiveEntity[] = [
    ...data.artists,
    ...data.works,
    ...data.collections,
    ...data.exhibitions,
    ...data.library,
    ...data.history,
    ...data.sources,
    ...data.people,
    ...data.sessions,
    ...data.clips,
  ];

  const knownIds = new Set<string>(all.map((e) => e.id));

  const byId = new Map<string, ArchiveEntity>();
  const bySlug = new Map<string, ArchiveEntity>();
  const byKind = new Map<EntityKind, ArchiveEntity[]>();
  let hidden = 0;

  for (const raw of all) {
    if (!isVisible(raw, visibility, data)) {
      hidden += 1;
      continue;
    }
    const entity = localizeEntity(raw, translation?.entries[raw.id]);
    byId.set(entity.id, entity);
    bySlug.set(`${entity.kind}/${entity.slug}`, entity);
    const bucket = byKind.get(entity.kind) ?? [];
    bucket.push(entity);
    byKind.set(entity.kind, bucket);
  }

  // 미디어: 권리 판정을 통과한 것만 인덱스에 넣는다(못 쓰는 URL 이 만들어질 수 없다).
  const media = new Map<MediaId, MediaRef>();
  for (const raw of data.media) {
    if (!rightsClear(raw.rights, visibility.today)) continue;
    media.set(raw.id, localizeMedia(raw, translation?.media[raw.id]));
  }

  // 역방향 간선 + 끊긴 참조 수집.
  const backrefs = new Map<string, ArchiveId[]>();
  const byPlace = new Map<PlaceRefId, ArchiveId[]>();
  const dropped: DroppedRef[] = [];

  for (const entity of byId.values()) {
    for (const targetId of collectDeclaredIds(entity)) {
      if (byId.has(targetId)) {
        const list = backrefs.get(targetId) ?? [];
        if (!list.includes(entity.id)) list.push(entity.id);
        backrefs.set(targetId, list);
      } else {
        dropped.push({
          from: entity.id,
          field: 'relation',
          missing: targetId,
          reason: knownIds.has(targetId) ? 'hidden' : 'unknown',
        });
      }
    }
    for (const link of entity.places) {
      const list = byPlace.get(link.placeId) ?? [];
      list.push(entity.id);
      byPlace.set(link.placeId, list);
    }
  }

  const index: ArchiveIndex = { byId, bySlug, byKind, backrefs, byPlace, media, dropped };

  const of = <T extends ArchiveEntity>(kind: EntityKind, guard: (e: ArchiveEntity) => e is T): readonly T[] => {
    const items = byKind.get(kind);
    if (!items || items.length === 0) return EMPTY;
    return items.filter(guard);
  };

  const bySlugOf = <T extends ArchiveEntity>(
    kind: EntityKind,
    slug: string | undefined,
    guard: (e: ArchiveEntity) => e is T,
  ): T | null => {
    if (!slug) return null;
    const found = bySlug.get(`${kind}/${slug}`);
    return found && guard(found) ? found : null;
  };

  return {
    listArtists: (opts) => applyOptions(of('artist', isArtist), opts),
    listWorks: (opts) => applyOptions(of('work', isWork), opts),
    listCollections: (opts) => applyOptions(of('collection', isCollection), opts),
    listExhibitions: (opts) => applyOptions(of('exhibition', isExhibition), opts),
    listLibraryItems: (opts) => {
      const items = of('library', isLibraryItem);
      const typed = opts?.itemType ? items.filter((i) => i.itemType === opts.itemType) : items;
      return applyOptions(typed, opts);
    },
    listHistory: (opts) => {
      const items = of('history', isHistoryEntry);
      const inEra = opts?.era ? items.filter((i) => i.era === opts.era) : items;
      return applyOptions(inEra, { sort: 'dateAsc', ...opts });
    },
    listVoicePeople: (opts) => applyOptions(of('voicePerson', isVoicePerson), opts),
    listVoiceClips: (opts) => applyOptions(of('voiceClip', isVoiceClip), opts),

    getArtistBySlug: (slug) => bySlugOf('artist', slug, isArtist),
    getWorkBySlug: (slug) => bySlugOf('work', slug, isWork),
    getCollectionBySlug: (slug) => bySlugOf('collection', slug, isCollection),
    getExhibitionBySlug: (slug) => bySlugOf('exhibition', slug, isExhibition),
    getLibraryItemBySlug: (slug) => bySlugOf('library', slug, isLibraryItem),
    getHistoryBySlug: (slug) => bySlugOf('history', slug, isHistoryEntry),
    getVoicePersonBySlug: (slug) => bySlugOf('voicePerson', slug, isVoicePerson),
    getEntityById: (id) => (id ? (byId.get(id) ?? null) : null),

    listWorksByArtist: (id) =>
      applyOptions(
        of('work', isWork).filter((w) => w.artistIds.includes(id)),
        { sort: 'dateDesc' },
      ),
    listExhibitionsByArtist: (id) =>
      applyOptions(
        of('exhibition', isExhibition).filter((e) => e.artistIds.includes(id)),
        { sort: 'dateDesc' },
      ),
    listCollectionMembers: (id) => {
      const collection = byId.get(id);
      if (!collection || !isCollection(collection)) return EMPTY;
      return resolveAny(index, collection.memberIds);
    },
    listWorksInExhibition: (id) => {
      const exhibition = byId.get(id);
      if (!exhibition || !isExhibition(exhibition)) return EMPTY;
      return resolveMany(index, exhibition.workIds, isWork);
    },
    listSessionsByPerson: (id) =>
      applyOptions(
        of('session', isSession).filter((s) => s.personIds.includes(id)),
        { sort: 'dateDesc' },
      ),
    listClipsBySession: (id) => of('voiceClip', isVoiceClip).filter((c) => c.sessionId === id),
    listClipsByPerson: (id) => of('voiceClip', isVoiceClip).filter((c) => c.personIds.includes(id)),
    listByPlace: (placeId) => resolveAny(index, byPlace.get(placeId) ?? EMPTY),
    listSources: (ids) => resolveMany(index, ids, isSource),
    getRelatedFor: (entity) => getRelated(index, entity),

    getMedia: (id) => (id ? (media.get(id) ?? null) : null),
    getMediaList: (ids) => {
      if (ids.length === 0) return EMPTY;
      const out: MediaRef[] = [];
      for (const id of ids) {
        const found = media.get(id);
        if (found) out.push(found);
      }
      return out.length > 0 ? out : EMPTY;
    },

    index,
    stats: { total: byId.size, hidden, droppedRefs: dropped.length },
  };
}

/* ─── 로케일별 캐시 ─────────────────────────────────────────────────── */

const cache = new Map<LocaleCode, Archive>();

function todayInKst(): string {
  // 섬 기준(KST)으로 날짜를 잡는다 — 권리 만료 판정이 브라우저 시간대에 흔들리지 않게.
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 화면이 쓰는 진입점. 로케일당 한 번만 인덱스를 만든다. */
export function getArchive(locale: LocaleCode): Archive {
  const cached = cache.get(locale);
  if (cached) return cached;
  const archive = createArchive(staticDataset, archiveTranslations[locale], {
    includeUnpublished: false,
    today: todayInKst(),
  });
  cache.set(locale, archive);
  return archive;
}

export { resolveOne, resolveMany };
export type { RelatedGroup };
