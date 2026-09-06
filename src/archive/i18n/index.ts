import type { LocaleCode } from '../../i18n/locales';
import type { ArchiveEntity, MediaRef } from '../types';
import type { ArchivePatch, ArchiveTranslation, MediaPatch } from './types';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';

/** ko 는 canonical 이라 오버레이가 없다(src/i18n/index.tsx 와 같은 규칙). */
export const archiveTranslations: Readonly<Record<LocaleCode, ArchiveTranslation | null>> = {
  ko: null,
  en,
  ja,
  zh,
};

/** ''·[] 는 "아직 번역 안 됨"이지 "빈 값으로 번역"이 아니다. */
function filled(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function pick<T>(patched: T | undefined, canonical: T): T {
  return filled(patched) ? (patched as T) : canonical;
}

/**
 * 패치를 엔티티에 얹는다. 적용할 게 없으면 **같은 객체 참조**를 그대로 돌려준다
 * (React 가 불필요하게 다시 그리지 않도록).
 */
export function localizeEntity<T extends ArchiveEntity>(entity: T, patch: ArchivePatch | undefined): T {
  if (!patch) return entity;

  const next: Record<string, unknown> = { ...entity };
  let changed = false;

  const set = (key: string, value: unknown) => {
    if (value !== undefined && value !== next[key]) {
      next[key] = value;
      changed = true;
    }
  };

  if (filled(patch.title)) set('title', patch.title);
  if (filled(patch.subtitle)) set('subtitle', patch.subtitle);
  if (filled(patch.summary)) set('summary', patch.summary);
  if (filled(patch.body)) set('body', patch.body);
  if (filled(patch.tags)) set('tags', patch.tags);
  if (filled(patch.era)) set('era', patch.era);
  if (filled(patch.medium)) set('medium', patch.medium);
  if (filled(patch.dimensions)) set('dimensions', patch.dimensions);
  if (filled(patch.acquisition)) set('acquisition', patch.acquisition);
  if (filled(patch.venue)) set('venue', patch.venue);
  if (filled(patch.citation)) set('citation', patch.citation);
  if (filled(patch.holdingNote)) set('holdingNote', patch.holdingNote);
  if (filled(patch.village)) set('village', patch.village);
  if (filled(patch.displayName)) set('displayName', patch.displayName);
  if (filled(patch.occupations)) set('occupations', patch.occupations);
  if (filled(patch.statement)) set('statement', patch.statement);
  if (filled(patch.context)) set('context', patch.context);
  if (filled(patch.themes)) set('themes', patch.themes);

  if (filled(patch.creditLine)) {
    next.rights = { ...entity.rights, creditLine: patch.creditLine };
    changed = true;
  }

  if (filled(patch.dateDisplay)) {
    // 날짜 표기만 번역한다 — value/precision(사실)은 절대 건드리지 않는다.
    const withDate = next as { when?: { display?: string }; created?: { display?: string } };
    if (withDate.when) {
      withDate.when = { ...withDate.when, display: patch.dateDisplay };
      changed = true;
    }
    if (withDate.created) {
      withDate.created = { ...withDate.created, display: patch.dateDisplay };
      changed = true;
    }
  }

  if (patch.placeNotes && entity.places.length > 0) {
    const notes = patch.placeNotes;
    next.places = entity.places.map((p) => {
      const note = notes[p.placeId];
      return filled(note) ? { ...p, note } : p;
    });
    changed = true;
  }

  return changed ? (next as T) : entity;
}

export function localizeMedia(media: MediaRef, patch: MediaPatch | undefined): MediaRef {
  if (!patch) return media;
  const alt = pick(patch.alt, media.alt);
  const creditLine = pick(patch.creditLine, media.rights.creditLine);
  if (alt === media.alt && creditLine === media.rights.creditLine) return media;
  return { ...media, alt, rights: { ...media.rights, creditLine } };
}

export type { ArchivePatch, ArchiveTranslation, MediaPatch } from './types';
