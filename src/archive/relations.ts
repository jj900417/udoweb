/*
 * 관계 해석 — 끊긴 참조가 화면을 깨뜨리지 않게 하는 곳.
 *
 * 참조한 ID 가 없거나(오타·삭제) 비공개(draft·권리 미확인)면 **조용히 빠진다.**
 * 결과가 비면 섹션 자체를 감춘다 — 가짜 "관련 자료"를 만들지 않기 위한 규칙이다.
 */
import type { ArchiveId, EntityKind, MediaId, PlaceRefId } from './ids';
import { kindOfId } from './ids';
import type { ArchiveEntity, MediaRef } from './types';

export type DroppedRef = {
  readonly from: ArchiveId;
  readonly field: string;
  readonly missing: string;
  /** 'unknown' = 그런 ID 가 없음(오타 가능) · 'hidden' = 있지만 공개 대상이 아님. */
  readonly reason: 'unknown' | 'hidden';
};

/** repository 가 만드는 조회 인덱스. 공개 가능한 것만 들어 있다. */
export type ArchiveIndex = {
  readonly byId: ReadonlyMap<string, ArchiveEntity>;
  /** 키는 `${kind}/${slug}`. */
  readonly bySlug: ReadonlyMap<string, ArchiveEntity>;
  readonly byKind: ReadonlyMap<EntityKind, readonly ArchiveEntity[]>;
  /** 역방향 간선(파생) — 어떤 엔티티를 가리키는 엔티티들. */
  readonly backrefs: ReadonlyMap<string, readonly ArchiveId[]>;
  readonly byPlace: ReadonlyMap<PlaceRefId, readonly ArchiveId[]>;
  readonly media: ReadonlyMap<MediaId, MediaRef>;
  readonly dropped: readonly DroppedRef[];
};

/** 어떤 목록도 비었을 때 같은 참조를 돌려준다(메모 의존성에 안전). */
export const EMPTY: readonly never[] = Object.freeze([]);

export function resolveOne<T extends ArchiveEntity>(
  index: ArchiveIndex,
  id: string | undefined | null,
  guard: (e: ArchiveEntity) => e is T,
): T | null {
  if (!id) return null;
  const found = index.byId.get(id);
  if (!found) return null;
  return guard(found) ? found : null;
}

export function resolveMany<T extends ArchiveEntity>(
  index: ArchiveIndex,
  ids: readonly string[],
  guard: (e: ArchiveEntity) => e is T,
): readonly T[] {
  if (ids.length === 0) return EMPTY;
  const out: T[] = [];
  for (const id of ids) {
    const found = index.byId.get(id);
    if (found && guard(found)) out.push(found);
  }
  return out.length > 0 ? out : EMPTY;
}

/** 종류를 가리지 않고 해석(컬렉션 멤버처럼 섞인 목록용). */
export function resolveAny(index: ArchiveIndex, ids: readonly string[]): readonly ArchiveEntity[] {
  if (ids.length === 0) return EMPTY;
  const out: ArchiveEntity[] = [];
  for (const id of ids) {
    const found = index.byId.get(id);
    if (found) out.push(found);
  }
  return out.length > 0 ? out : EMPTY;
}

export type RelatedGroup = {
  readonly kind: EntityKind;
  /** 절대 비지 않는다 — 빈 그룹은 만들어지기 전에 버려진다. */
  readonly items: readonly ArchiveEntity[];
};

/** 관련 자료를 보여주는 순서(화면마다 다르게 정하지 않는다). */
const RELATED_ORDER: readonly EntityKind[] = [
  'work',
  'history',
  'voiceClip',
  'voicePerson',
  'artist',
  'collection',
  'exhibition',
  'library',
];

/**
 * 한 엔티티의 관련 자료를 종류별로 묶어 준다.
 * - 스스로 선언한 관계(relatedIds 등)와 자기를 가리키는 역방향 간선을 합친다.
 * - 자기 자신은 제외하고, 중복은 한 번만.
 */
export function getRelated(
  index: ArchiveIndex,
  entity: ArchiveEntity,
  opts: { readonly limitPerKind?: number } = {},
): readonly RelatedGroup[] {
  const limit = opts.limitPerKind ?? 8;
  const declared = collectDeclaredIds(entity);
  const incoming = index.backrefs.get(entity.id) ?? EMPTY;

  const seen = new Set<string>([entity.id]);
  const buckets = new Map<EntityKind, ArchiveEntity[]>();

  for (const id of [...declared, ...incoming]) {
    if (seen.has(id)) continue;
    seen.add(id);
    const found = index.byId.get(id);
    if (!found) continue;
    const kind = kindOfId(id);
    if (!kind) continue;
    const bucket = buckets.get(kind) ?? [];
    if (bucket.length >= limit) continue;
    bucket.push(found);
    buckets.set(kind, bucket);
  }

  const groups: RelatedGroup[] = [];
  for (const kind of RELATED_ORDER) {
    const items = buckets.get(kind);
    if (items && items.length > 0) groups.push({ kind, items });
  }
  return groups.length > 0 ? groups : EMPTY;
}

/** 엔티티가 직접 선언한 관계 ID 전부(출처·미디어는 제외 — 따로 보여준다). */
export function collectDeclaredIds(entity: ArchiveEntity): readonly ArchiveId[] {
  const ids: ArchiveId[] = [];
  const push = (list: readonly ArchiveId[] | undefined) => {
    if (list) ids.push(...list);
  };

  switch (entity.kind) {
    case 'work':
      push(entity.artistIds);
      push(entity.collectionIds);
      push(entity.exhibitionIds);
      push(entity.relatedIds);
      break;
    case 'collection':
      push(entity.curatorArtistIds);
      push(entity.memberIds);
      break;
    case 'exhibition':
      push(entity.artistIds);
      push(entity.workIds);
      break;
    case 'library':
      push(entity.authorArtistIds);
      push(entity.relatedIds);
      break;
    case 'history':
      push(entity.relatedIds);
      break;
    case 'session':
      push(entity.personIds);
      push(entity.clipIds);
      break;
    case 'voiceClip':
      push(entity.personIds);
      push([entity.sessionId]);
      push(entity.relatedIds);
      break;
    case 'source':
      if (entity.libraryItemId) push([entity.libraryItemId]);
      break;
    default:
      break;
  }
  return ids;
}
