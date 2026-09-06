import type {
  Artist,
  Collection,
  Exhibition,
  HistoryEntry,
  LibraryItem,
  MediaRef,
  OralHistorySession,
  Rights,
  Source,
  VoiceClip,
  VoicePerson,
  Work,
} from '../../types';
import type { ArchiveDataset } from '../index';

/*
 * ⚠ 개발 전용 예시 데이터. **프로덕션 빌드에 들어가지 않는다.**
 *
 * 왜 있나: 실제 자료가 0건이면 작품 그리드·연표·구술 재생기 같은 레이아웃을 눈으로
 * 검증할 수 없다. 그렇다고 실제 인물·작품·역사를 지어내면 아카이브의 신뢰가 무너지므로,
 * **명백히 가짜임을 제목에 박아 둔**(`[예시]`) 최소한의 뼈대만 둔다.
 *
 * 규칙
 * - 모든 title 에 `[예시]` 접두사. 인물은 '익명 A'.
 * - 연도 정밀도는 decade/unknown — 가짜 정확도를 만들지 않는다.
 * - 이미지는 회색 SVG 자리표시(data URI), 음성은 무음 WAV. 실제 사진·목소리가 아니다.
 * - `records/index.ts` 가 `import.meta.env.DEV` 일 때만 이 파일을 섞는다.
 *   빌드 게이트: `npm run build && grep -r "[예시]" dist/` → 결과가 없어야 한다.
 */

const DEV_RIGHTS: Rights = {
  copyrightHolder: '[예시] 권리자',
  creditLine: 'ⓒ [예시] 권리자',
  webDisplayAllowed: true,
  rightsStatus: 'verified',
};

const base = {
  publishStatus: 'published',
  rights: DEV_RIGHTS,
  sourceIds: [],
  places: [],
  tags: [],
  updatedAt: '2026-09-06',
} as const;

const media: MediaRef[] = [
  {
    id: 'media-dev-0001',
    kind: 'image',
    key: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201200%20800%22%20width%3D%221200%22%20height%3D%22800%22%3E%3Crect%20width%3D%221200%22%20height%3D%22800%22%20fill%3D%22%23d9d9d4%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2266%22%20fill%3D%22%238a8a83%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%5B%EC%98%88%EC%8B%9C%5D%20%EA%B0%80%EB%A1%9C%203%3A2%3C/text%3E%3C/svg%3E',
    variants: ['thumb', 'display'],
    width: 1200,
    height: 800,
    alt: '[예시] 회색 자리표시 이미지 (가로)',
    rights: DEV_RIGHTS,
  },
  {
    id: 'media-dev-0002',
    kind: 'image',
    key: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20800%201200%22%20width%3D%22800%22%20height%3D%221200%22%3E%3Crect%20width%3D%22800%22%20height%3D%221200%22%20fill%3D%22%23d9d9d4%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2266%22%20fill%3D%22%238a8a83%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%5B%EC%98%88%EC%8B%9C%5D%20%EC%84%B8%EB%A1%9C%202%3A3%3C/text%3E%3C/svg%3E',
    variants: ['thumb', 'display'],
    width: 800,
    height: 1200,
    alt: '[예시] 회색 자리표시 이미지 (세로)',
    rights: DEV_RIGHTS,
  },
  {
    id: 'media-dev-0003',
    kind: 'image',
    key: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201000%201000%22%20width%3D%221000%22%20height%3D%221000%22%3E%3Crect%20width%3D%221000%22%20height%3D%221000%22%20fill%3D%22%23d9d9d4%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2255%22%20fill%3D%22%238a8a83%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%5B%EC%98%88%EC%8B%9C%5D%20%EC%A0%95%EC%82%AC%EA%B0%81%3C/text%3E%3C/svg%3E',
    variants: ['thumb', 'display'],
    width: 1000,
    height: 1000,
    alt: '[예시] 회색 자리표시 이미지 (정사각)',
    rights: DEV_RIGHTS,
  },
  {
    id: 'media-dev-0004',
    kind: 'image',
    key: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201600%20900%22%20width%3D%221600%22%20height%3D%22900%22%3E%3Crect%20width%3D%221600%22%20height%3D%22900%22%20fill%3D%22%23d9d9d4%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2288%22%20fill%3D%22%238a8a83%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%5B%EC%98%88%EC%8B%9C%5D%20%EC%99%80%EC%9D%B4%EB%93%9C%2016%3A9%3C/text%3E%3C/svg%3E',
    variants: ['thumb', 'display'],
    width: 1600,
    height: 900,
    alt: '[예시] 회색 자리표시 이미지 (와이드)',
    rights: DEV_RIGHTS,
  },
  {
    id: 'media-dev-0005',
    kind: 'image',
    key: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20700%20900%22%20width%3D%22700%22%20height%3D%22900%22%3E%3Crect%20width%3D%22700%22%20height%3D%22900%22%20fill%3D%22%23d9d9d4%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2250%22%20fill%3D%22%238a8a83%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%5B%EC%98%88%EC%8B%9C%5D%20%EC%B4%88%EC%83%81%3C/text%3E%3C/svg%3E',
    variants: ['thumb', 'display'],
    width: 700,
    height: 900,
    alt: '[예시] 회색 자리표시 초상',
    rights: DEV_RIGHTS,
  },
  {
    id: 'media-dev-audio',
    kind: 'audio',
    key: 'data:audio/wav;base64,UklGRiQZAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAZAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA',
    variants: ['display'],
    durationSec: 0.8,
    alt: '[예시] 무음 오디오',
    rights: DEV_RIGHTS,
  },
];

