/*
 * 장소 연결.
 *
 * 아카이브는 여행 데이터(src/data/spots.ts)의 장소를 재사용하되 **그 파일의 모양에
 * 묶이지 않는다.** 필요한 것은 id·이름·좌표 네 가지뿐이고(SitePlaceLike), spots.ts 가
 * category/summary/tips 를 바꾸거나 항목을 지워도 아카이브는 계속 돈다.
 *
 * 이 파일은 src/archive 안에서 src/data 를 import 하는 **유일한** 모듈이다.
 */
import { useMemo } from 'react';
import { useContent } from '../i18n';
import type { PlaceRefId } from './ids';

/** 아카이브가 장소에 대해 의존하는 최소 구조. */
type SitePlaceLike = {
  readonly id: string;
  readonly name: string;
  readonly lat: number;
  readonly lon: number;
};

export type ArchivePlace = {
  readonly id: PlaceRefId;
  readonly name: string;
  readonly lat: number | null;
  readonly lon: number | null;
  /** 'site' = 여행 데이터에 있는 장소, 'archive' = 아카이브에만 있는 장소(사라진 마을 등). */
  readonly origin: 'site' | 'archive';
};

export const PLACE_PREFIX = 'place-';

export function toPlaceRefId(siteId: string): PlaceRefId {
  return `${PLACE_PREFIX}${siteId}`;
}

export function toSitePlaceId(id: PlaceRefId): string {
  return id.slice(PLACE_PREFIX.length);
}

/**
 * 아카이브에만 있는 장소. 여행 페이지에 넣을 수 없는 곳(폐교 터, 사라진 포구 등)을
 * 여기 둔다. Phase 1 은 비어 있다 — 실제 장소는 자료와 함께 들어온다.
 */
export const archiveOnlyPlaces: readonly ArchivePlace[] = [];

/** 순수 함수 — React 없이도 쓸 수 있다(integrity 점검이 이걸 쓴다). */
export function buildPlaceMap(
  sitePlaces: readonly SitePlaceLike[],
): ReadonlyMap<PlaceRefId, ArchivePlace> {
  const map = new Map<PlaceRefId, ArchivePlace>();
  for (const p of sitePlaces) {
    const id = toPlaceRefId(p.id);
    map.set(id, { id, name: p.name, lat: p.lat, lon: p.lon, origin: 'site' });
  }
  for (const p of archiveOnlyPlaces) map.set(p.id, p);
  return map;
}

/**
 * 장소 이름은 여행 데이터에서 오므로 기존 번역(useContent)을 그대로 물려받는다.
 * 모르는 id 는 null — 장소 칩이 안 그려질 뿐 화면이 깨지지 않는다.
 */
export function usePlaceResolver(): (id: PlaceRefId) => ArchivePlace | null {
  const { places } = useContent();
  const map = useMemo(() => buildPlaceMap(places), [places]);
  return useMemo(() => (id: PlaceRefId) => map.get(id) ?? null, [map]);
}
