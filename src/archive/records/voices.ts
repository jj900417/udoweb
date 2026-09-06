import type { OralHistorySession, VoiceClip, VoicePerson } from '../types';

/*
 * 우도의 목소리 — 사람 → 인터뷰 세션 → 발췌 클립.
 *
 * Phase 1 은 비어 있다. 구술 자료는 **동의 범위를 확인한 뒤에만** 들어온다
 * (docs/oral-history-workflow.md). 동의서 원본·연락처·주소·원본 master 경로는
 * 이 저장소에 두지 않는다 — 타입에 그런 필드가 아예 없다.
 * 실제 인물과 실제 발화를 지어내지 않는다.
 */
export const voicePeople: readonly VoicePerson[] = [];
export const sessions: readonly OralHistorySession[] = [];
export const clips: readonly VoiceClip[] = [];
