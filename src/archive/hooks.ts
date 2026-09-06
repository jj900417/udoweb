/*
 * 화면이 아카이브 데이터를 읽는 **유일한** 경로.
 *
 * 지금은 번들 안 정적 레코드를 동기로 읽지만, 반환 모양은 기존 API 훅과 같은
 * AsyncState<T>({ data, loading, error }) 다. Phase 2 에서 데이터가 Archive API 로
 * 옮겨가면 이 파일 본문만 useAsync 로 바꾸면 되고 **페이지는 한 줄도 안 바뀐다.**
 */
import { useMemo } from 'react';
import type { AsyncState } from '../api/useAsync';
import { useLocale } from '../i18n';
import {
  getArchive,
  type Archive,
  type Facets,
  type ListOptions,
  type RelatedGroup,
} from './repository';
import type {
  SourceId,
  ArtistId,
  CollectionId,
  EntityKind,
  ExhibitionId,
  SessionId,
  VoicePersonId,
} from './ids';
import type {
  ArchiveEntity,
  Artist,
  Collection,
  Exhibition,
  HistoryEntry,
  LibraryItem,
  LibraryItemType,
  OralHistorySession,
  Source,
  VoiceClip,
  VoicePerson,
  Work,
} from './types';

export type ArchiveState<T> = AsyncState<T>;

/** 정적 데이터라 항상 즉시 준비된 상태. */
function ready<T>(data: T): ArchiveState<T> {
  return { data, loading: false, error: null };
}

/** 옵션 객체를 매 렌더 새로 만들어도 메모가 깨지지 않도록 값으로 비교한다. */
function optionsKey(opts: unknown): string {
  return opts ? JSON.stringify(opts, (_k, v) => (typeof v === 'function' ? 'fn' : v)) : '';
}

export function useArchive(): Archive {
  const { locale } = useLocale();
  return useMemo(() => getArchive(locale), [locale]);
}

export function useArtistList(opts?: ListOptions<Artist>): ArchiveState<readonly Artist[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listArtists(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useArtist(slug: string | undefined): ArchiveState<Artist | null> {
  const archive = useArchive();
  return ready(useMemo(() => archive.getArtistBySlug(slug), [archive, slug]));
}

export function useWorkList(opts?: ListOptions<Work>): ArchiveState<readonly Work[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listWorks(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useWork(slug: string | undefined): ArchiveState<Work | null> {
  const archive = useArchive();
  return ready(useMemo(() => archive.getWorkBySlug(slug), [archive, slug]));
}

export function useWorksByArtist(id: ArtistId | null): ArchiveState<readonly Work[]> {
  const archive = useArchive();
  return ready(useMemo(() => (id ? archive.listWorksByArtist(id) : []), [archive, id]));
}

export function useExhibitionsByArtist(id: ArtistId | null): ArchiveState<readonly Exhibition[]> {
  const archive = useArchive();
  return ready(useMemo(() => (id ? archive.listExhibitionsByArtist(id) : []), [archive, id]));
}

export function useCollectionList(opts?: ListOptions<Collection>): ArchiveState<readonly Collection[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listCollections(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useCollection(slug: string | undefined): ArchiveState<Collection | null> {
  const archive = useArchive();
  return ready(useMemo(() => archive.getCollectionBySlug(slug), [archive, slug]));
}

export function useCollectionMembers(id: CollectionId | null): ArchiveState<readonly ArchiveEntity[]> {
  const archive = useArchive();
  return ready(useMemo(() => (id ? archive.listCollectionMembers(id) : []), [archive, id]));
}

export function useExhibitionList(opts?: ListOptions<Exhibition>): ArchiveState<readonly Exhibition[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listExhibitions(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useExhibition(slug: string | undefined): ArchiveState<Exhibition | null> {
  const archive = useArchive();
  return ready(useMemo(() => archive.getExhibitionBySlug(slug), [archive, slug]));
}

export function useWorksInExhibition(id: ExhibitionId | null): ArchiveState<readonly Work[]> {
  const archive = useArchive();
  return ready(useMemo(() => (id ? archive.listWorksInExhibition(id) : []), [archive, id]));
}

export function useLibraryList(
  opts?: ListOptions<LibraryItem> & { itemType?: LibraryItemType },
): ArchiveState<readonly LibraryItem[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listLibraryItems(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useHistoryList(
  opts?: ListOptions<HistoryEntry> & { era?: string },
): ArchiveState<readonly HistoryEntry[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listHistory(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useHistoryEntry(slug: string | undefined): ArchiveState<HistoryEntry | null> {
  const archive = useArchive();
  return ready(useMemo(() => archive.getHistoryBySlug(slug), [archive, slug]));
}

export function useVoicePeople(opts?: ListOptions<VoicePerson>): ArchiveState<readonly VoicePerson[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listVoicePeople(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useVoicePerson(slug: string | undefined): ArchiveState<VoicePerson | null> {
  const archive = useArchive();
  return ready(useMemo(() => archive.getVoicePersonBySlug(slug), [archive, slug]));
}

export function useSessionsByPerson(id: VoicePersonId | null): ArchiveState<readonly OralHistorySession[]> {
  const archive = useArchive();
  return ready(useMemo(() => (id ? archive.listSessionsByPerson(id) : []), [archive, id]));
}

export function useClipsBySession(id: SessionId | null): ArchiveState<readonly VoiceClip[]> {
  const archive = useArchive();
  return ready(useMemo(() => (id ? archive.listClipsBySession(id) : []), [archive, id]));
}

export function useClipsByPerson(id: VoicePersonId | null): ArchiveState<readonly VoiceClip[]> {
  const archive = useArchive();
  return ready(useMemo(() => (id ? archive.listClipsByPerson(id) : []), [archive, id]));
}

export function useVoiceClipList(opts?: ListOptions<VoiceClip>): ArchiveState<readonly VoiceClip[]> {
  const archive = useArchive();
  const key = optionsKey(opts);
  return ready(useMemo(() => archive.listVoiceClips(opts), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useRelated(entity: ArchiveEntity | null): ArchiveState<readonly RelatedGroup[]> {
  const archive = useArchive();
  return ready(useMemo(() => (entity ? archive.getRelatedFor(entity) : []), [archive, entity]));
}

export function useSources(ids: readonly SourceId[]): ArchiveState<readonly Source[]> {
  const archive = useArchive();
  const key = ids.join(',');
  return ready(useMemo(() => archive.listSources(ids), [archive, key])); // eslint-disable-line react-hooks/exhaustive-deps
}

/** 브라우즈 축(시대·주제·장소). 값이 2개 미만인 축은 빈 배열로 온다. */
export function useFacets(kind?: EntityKind): Facets {
  const archive = useArchive();
  return useMemo(() => archive.facets(kind), [archive, kind]);
}

/** 종류별 공개 레코드 수 — 내비·섹션 제목 옆 개수. */
export function useCounts(kinds: readonly EntityKind[]): Readonly<Record<string, number>> {
  const archive = useArchive();
  const key = kinds.join(',');
  return useMemo(() => {
    const out: Record<string, number> = {};
    for (const kind of kinds) out[kind] = archive.countOf(kind);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archive, key]);
}
