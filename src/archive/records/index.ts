import type {
  Artist,
  Collection,
  Exhibition,
  HistoryEntry,
  LibraryItem,
  MediaRef,
  OralHistorySession,
  Source,
  VoiceClip,
  VoicePerson,
  Work,
} from '../types';
import { artists } from './artists';
import { works } from './works';
import { collections } from './collections';
import { exhibitions } from './exhibitions';
import { libraryItems } from './library';
import { historyEntries } from './history';
import { sources } from './sources';
import { voicePeople, sessions, clips } from './voices';
import { mediaRefs } from './media';

/** 아카이브 원자료 묶음. Phase 2 에서 API 응답이 이 모양으로 들어온다. */
export type ArchiveDataset = {
  readonly artists: readonly Artist[];
  readonly works: readonly Work[];
  readonly collections: readonly Collection[];
  readonly exhibitions: readonly Exhibition[];
  readonly library: readonly LibraryItem[];
  readonly history: readonly HistoryEntry[];
  readonly sources: readonly Source[];
  readonly people: readonly VoicePerson[];
  readonly sessions: readonly OralHistorySession[];
  readonly clips: readonly VoiceClip[];
  readonly media: readonly MediaRef[];
};

export const dataset: ArchiveDataset = {
  artists,
  works,
  collections,
  exhibitions,
  library: libraryItems,
  history: historyEntries,
  sources,
  people: voicePeople,
  sessions,
  clips,
  media: mediaRefs,
};
