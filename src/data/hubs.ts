/* 허브 페이지(여행·지금 우도) 문안. 링크 목록은 배열이 아니라 키 있는 객체다. */
export const hubs = {
  travel: {
    title: '여행',
    subtitle: '',
    lead: '우도를 처음 오신다면 오시는 길부터, 이미 아신다면 가게를 확인해 주세요.',
    links: {
      access: { to: '/access', title: '오시는 길', desc: '뱃길·오는 순서·섬 안 이동' },
      tips: { to: '/tips', title: '여행 팁', desc: '자주 묻는 것과 떠나기 전 체크리스트' },
      food: { to: '/food', title: '먹거리 · 가게', desc: '땅콩과 소라 등, 그리고 가게 정보까지' },
      harbor: { to: '/harbor', title: '항구', desc: '천진항·하우목동항 실시간 화면' },
    },
  },
  now: {
    title: '지금 우도',
    subtitle: '오늘 이 순간의 섬',
    lead:
      '운항 상태·시간표·행사·사진·항구 CCTV 는 우도 나우 앱 서버에서 실시간으로 받아옵니다. ' +
      '섬에서 바뀌면 여기도 바뀝니다.',
    links: {
      access: { to: '/access', title: '배편 자세히', desc: '시간표와 항구 CCTV' },
      app: { to: '/app', title: '우도 나우 앱', desc: '결항 알림·버스 도착·물때' },
    },
    sections: {
      ferry: '운항 상태',
      timetable: '운항 시간표',
      festivals: '축제·행사',
      cctv: '항구 CCTV',
    },
  },
} as const;

/* 항구 화면 문안. */
export const harbor = {
  title: '항구',
  subtitle: '천진항·하우목동항의 지금',
  note: '영상은 제주특별자치도 제주시가 제공하는 공개 CCTV입니다. 화면이 끊길 때는 잠시 뒤 다시 시도해 주세요.',
} as const;