const artists: Artist[] = [
  {
    ...base,
    id: 'artist-dev-0001',
    kind: 'artist',
    slug: 'dev-artist-a',
    title: '[예시] 작가 A',
    displayName: '[예시] 작가 A',
    summary: '[예시] 레이아웃 확인용 항목입니다. 실제 인물이 아닙니다.',
    body: [
      '[예시] 생애 본문이 들어갈 자리입니다. 실제 자료가 들어오면 이 문단은 사라집니다.',
      '[예시] 두 번째 문단 — 읽는 폭과 명조 본문의 줄간을 확인하기 위한 것입니다.',
    ],
    roles: ['photographer'],
    birth: { value: '1930', precision: 'decade' },
    portraitMediaId: 'media-dev-0005',
    tags: ['[예시]해녀'],
  },
  {
    ...base,
    id: 'artist-dev-0002',
    kind: 'artist',
    slug: 'dev-artist-b',
    title: '[예시] 작가 B',
    displayName: '[예시] 작가 B',
    summary: '[예시] 두 번째 항목 — 목록이 여러 개일 때의 간격을 봅니다.',
    roles: ['resident', 'writer'],
    village: '[예시] 마을',
  },
];

const works: Work[] = [
  {
    ...base,
    id: 'work-dev-0001',
    kind: 'work',
    slug: 'dev-work-1',
    title: '[예시] 가로 사진',
    summary: '[예시] 원본 비율(3:2)이 유지되는지 확인하는 항목입니다.',
    artistIds: ['artist-dev-0001'],
    created: { value: '1970', precision: 'decade' },
    medium: '[예시] 젤라틴 실버 프린트',
    dimensions: '[예시] 20 × 30 cm',
    accessionNumber: '[예시] UDO-0001',
    acquisition: '[예시] 기증',
    collectionIds: ['collection-dev-0001'],
    exhibitionIds: [],
    mediaIds: ['media-dev-0001'],
    relatedIds: ['history-dev-0001'],
    tags: ['[예시]항구'],
  },
  {
    ...base,
    id: 'work-dev-0002',
    kind: 'work',
    slug: 'dev-work-2',
    title: '[예시] 세로 사진',
    artistIds: ['artist-dev-0001'],
    created: { value: '1980', precision: 'decade' },
    collectionIds: [],
    exhibitionIds: [],
    mediaIds: ['media-dev-0002'],
    relatedIds: [],
    tags: ['[예시]해녀'],
  },
  {
    ...base,
    id: 'work-dev-0003',
    kind: 'work',
    slug: 'dev-work-3',
    title: '[예시] 정사각 사진',
    artistIds: ['artist-dev-0002'],
    created: { value: '', precision: 'unknown' },
    collectionIds: [],
    exhibitionIds: [],
    mediaIds: ['media-dev-0003'],
    relatedIds: [],
    tags: ['[예시]마을'],
  },
  {
    ...base,
    id: 'work-dev-0004',
    kind: 'work',
    slug: 'dev-work-4',
    title: '[예시] 사진 없는 기록',
    summary: '[예시] 이미지가 없는 기록도 목록과 상세에서 정상으로 보이는지 봅니다.',
    artistIds: [],
    created: { value: '1990', precision: 'decade' },
    collectionIds: [],
    exhibitionIds: [],
    mediaIds: [],
    relatedIds: [],
    tags: ['[예시]항구'],
  },
];

