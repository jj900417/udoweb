import type { HistoryEntry } from '../types';

/*
 * 우도의 시간 — 출처가 있는 역사 기록.
 *
 * Phase 1 은 비어 있다. 실제 자료(사람·작품·역사·목소리)는 사용자가 원자료와
 * 권리·동의를 확인해 준 뒤에 채운다. **가상의 레코드를 만들어 넣지 않는다.**
 * 채울 때 규칙: id 는 한 번 정하면 바꾸지 않는다 / 관계는 id 로만 잇는다 /
 * 확인하지 않은 연도·쪽수를 적지 않는다.
 */
export const historyEntries: readonly HistoryEntry[] = [];
