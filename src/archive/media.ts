/*
 * 미디어 URL 생성 — **한 곳**.
 *
 * Phase 1: 파일이 있다면 public/archive-media/ 아래에 둔다(현재는 자료 없음).
 * Phase 2: Cloudflare R2 + Worker 의 /archive-media/* 네임스페이스로 옮긴다.
 *          그때 바꾸는 코드는 이 파일뿐이다. 자세한 것은 docs/media-storage.md.
 *
 * 우도나우 사진의 /media/* 프록시와 **섞지 않는다** — 그건 앱 서버 사진 전용이다.
 */
import type { MediaRef, MediaVariant, Rights } from './types';

const MEDIA_BASE = '/archive-media';

/** 권리가 확인되고 기간이 남아 있는가. repository 의 인덱스 필터와 같은 판정. */
export function isRightsClear(rights: Rights, today: string): boolean {
  if (!rights.webDisplayAllowed) return false;
  if (rights.rightsStatus !== 'verified') return false;
  if (rights.permissionExpiresOn && rights.permissionExpiresOn < today) return false;
  return true;
}

/**
 * 표시용 URL. ref 가 없거나 그 variant 가 없으면 null 을 준다 —
 * 컴포넌트가 "URL 이 없으면 렌더하지 않는다"로만 처리하면 되게 한다.
 * (권리 판정은 repository 가 이미 걸렀다. 여기서는 파일 유무만 본다.)
 */
export function mediaUrl(ref: MediaRef | null | undefined, variant: MediaVariant = 'display'): string | null {
  if (!ref) return null;
  /* 이미 완전한 URL(외부 호스팅, 또는 개발용 data URI)이면 그대로 쓴다. */
  if (ref.key.startsWith('data:') || ref.key.startsWith('http')) return ref.key;
  if (!ref.variants.includes(variant)) {
    // 요청한 크기가 없으면 원본 성격의 것으로 대체하되, full 을 임의로 노출하지 않는다.
    if (ref.variants.includes('display')) return `${MEDIA_BASE}/${ref.key}`;
    return null;
  }
  return `${MEDIA_BASE}/${ref.key}`;
}

/** 이미지 비율(width/height). 모르면 null — 컴포넌트는 비율을 강제하지 않는다. */
export function aspectRatio(ref: MediaRef | null | undefined): number | null {
  if (!ref?.width || !ref?.height) return null;
  return ref.width / ref.height;
}
