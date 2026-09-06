/*
 * 사이트 전역 정보. 여기 값이 헤더·푸터·OG·연락처의 단일 소스다.
 * VERIFY: 로 표시된 항목은 운영 주체(우도면/사업자)가 확인 후 확정할 것.
 */
export const site = {
  name: '우도',
  tagline: '제주 바다 위의 작은 섬',
  domain: 'udonow.co.kr',
  url: 'https://udonow.co.kr',
  /* 사이트를 운영하는 주체. VERIFY: 공식 명칭·연락처 확정 필요. */
  operator: {
    name: '우도나우',
    role: '우도 안내 서비스',
    email: '',
    phone: '',
  },
  appFeaturesTitle: '앱에서 되는 것',
  /* 관련 서비스 링크 */
  app: {
    name: '우도 나우',
    desc: '오늘 배가 뜨는지, 버스는 언제 오는지 — 우도 여행 앱',
    web: 'https://udo.junghwanyoon.dev',
    android: '', // Play 출시 후 채움
    ios: '',
  },
  /* 공식/공공 참고 링크 (외부) */
  officialLinks: [
    { label: '제주관광공사 VISIT JEJU', url: 'https://www.visitjeju.net' },
    { label: '제주시 우도면', url: 'https://www.jejusi.go.kr' },
    { label: '국립해양조사원 물때', url: 'https://www.khoa.go.kr/oceangrid/gis/category/observe/observeSearch.do' },
  ],
} as const;
