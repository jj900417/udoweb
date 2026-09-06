/*
 * 허브 안쪽 세로 메뉴(왼쪽 사이드바).
 *
 * 상단 1차 탭은 3개(홈·우도·지금 우도)뿐이고, 갈래는 여기서 고른다.
 * 하위가 있는 그룹은 **눌러서 펼친다** — 자료가 늘어도 목록이 길어지지 않게.
 * 지금 보고 있는 페이지가 속한 그룹은 자동으로 펼쳐진다.
 *
 * count 는 개수를 붙일 아카이브 종류(EntityKind). 빈 문자열이면 개수를 안 붙인다.
 * path 는 기존 URL 그대로 — 공유된 링크가 계속 살아 있어야 한다.
 */
export const sideNav = {
  udo: {
    title: '우도',
    groups: [
      { path: '/about', label: '섬 소개', count: '', items: [] },
      {
        path: '/archive',
        label: '우도의 기록',
        count: '',
        items: [
          { path: '/archive/artists', label: '사람', count: 'artist' },
          { path: '/archive/works', label: '작품', count: 'work' },
          { path: '/archive/collections', label: '컬렉션', count: 'collection' },
          { path: '/archive/exhibitions', label: '기획전', count: 'exhibition' },
          { path: '/archive/library', label: '서재', count: 'library' },
        ],
      },
      { path: '/history', label: '우도의 시간', count: 'history', items: [] },
      { path: '/voices', label: '우도의 목소리', count: 'voicePerson', items: [] },
    ],
  },
  now: {
    title: '지금 우도',
    groups: [
      { path: '/now', label: '오늘의 우도', count: '', items: [] },
      { path: '/gallery', label: '현재 사진', count: '', items: [] },
      {
        path: '/travel',
        label: '섬을 여행하는 방법',
        count: '',
        items: [
          { path: '/spots', label: '우도8경·명소', count: '' },
          { path: '/access', label: '가는 길', count: '' },
          { path: '/experience', label: '즐길거리', count: '' },
          { path: '/food', label: '먹거리·가게', count: '' },
          { path: '/tips', label: '여행 팁', count: '' },
        ],
      },
      { path: '/app', label: '우도 나우 앱', count: '', items: [] },
    ],
  },
} as const;
