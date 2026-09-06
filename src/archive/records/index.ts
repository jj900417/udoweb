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
  SoundRecording,
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
import { soundRecordings } from './sounds';
import { devFixtures } from './__dev__/fixtures';

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
  readonly sounds: readonly SoundRecording[];
  readonly media: readonly MediaRef[];
};

const production: ArchiveDataset = {
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
  sounds: soundRecordings,
  media: mediaRefs,
};

/*
 * 개발 서버에서만 예시 레코드를 섞는다 — 자료가 0건일 때 레이아웃을 볼 수 없기 때문이다.
 * `import.meta.env.DEV` 는 프로덕션 빌드에서 false 로 치환되고, 그러면 devFixtures 참조가
 * 사라지면서 이 모듈 전체가 번들에서 제거된다.
 * 검증: `npm run build && grep -r "[예시]" dist/` → 결과가 없어야 한다.
 */
function merge(a: ArchiveDataset, b: ArchiveDataset): ArchiveDataset {
  return {
    artists: [...a.artists, ...b.artists],
    works: [...a.works, ...b.works],
    collections: [...a.collections, ...b.collections],
    exhibitions: [...a.exhibitions, ...b.exhibitions],
    library: [...a.library, ...b.library],
    history: [...a.history, ...b.history],
    sources: [...a.sources, ...b.sources],
    people: [...a.people, ...b.people],
    sessions: [...a.sessions, ...b.sessions],
    clips: [...a.clips, ...b.clips],
    sounds: [...a.sounds, ...b.sounds],
    media: [...a.media, ...b.media],
  };
}

export const dataset: ArchiveDataset = import.meta.env.DEV
  ? merge(production, devFixtures)
  : production;
