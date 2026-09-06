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
    /*
     * 운항 문구는 서버가 준 완성 문장(headline)을 그대로 쓰지 않고,
     * **code + params 로 여기서 조립한다.** 앱(app/lib/i18n/labels.dart)과 같은 방식이라
     * 앱과 웹이 같은 말을 하고, 언어를 바꿔도 한국어가 새지 않는다.
     * 문안은 앱의 app_ko.arb 와 글자까지 맞췄다.
     */
    headlines: {
      manual_red_today: '오늘 운항이 중단되었습니다',
      manual_red_range: '{month}월 {day}일까지 운항이 중단됩니다',
      manual_yellow: '지금 일시적으로 운항을 멈췄습니다',
      manual_green: '오늘 정상 운항합니다',
      notice_red: '오늘 운항이 중단되었습니다 (선사 공지)',
      warning_red: '기상특보로 결항 가능성이 큽니다',
      auto_green: '정상 운항 중입니다',
      gray_unknown: '현재 정보를 확인할 수 없습니다. 전화로 확인하세요',
      closed_before_first: '아직 운항 시간 전입니다',
      closed_after_last: '오늘 운항이 끝났습니다',
    },
    reasons: {
      manual_reason: '사유: {reason}',
      resume_when_clear: '상황이 풀리면 운항을 재개합니다',
      closed_until: '{month}월 {day}일까지 결항 예정',
      notice_detected: '우도해운 휴항 공지 감지',
      warning_active: '제주도동부앞바다 {kind} 발효 중',
      warning_minor: '{kind} 발효 중 · 운항 영향은 크지 않습니다',
      no_warning_no_notice: '기상특보 없음, 휴항 공지 없음',
      collect_failed: '기상·공지 정보 수집 실패',
      before_first_boat: '오늘 첫 배가 아직 출발하지 않았습니다',
      after_last_boat: '운영 시간이 종료되었습니다',
    },
    warningKinds: {
      typhoon: '태풍',
      alert: '경보',
      advisory: '주의보',
      preliminary: '예비특보',
    },
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
