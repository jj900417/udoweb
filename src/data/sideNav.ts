/*
 * 허브 안쪽 세로 메뉴(왼쪽 사이드바).
 *
 * 상단 1차 탭은 3개(홈·우도·지금 우도)뿐이고, 그 아래 갈래는 각 허브의 왼쪽 메뉴에서
 * 고른다. 블로그의 카테고리 목록과 같은 방식 — 지금 어디에 있고 옆에 무엇이 있는지가
 * 한 화면에 같이 보인다.
 *
 * count 는 아카이브 레코드 수를 붙일 종류(EntityKind)다. 없으면 개수를 안 붙인다.
 * path 는 기존 URL 그대로 — 공유된 링크가 계속 살아 있어야 한다.
 */
export const sideNav = {
  udo: {
    title: '우도',
    items: [
      { path: '/about', label: '섬 소개', count: '' },
      { path: '/archive', label: '기록', count: '' },
      { path: '/archive/artists', label: '사람', count: 'artist' },
      { path: '/archive/works', label: '작품', count: 'work' },
      { path: '/archive/collections', label: '컬렉션', count: 'collection' },
      { path: '/archive/exhibitions', label: '기획전', count: 'exhibition' },
      { path: '/history', label: '역사', count: 'history' },
      { path: '/voices', label: '목소리', count: 'voicePerson' },
      { path: '/archive/library', label: '서재', count: 'library' },
    ],
  },
  now: {
    title: '지금 우도',
    items: [
      { path: '/now', label: '오늘의 우도', count: '' },
      { path: '/gallery', label: '현재 사진', count: '' },
      { path: '/spots', label: '우도8경·명소', count: '' },
      { path: '/access', label: '가는 길', count: '' },
      { path: '/experience', label: '즐길거리', count: '' },
      { path: '/food', label: '먹거리·가게', count: '' },
      { path: '/tips', label: '여행 팁', count: '' },
      { path: '/app', label: '우도 나우 앱', count: '' },
    ],
  },
} as const;
