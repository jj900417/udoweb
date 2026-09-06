/*
 * 상단 내비게이션 — 1차 메뉴 3개.
 *
 * 섬에 대한 것(소개·기록·역사·목소리)은 전부 '우도' 안에, 지금 이 순간에 필요한 것
 * (운항·사진·여행)은 전부 '지금 우도' 안에 둔다. 탭을 늘리는 대신 각 허브 안에서
 * 고르게 한다 — 메뉴가 길어질수록 무엇이 있는지 오히려 안 보인다.
 *
 * path 는 탭을 눌렀을 때 가는 곳, match 는 "이 탭이 켜져 보여야 하는 경로들"이다.
 * 기존 URL(/about·/spots·/access·/history·/voices…)은 하나도 바뀌지 않는다.
 *
 * ⚠ 이 배열은 번역이 index 로 병합된다(src/i18n/translations/*.ts 의 nav).
 *   항목을 늘리거나 순서를 바꾸면 번역 파일도 같이 고칠 것.
 */
export const nav = [
  { path: '/', label: '홈', match: ['/'] },
  {
    path: '/archive',
    label: '우도',
    match: ['/archive', '/history', '/voices', '/sounds', '/about'],
  },
  {
    path: '/now',
    label: '지금 우도',
    match: ['/now', '/app', '/travel', '/spots', '/access', '/experience', '/food', '/tips'],
  },
] as const;