const collections: Collection[] = [
  {
    ...base,
    id: 'collection-dev-0001',
    kind: 'collection',
    slug: 'dev-collection',
    title: '[예시] 컬렉션',
    summary: '[예시] 여러 종류가 섞인 목록의 표시를 확인합니다.',
    curatorArtistIds: ['artist-dev-0001'],
    memberIds: ['work-dev-0001', 'work-dev-0002'],
  },
];

const exhibitions: Exhibition[] = [
  {
    ...base,
    id: 'exhibition-dev-0001',
    kind: 'exhibition',
    slug: 'dev-exhibition',
    title: '[예시] 온라인 기획전',
    summary: '[예시] 기획전 목록·상세 레이아웃 확인용입니다.',
    period: { start: { value: '2026', precision: 'year' } },
    online: true,
    artistIds: ['artist-dev-0001'],
    workIds: ['work-dev-0001', 'work-dev-0002'],
  },
];

const historyEntries: HistoryEntry[] = [
  {
    ...base,
    id: 'history-dev-0001',
    kind: 'history',
    slug: 'dev-history-1',
    title: '[예시] 뱃길이 바뀌던 시기',
    summary: '[예시] 연표와 기사 본문의 조합을 확인하는 항목입니다.',
    body: [
      '[예시] 첫 문단입니다. 명조 본문의 줄간과 읽는 폭을 확인합니다.',
      '[예시] 두 번째 문단 — 이 뒤에 사진이 단 폭의 약 68%로 들어갑니다.',
      '[예시] 세 번째 문단입니다.',
      '[예시] 네 번째 문단 — 사진 정렬이 좌우로 번갈아 가는지 봅니다.',
    ],
    when: { value: '1970', precision: 'decade' },
    era: '[예시] 1970년대',
    category: 'transport',
    significance: 'major',
    relatedIds: ['work-dev-0001', 'clip-dev-0001'],
    mediaIds: ['media-dev-0004', 'media-dev-0001'],
    sourceIds: ['source-dev-0001'],
  },
  {
    ...base,
    id: 'history-dev-0002',
    kind: 'history',
    slug: 'dev-history-2',
    title: '[예시] 물질이 이어지던 바다',
    summary: '[예시] 두 번째 연표 항목입니다.',
    when: { value: '1980', precision: 'decade' },
    category: 'haenyeo',
    significance: 'notable',
    relatedIds: [],
    mediaIds: [],
  },
  {
    ...base,
    id: 'history-dev-0003',
    kind: 'history',
    slug: 'dev-history-3',
    title: '[예시] 연도를 모르는 기록',
    when: { value: '', precision: 'unknown' },
    category: 'other',
    significance: 'minor',
    relatedIds: [],
    mediaIds: [],
  },
];

