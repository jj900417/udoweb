/* UI 라벨·공통 문구. 페이지 문안이 아니라 "버튼/상태/빈 화면" 같은 것만. */
export const ui = {
  brand: { name: '우도', sub: 'UDO' },
  actions: {
    more: '더 보기',
    call: '전화하기',
    openMap: '지도에서 보기',
    openLink: '바로가기',
    retry: '다시 시도',
    viewAll: '전체 보기',
  },
  states: {
    loading: '불러오는 중…',
    error: '정보를 불러오지 못했습니다.',
    empty: '표시할 내용이 아직 없습니다.',
    updatedAt: '기준 시각',
  },
  ferry: {
    title: '운항 상태',
    today: '오늘',
    tomorrow: '내일',
    source: '판정: 우도 나우 (기상청 특보·예보 + 선사 공지)',
    disclaimer: '최종 확인은 선사 전화가 가장 정확합니다.',
    lights: {
      green: '정상 운항',
      yellow: '주의',
      red: '결항',
      gray: '미확인',
    },
    weatherNow: '현재 기상',
    temp: '기온',
    wind: '풍속',
    wave: '파고',
  },
  timetable: { title: '운항 시간표', note: '시간은 계절·기상에 따라 바뀝니다.' },
  shops: { title: '가게', category: '업종', hours: '영업시간' },
  gallery: {
    title: '현재의 우도',
    subtitle: '방문자와 현지 엠버서더가 남긴 사진 — 계절·시간·날씨 태그가 붙어 있습니다',
    /* /archive 의 큐레이션된 작품과 다른 자료라는 점을 화면에서 분명히 한다. */
    note: '이 사진들은 지금의 우도입니다. 사진가의 작품과 옛 기록 사진은 기록(아카이브)에 따로 있습니다.',
    source: '사진은 {app} 앱을 통해 올라오고, 검수를 거친 것만 공개됩니다.',
  },
  cctv: { title: '실시간 CCTV', note: '제주시 공개 CCTV 링크' },
  footer: {
    madeBy: '우도의 모습을 알리기 위해 만들었습니다.',
    dataSource: '데이터 출처',
    verifyNote: '정보가 다르면 알려주세요 — 섬에서 바뀐 것을 반영합니다.',
  },
  nav: { menu: '메뉴', close: '닫기' },
  notFound: {
    title: '여기는 아직 물이 안 빠졌습니다',
    body: '찾는 페이지가 없습니다.',
    home: '홈으로',
  },
  theme: { light: '라이트', dark: '다크' },
} as const;
