/*
 * 홈 문안. 실시간 데이터(운항·축제·사진)는 컴포넌트가 앱 서버에서 받아온다.
 *
 * UdoWeb 은 세 축이 함께 있는 사이트다 — **기록 + 지금 + 여행**.
 * 홈의 순서가 그 성격을 말한다: 기록을 먼저 보여주되, 실용 정보를 뒤로 숨기지 않는다.
 */
export const home = {
  hero: {
    eyebrow: '제주 우도',
    title: '우도를 기록합니다',
    lead:
      '사람이 살았던 시간, 사라지는 말, 누군가가 남긴 풍경을 기록합니다. ' +
      '그리고 오늘 배가 뜨는지도 함께 알려드립니다.',
    ctaPrimary: { label: '기록 보기', to: '/archive' },
    ctaSecondary: { label: '여행 정보', to: '/travel' },
  },
  /*
   * 기록으로 들어가는 입구. 예전에는 기록·역사·목소리 셋을 나열했지만,
   * 왼쪽 메뉴가 이미 갈래를 보여주므로 홈에서는 하나만 크게 둔다.
   */
  records: {
    title: '무엇을 기록하나',
    artists: { title: '우도를 기록한 사람들', sub: 'Photography / Artists', to: '/archive' },
  },
  sections: {
    featured: { title: '오늘의 기록', desc: '아카이브에서 꺼내 온 한 장' },
    ferry: { title: '지금의 우도', desc: '오늘 배가 뜨는지' },
    gallery: { title: '현재의 우도', desc: '방문자와 현지 엠버서더가 남긴 최근 사진' },
    travel: { title: '여행 정보', desc: '가는 길·여행 팁·먹거리' },
    app: { title: '섬에서는 앱으로', desc: '배·버스·물때·CCTV를 손에서' },
  },
} as const;