const sources: Source[] = [
  {
    ...base,
    id: 'source-dev-0001',
    kind: 'source',
    slug: 'dev-source-1',
    title: '[예시] 출처 자료',
    sourceType: 'other',
    citation: '[예시] 출처 표기가 들어갈 자리입니다.',
    reliability: 'unverified',
  },
];

const libraryItems: LibraryItem[] = [
  {
    ...base,
    id: 'library-dev-0001',
    kind: 'library',
    slug: 'dev-library-1',
    title: '[예시] 향토 자료',
    summary: '[예시] 서지정보 표시를 확인합니다.',
    itemType: 'udoji',
    authors: ['[예시] 엮은이'],
    published: { value: '1990', precision: 'year' },
    authorArtistIds: [],
    holdingNote: '[예시] 열람 안내가 들어갈 자리',
    relatedIds: [],
  },
  {
    ...base,
    id: 'library-dev-0002',
    kind: 'library',
    slug: 'dev-library-2',
    title: '[예시] 사진집',
    itemType: 'book',
    authors: ['[예시] 작가 A'],
    published: { value: '2005', precision: 'year' },
    authorArtistIds: ['artist-dev-0001'],
    relatedIds: [],
  },
];

const voicePeople: VoicePerson[] = [
  {
    ...base,
    id: 'person-dev-0001',
    kind: 'voicePerson',
    slug: 'dev-person',
    title: '[예시] 익명 A',
    displayName: '[예시] 익명 A',
    summary: '[예시] 실제 인물이 아닙니다. 레이아웃 확인용 항목입니다.',
    anonymized: true,
    village: '[예시] 마을',
    occupations: ['[예시] 해녀'],
    consent: { obtained: true, scope: 'public' },
    portraitMediaId: 'media-dev-0005',
  },
];

const sessions: OralHistorySession[] = [
  {
    ...base,
    id: 'session-dev-0001',
    kind: 'session',
    slug: 'dev-session',
    title: '[예시] 인터뷰',
    personIds: ['person-dev-0001'],
    recordedOn: { value: '2026-05-01', precision: 'exact' },
    location: '[예시] 마을회관',
    durationSec: 2520,
    language: 'ko-jejueo',
    themes: ['[예시]바다'],
    clipIds: ['clip-dev-0001', 'clip-dev-0002'],
    consent: { obtained: true, scope: 'public' },
  },
];

const clips: VoiceClip[] = [
  {
    ...base,
    id: 'clip-dev-0001',
    kind: 'voiceClip',
    slug: 'dev-clip-1',
    title: '[예시] 발췌 1',
    sessionId: 'session-dev-0001',
    personIds: ['person-dev-0001'],
    startSec: 0,
    endSec: 24,
    dialectText: ['[예시] 제주어 원문이 들어갈 자리우다.'],
    standardKorean: ['[예시] 표준어 옮김이 들어갈 자리입니다.'],
    context: ['[예시] 이 말에 담긴 이야기가 들어갈 자리입니다.'],
    body: ['[예시] 전사 전문 첫 문단.', '[예시] 전사 전문 둘째 문단.'],
    audioMediaId: 'media-dev-audio',
    themes: ['[예시]바다'],
    relatedIds: ['history-dev-0001'],
  },
  {
    ...base,
    id: 'clip-dev-0002',
    kind: 'voiceClip',
    slug: 'dev-clip-2',
    title: '[예시] 발췌 2 (음성 없음)',
    sessionId: 'session-dev-0001',
    personIds: ['person-dev-0001'],
    dialectText: ['[예시] 음성 파일이 없을 때의 표시를 확인하는 항목이우다.'],
    themes: [],
    relatedIds: [],
  },
];

export const devFixtures: ArchiveDataset = {
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
  media,
};
