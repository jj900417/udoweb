/*
 * 상단 내비게이션 — 1차 메뉴 6개(허브). 하위 페이지는 각 허브 안에서 고른다
 * (드롭다운 없음: 모바일에서 안정적이고, 각 영역이 자기 소개를 할 수 있다).
 *
 * path 는 App.tsx 라우트와 1:1. 기존 URL(/spots·/access·/experience·/food·/tips)은
 * 그대로 살아 있고 /travel 허브가 그리로 안내한다.
 *
 * ⚠ 이 배열은 번역이 **index 로** 병합된다(src/i18n/translations/*.ts 의 nav).
 *   순서를 바꾸거나 중간에 끼워 넣으면 다른 언어의 라벨이 밀린다 — 번역 파일도 같이 고칠 것.
 */
export const nav = [
  { path: '/about', label: '우도' },
  { path: '/archive', label: '기록' },
  { path: '/history', label: '역사' },
  { path: '/voices', label: '목소리' },
  { path: '/travel', label: '여행' },
  { path: '/now', label: '지금 우도' },
] as const;
