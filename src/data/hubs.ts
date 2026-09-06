/* 허브 페이지(여행·지금 우도) 문안. 링크 목록은 배열이 아니라 키 있는 객체다. */
export const hubs = {
  travel: {
    title: '여행',
    subtitle: '섬은 배 시간과 물때로 돌아갑니다',
    lead: '우도를 처음 오신다면 가는 길부터, 이미 아신다면 8경과 먹거리부터 보세요.',
    links: {
      spots: { to: '/spots', title: '우도8경·명소', desc: '오래 꼽아온 여덟 풍경과 실제로 찾아가는 자리' },
      access: { to: '/access', title: '가는 길', desc: '배편·시간표·섬 안 이동·안전' },
      experience: { to: '/experience', title: '즐길거리', desc: '해안도로·우도봉·축제, 그리고 섬에서 지킬 것' },
      food: { to: '/food', title: '먹거리·가게', desc: '땅콩과 소라, 그리고 지금 문 연 곳' },
      tips: { to: '/tips', title: '여행 팁', desc: '자주 묻는 것과 떠나기 전 체크리스트' },
    },
  },
  now: {
    title: '지금 우도',
    subtitle: '오늘 이 순간의 섬',
    lead:
      '운항 상태·시간표·행사·사진·항구 CCTV 는 우도 나우 앱 서버에서 실시간으로 받아옵니다. ' +
      '섬에서 바뀌면 여기도 바뀝니다.',
    links: {
      gallery: { to: '/gallery', title: '현재의 우도', desc: '방문자·현지 엠버서더가 올린 최근 사진' },
      access: { to: '/access', title: '배편 자세히', desc: '시간표와 항구 CCTV' },
      app: { to: '/app', title: '우도 나우 앱', desc: '결항 알림·버스 도착·물때' },
    },
    sections: {
      ferry: '운항 상태',
      timetable: '운항 시간표',
      festivals: '축제·행사',
      photos: '현재의 우도',
      cctv: '항구 CCTV',
    },
  },
} as const;
