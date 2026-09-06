/*
 * 개발용 무결성 점검 — 순수 함수(console 을 직접 쓰지 않는다).
 *
 * 잡는 것: 중복 id/slug · 형식이 틀린 slug · id 접두사와 kind 불일치 ·
 * 끊긴 참조(오타) · 없는 미디어/출처/장소 · 권리 미기재 · 동의 위반 ·
 * **고아 번역**(사라진 id 를 가리키는 번역 패치 — index 병합에서는 못 잡는 종류).
 *
 * 프로덕션 번들에는 들어가지 않는다(index.ts 에서 import.meta.env.DEV 로 감쌈).
 */
import type { ArchiveDataset } from './records';
import type { PlaceRefId } from './ids';
import { kindOfId } from './ids';
import type { ArchiveEntity } from './types';
import { isSession, isVoiceClip, isVoicePerson } from './types';
import { collectDeclaredIds } from './relations';
import type { ArchiveTranslation } from './i18n/types';

export type IntegrityCode =
  | 'duplicate-id'
  | 'duplicate-slug'
  | 'bad-slug'
  | 'id-kind-mismatch'
  | 'dangling-ref'
  | 'unknown-media'
  | 'unknown-source'
  | 'unknown-place'
  | 'rights-incomplete'
  | 'consent-violation'
  | 'stale-translation';

export type IntegrityIssue = {
  readonly severity: 'error' | 'warn';
  readonly code: IntegrityCode;
  readonly subject: string;
  readonly message: string;
};

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

function mediaIdsOf(e: ArchiveEntity): readonly string[] {
  const ids: string[] = [];
  const maybe = e as { mediaIds?: readonly string[]; portraitMediaId?: string; coverMediaId?: string; posterMediaId?: string; audioMediaId?: string };
  if (maybe.mediaIds) ids.push(...maybe.mediaIds);
  for (const single of [maybe.portraitMediaId, maybe.coverMediaId, maybe.posterMediaId, maybe.audioMediaId]) {
    if (single) ids.push(single);
  }
  return ids;
}

export function checkIntegrity(
  data: ArchiveDataset,
  translations: readonly ArchiveTranslation[],
  knownPlaceIds: readonly PlaceRefId[],
): readonly IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const add = (severity: 'error' | 'warn', code: IntegrityCode, subject: string, message: string) =>
    issues.push({ severity, code, subject, message });

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

  const ids = new Set<string>();
  const slugs = new Set<string>();
  const mediaIds = new Set<string>(data.media.map((m) => m.id));
  const places = new Set<string>(knownPlaceIds);

  for (const e of all) {
    if (ids.has(e.id)) add('error', 'duplicate-id', e.id, 'ID 가 중복됩니다.');
    ids.add(e.id);

    const slugKey = `${e.kind}/${e.slug}`;
    if (slugs.has(slugKey)) add('error', 'duplicate-slug', slugKey, '같은 종류 안에서 slug 가 중복됩니다.');
    slugs.add(slugKey);

    if (!SLUG_RE.test(e.slug)) add('error', 'bad-slug', e.id, `slug '${e.slug}' 는 소문자·숫자·하이픈만 씁니다.`);
    if (kindOfId(e.id) !== e.kind) add('error', 'id-kind-mismatch', e.id, `ID 접두사가 kind '${e.kind}' 와 다릅니다.`);

    if (!e.rights.copyrightHolder || !e.rights.creditLine) {
      add('warn', 'rights-incomplete', e.id, '권리자 또는 credit 문구가 비어 있습니다.');
    }
    if (e.publishStatus === 'published' && e.rights.rightsStatus !== 'verified') {
      add('warn', 'rights-incomplete', e.id, 'published 인데 권리가 verified 가 아닙니다 — 공개되지 않습니다.');
    }

    for (const id of e.sourceIds) {
      if (!ids.has(id) && !all.some((x) => x.id === id)) {
        add('warn', 'unknown-source', e.id, `없는 출처 '${id}' 를 가리킵니다.`);
      }
    }
    for (const id of mediaIdsOf(e)) {
      if (!mediaIds.has(id)) add('warn', 'unknown-media', e.id, `없는 미디어 '${id}' 를 가리킵니다.`);
    }
    for (const link of e.places) {
      if (!places.has(link.placeId)) add('warn', 'unknown-place', e.id, `없는 장소 '${link.placeId}' 를 가리킵니다.`);
    }

    if ((isVoicePerson(e) || isSession(e)) && e.publishStatus === 'published') {
      if (!e.consent.obtained || e.consent.scope !== 'public') {
        add('warn', 'consent-violation', e.id, 'published 인데 웹 공개 동의가 없습니다 — 공개되지 않습니다.');
      }
    }
    if (isVoiceClip(e) && !data.sessions.some((s) => s.id === e.sessionId)) {
      add('error', 'dangling-ref', e.id, `없는 세션 '${e.sessionId}' 에 속해 있습니다.`);
    }
  }

  for (const e of all) {
    for (const target of collectDeclaredIds(e)) {
      if (!ids.has(target)) add('error', 'dangling-ref', e.id, `없는 레코드 '${target}' 를 가리킵니다.`);
    }
  }

  for (const t of translations) {
    for (const key of Object.keys(t.entries)) {
      if (!ids.has(key)) add('warn', 'stale-translation', `${t.locale}:${key}`, '없는 레코드의 번역이 남아 있습니다.');
    }
    for (const key of Object.keys(t.media)) {
      if (!mediaIds.has(key)) add('warn', 'stale-translation', `${t.locale}:${key}`, '없는 미디어의 번역이 남아 있습니다.');
    }
  }

  return issues;
}
