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
        /*
         * 작품(/archive/works)과 기획전(/archive/exhibitions)은 **일부러 메뉴에서 뺐다.**
         * - 작품: 사람·컬렉션을 통해 들어가는 것이 자연스럽고, 사진 낱장 목록을 앞세우면
         *   아카이브가 이미지 창고처럼 보인다.
         * - 기획전: 실제로 전시를 열 때 켠다. 자료도 없이 메뉴만 있으면 빈 약속이 된다.
         * 두 URL 과 화면은 그대로 살아 있다 — 여기 한 줄씩 되살리면 다시 나타난다.
         */
        items: [
          { path: '/archive/artists', label: '작가', count: 'artist' },
          { path: '/archive/collections', label: '컬렉션', count: 'collection' },
          { path: '/history', label: '시간', count: 'history' },
        ],
      },
      {
        path: '/sounds',
        label: '우도의 소리',
        count: '',
        items: [
          { path: '/voices', label: '목소리', count: 'voicePerson' },
          { path: '/sounds', label: '소리', count: 'sound' },
        ],
      },
    ],
  },
  now: {
    title: '지금 우도',
    groups: [
      { path: '/now', label: '오늘의 우도', count: '', items: [] },
      {
        path: '/travel',
        label: '섬을 여행하는 방법',
        count: '',
        /*
         * 명소(/spots)·즐길거리(/experience)는 메뉴에서 뺐다 — 화면과 URL 은 그대로 살아 있다.
         * 방문자가 실제로 찾는 순서(어떻게 가나 → 무엇을 알아야 하나 → 무엇을 먹나)로 둔다.
         */
        items: [
          { path: '/access', label: '오시는 길', count: '' },
          { path: '/tips', label: '여행 팁', count: '' },
          { path: '/food', label: '먹거리 · 가게', count: '' },
          { path: '/harbor', label: '항구', count: '' },
        ],
      },
      { path: '/app', label: '우도나우', count: '', items: [] },
    ],
  },
} as const;
