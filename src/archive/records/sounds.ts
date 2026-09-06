import type { SoundRecording } from '../types';

/*
 * 우도의 소리 — 장소에서 녹음한 소리(사운드맵·ASMR).
 *
 * Phase 1 은 비어 있다. 녹음이 들어올 때 규칙:
 * - **녹음 시점의 관측값을 그대로 적는다.** 나중에 날씨를 지어내거나 추정하지 않는다.
 * - 좌표는 실제 녹음 지점. 모르면 비워 두고 장소 링크(places)만 남긴다.
 * - 사람 목소리가 섞인 녹음은 구술 자료와 같은 동의 절차를 따른다
 *   (docs/oral-history-workflow.md). 지나가는 대화가 담겼다면 공개하지 않는다.
 */
export const soundRecordings: readonly SoundRecording[] = [];
