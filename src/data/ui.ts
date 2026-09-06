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
    expand: '펼쳐 보기',
    collapse: '접기',
  },
  states: {
    loading: '불러오는 중…',
    error: '정보를 불러오지 못했어요.',
    empty: '표시할 내용이 아직 없어요.',
    updatedAt: '기준 시각',
  },
  ferry: {
    title: '운항 상태',
    today: '오늘',
    tomorrow: '내일',
    /*
     * 신호등 라벨 — 앱(app/lib/i18n/labels.dart statusLabel)과 같은 규칙.
     * 같은 색이라도 확신도(confirmed/predicted)에 따라 말이 달라진다:
     * 확정된 중단과 예측된 위험은 다른 사실이기 때문이다.
     */
    lights: {
      red: { confirmed: '운항 중단', predicted: '결항 주의' },
      yellow: { confirmed: '일시 중단', predicted: '운항 주의' },
      green: '운항',
      closed: '운항 종료',
      gray: '확인 필요',
    },
    /* 내일 전망 라벨(앱 outlookLabel 과 동일). */
    outlook: {
      green: '좋음',
      yellow: '주의',
      red: '운항 차질 가능성 높음',
      closed: '운항 없음',
      gray: '확인 필요',
    },
    weatherNow: '현재 기상',
    /*
     * 운항 문구는 서버가 준 완성 문장(headline)을 그대로 쓰지 않고,
     * **code + params 로 여기서 조립한다.** 앱(app/lib/i18n/labels.dart)과 같은 방식이라
     * 앱과 웹이 같은 말을 하고, 언어를 바꿔도 한국어가 새지 않는다.
     * 문안은 앱의 app_ko.arb 와 글자까지 맞췄다.
     *
     * ★ **이 블록(headlines·reasons)만 '-합니다'체를 유지한다.** 사이트의 나머지 문안은
     *   해요체지만, 운항 판정은 앱과 웹이 한 글자도 다르면 안 되는 안전 정보라
     *   앱 문안이 단일 소스다. 문체를 손질할 때 여기는 건드리지 않는다 —
     *   바꾸려면 앱 app_ko.arb 를 먼저 바꾸고 같이 옮긴다.
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
    windDir: '풍향',
    humidity: '습도',
    wave: '파고',
    /* 풍향(도)을 사람이 읽는 방위로. 16방위, 북에서 시계방향. */
    compass: [
      '북', '북북동', '북동', '동북동',
      '동', '동남동', '남동', '남남동',
      '남', '남남서', '남서', '서남서',
      '서', '서북서', '북서', '북북서',
    ],
  },
  /*
   * 시간표 라벨은 여기 둔다 — 예전에는 '첫 배'·'막 배'·'출발 기준'이 컴포넌트에
   * 박혀 있어서 언어를 바꿔도 그 줄만 한국어로 남았다(불변식 1 위반).
   */
  timetable: {
    title: '운항 시간표',
    note: '시간은 계절·기상에 따라 바뀌어요. 실제 운항 시간은 다를 수 있어요.',
    first: '첫 배',
    last: '막 배',
    fromNote: '{port} 출발 기준',
  },
  shops: { title: '가게', category: '업종', hours: '영업시간' },
  cctv: {
    title: '항구 CCTV',
    note: '출처: 제주특별자치도 제주시',
    failed: '영상을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.',
  },
  footer: {
    madeBy: '우도의 모습을 알리기 위해 만들었어요.',
  },
  nav: { menu: '메뉴', close: '닫기' },
  app: {
    about: '우도나우란',
    install: '설치하기',
    openWeb: '웹으로 열기',
    comingSoon: '앱 출시 준비 중',
  },
  notFound: {
    title: '여기는 아직 물이 안 빠졌어요',
    body: '찾는 페이지가 없어요.',
    home: '홈으로',
  },
  theme: { light: '라이트', dark: '다크' },
} as const;
