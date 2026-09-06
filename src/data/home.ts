/* 홈 화면 문안. 실시간 데이터(운항·시간표·축제)는 컴포넌트가 API 에서 받는다. */
export const home = {
  hero: {
    eyebrow: '제주 우도',
    title: '바다 색이 30분마다 바뀌는 섬',
    lead:
      '성산포에서 배로 15분. 흰 산호 백사장과 검은 모래, 해녀의 바다와 땅콩밭이 ' +
      '한 섬 안에 있습니다. 우도의 진짜 모습을 여기서 먼저 보세요.',
    ctaPrimary: { label: '우도8경 보기', to: '/spots' },
    ctaSecondary: { label: '가는 길', to: '/access' },
  },
  sections: {
    ferry: { title: '오늘 배가 뜨나요', desc: '우도 나우의 운항 판정을 그대로 보여줍니다.' },
    eight: { title: '우도8경', desc: '섬에서 오래 꼽아온 여덟 풍경' },
    places: { title: '주요 명소', desc: '실제로 찾아가는 자리' },
    festivals: { title: '축제·행사', desc: '지금 열리거나 곧 열리는 것' },
    gallery: { title: '우도의 얼굴', desc: '현지 엠버서더와 방문자가 남긴 사진' },
    app: { title: '섬에서는 앱으로', desc: '배·버스·물때·CCTV를 손에서' },
  },
} as const;
