/*
 * 아카이브·역사·목소리 **화면 문안**(chrome). 레코드(작가·작품·역사·구술)는 여기 없다 —
 * 그건 src/archive/records/ 에 있고 번역도 ID 로 붙는다.
 *
 * ★ 이 파일은 **객체만** 쓴다(배열 금지). 일반 UI 번역은 배열을 index 로 병합하므로
 *   항목을 중간에 끼워 넣으면 라벨이 밀린다. 키로 접근하면 그 위험이 없다.
 */
export const archive = {
  /* 프로젝트 철학 — 반복해서 남발하지 않는다. 아카이브 허브와 소개에서만 쓴다. */
  philosophy: {
    line: '사라질 것을 알기에, 사라지기 전에 기록합니다.',
    body:
      '우도의 시간은 빠르게 지워지고 있습니다. 밭담이 헐리고, 배가 바뀌고, ' +
      '제주어를 쓰던 분들이 한 분씩 떠납니다. 이 아카이브는 그 전에 남기려는 기록입니다.',
  },

  hub: {
    eyebrow: 'UDO ARCHIVE',
    title: '우도를 기록해 온 사람들과 그들이 남긴 시간',
    lead:
      '사진과 역사와 목소리를 따로 두지 않습니다. 한 장의 사진 옆에 그 시절의 기록이 있고, ' +
      '그 기록을 살아낸 사람의 말이 있습니다. 왼쪽에서 갈래를 골라 들어가세요.',
    featured: '오늘의 기록',
    about: { title: '섬 소개', desc: '우도가 어떤 곳인지부터' },
  },

  sections: {
    artists: {
      title: '우도를 기록하는 사람들',
      sub: 'Artists',
      desc: '우도를 찍고 그린 분들',
    },
    works: { title: '사진과 기록', sub: 'Works', desc: '남겨진 작품과 기록물' },
    collections: { title: '컬렉션', sub: 'Collections', desc: '사진으로 읽는 우도' },
    exhibitions: { title: '기획전', sub: 'Exhibitions', desc: '온라인으로 여는 전시' },
    library: {
      title: '이 시간을 뒷받침하는 자료',
      sub: 'Library',
      desc: '우도를 다룬 책·향토지·논문·기사',
    },
    history: {
      title: '우도의 시간',
      sub: 'History',
      desc: '출처를 밝힌 우도의 역사와, 그 근거가 된 자료',
      lead:
        '우도에 사람이 들어와 살기 시작한 때부터 지금까지를, 출처를 밝히며 정리합니다. ' +
        '연도가 분명하지 않은 일은 분명하지 않은 채로 적습니다.',
    },
    sounds: {
      title: '우도의 소리',
      sub: 'Sounds of Udo',
      desc: '섬에서 나는 소리와 사람들의 말',
    },
    voices: {
      title: '우도의 목소리',
      sub: 'Voices of Udo',
      desc: '섬에서 살아온 분들의 말과 기억',
      lead:
        '우도에서 살아온 분들의 목소리를 그대로 남깁니다. 말투와 억양, 그 말에 담긴 기억까지가 ' +
        '기록입니다. 공개는 본인(또는 유족)의 동의 범위 안에서만 합니다.',
      siblingNote: '사람의 말이 아닌 섬의 소리는 「소리」에 있습니다.',
    },
    selectedWorks: { title: '주요 작품', sub: '', desc: '' },
    biography: { title: '생애', sub: '', desc: '' },
    statement: { title: '작가의 말', sub: '', desc: '' },
    related: { title: '이 기록과 이어진 것', sub: '', desc: '' },
    sources: { title: '출처', sub: '', desc: '' },
    timeline: { title: '연표', sub: '', desc: '' },
    sessions: { title: '인터뷰 기록', sub: '', desc: '' },
    clips: { title: '들어보기', sub: '', desc: '' },
    people: { title: '이야기해 주신 분들', sub: 'People', desc: '' },
    more: { title: '더 보기', sub: 'Elsewhere in the archive', desc: '' },
    publications: { title: '관련 자료', sub: 'Books & Sources', desc: '' },
  },

  /* 자료가 아직 없을 때. 가짜 자료 대신 이 상태를 보여준다. */
  empty: {
    title: '자료 준비 중',
    body: '아직 공개된 자료가 없습니다. 원자료와 권리·동의 확인이 끝나는 대로 이 자리에 올라갑니다.',
    notFound: '찾는 기록이 없습니다',
    notFoundBody: '주소가 바뀌었거나 아직 공개되지 않은 기록입니다.',
    backToArchive: '기록으로 돌아가기',
    structureOnly:
      '지금은 구조만 있고 자료가 없습니다. 사진·기록·구술 자료는 권리와 동의 확인이 끝난 것부터 올라갑니다.',
    peopleNote: '인터뷰와 동의 절차가 끝난 분부터 이 자리에 모십니다. 동의 없이는 이름도 목소리도 올리지 않습니다.',
    historyNote: '『우도지』와 공공기록을 확인하며 항목을 하나씩 올립니다. 확인되지 않은 연도·사건은 싣지 않습니다.',
    libraryNote:
      '『우도지』를 비롯한 자료의 서지정보부터 정리해 올립니다. 원문 공개 권리가 없는 책은 소개와 소장처만 싣습니다.',
  },

  labels: {
    kinds: {
      artist: '사람',
      work: '작품',
      collection: '컬렉션',
      exhibition: '기획전',
      library: '자료',
      history: '역사',
      source: '출처',
      voicePerson: '목소리',
      session: '인터뷰',
      voiceClip: '녹음',
      sound: '소리',
    },
    precision: {
      exact: '',
      year: '년',
      decade: '년대',
      approximate: '무렵',
      unknown: '연도 미상',
    },
    categories: {
      settlement: '입도·정착',
      village: '마을',
      haenyeo: '해녀',
      agriculture: '농사',
      transport: '뱃길·교통',
      education: '교육',
      infrastructure: '기반시설',
      tourism: '관광',
      culture: '문화·신앙',
      other: '그 밖에',
    },
    roles: {
      photographer: '사진',
      writer: '글',
      painter: '그림',
      craft: '공예',
      researcher: '연구',
      resident: '주민 기록자',
      other: '기타',
    },
    itemTypes: {
      book: '단행본',
      udoji: '향토지',
      periodical: '정기간행물',
      thesis: '학위논문',
      report: '보고서',
      newspaper: '신문',
      map: '지도',
      av: '영상·음향',
      other: '기타',
    },
  },

  /* 소리 아카이브(사운드맵). 목소리(구술)와 나란히 두되 다른 종류의 기록이다. */
  sound: {
    title: '우도의 소리',
    sub: 'Sounds of Udo',
    lead:
      '소리는 사진보다 먼저 사라집니다. 뱃고동, 숨비소리, 밭담 사이를 지나는 바람을 ' +
      '그 자리에서 녹음해 남깁니다. 언제 어디서 녹음했고 그날 날씨가 어땠는지까지 함께 적습니다.',
    mapTitle: '소리 지도',
    mapLead: '핀을 누르면 그 자리에서 녹음한 소리가 재생됩니다.',
    mapPending: '아직 녹음이 없어 지도에 표시할 자리가 없습니다. 첫 녹음이 올라오면 여기에 핀이 찍힙니다.',
    recordedAt: '녹음',
    weather: '그날 날씨',
    temp: '기온',
    wind: '바람',
    wave: '파고',
    duration: '길이',
    kindsTitle: '소리의 종류',
    seasonTitle: '계절',
    timeTitle: '시간대',
    kinds: {
      wave: '파도',
      wind: '바람',
      boat: '뱃소리',
      bird: '새',
      haenyeo: '해녀·숨비소리',
      village: '마을',
      rain: '비',
      night: '밤',
      work: '일하는 소리',
      other: '그 밖에',
    },
    seasons: { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' },
    times: { morning: '아침', day: '낮', evening: '저녁', night: '밤' },
  },

  voice: {
    dialect: '제주어',
    standard: '표준어',
    context: '이 말에 담긴 이야기',
    listen: '목소리 듣기',
    play: '재생',
    pause: '일시정지',
    restart: '처음부터',
    slow: '천천히 듣기',
    normalSpeed: '보통 속도',
    repeatTitle: '따라 말해보기',
    repeatBody: '한 문장씩 듣고 소리 내어 따라 읽어보세요. 녹음 기능은 준비 중입니다.',
    noAudio: '음성 파일이 아직 없습니다.',
    anonymous: '실명 비공개',
    /* 전사 전문은 기본으로 접어 둔다 — 먼저 듣게 하고, 읽고 싶은 사람만 편다. */
    transcript: '전사 읽기',
    transcriptNote: '들리는 대로 옮긴 것이라 표기가 표준어와 다를 수 있습니다.',
    seek: '재생 위치',
    playing: '재생 중',
    paused: '멈춤',
    recordedOn: '기록된 날',
    /* 구술 기록은 분량과 공개 범위를 수치·문장으로 밝힌다(보존 기록의 관례). */
    extent: '녹음 {min}분',
    hasTranscript: '전사 있음',
    consentPublic: '웹 공개 동의',
    speakers: '이야기해 주신 분',
  },

  /*
   * 작품 기록 라벨. 순서는 한국 미술관 기록 관례(작가명→작품명→제작연도→재료→규격→
   * 부문→관리번호→수집경위→전시상태)를 사진 아카이브로 옮긴 것이다.
   * 라벨과 값은 크기·색을 다르게 둔다 — 같은 굵기로 나열하면 아무것도 스캔되지 않는다.
   */
  work: {
    credit: '저작권',
    photographer: '촬영자',
    title: '제목',
    date: '촬영연도',
    medium: '매체·기법',
    dimensions: '규격',
    classification: '분류',
    accession: '자료번호',
    acquisition: '수집경위',
    visibility: '공개상태',
    place: '촬영장소',
    collection: '컬렉션',
    unknownArtist: '작자 미상',
    publicLabel: '공개',
    rightsNote: '이 사진의 저작권은 권리자에게 있습니다. 무단 복제·배포를 금합니다.',
    /* 사진이 없는 기록도 숨기지 않는다 — 없다고 적고 페이지는 유지한다. */
    noImage: '이 자료의 사진은 아직 없습니다.',
    groups: {
      identity: '자료',
      creation: '촬영',
      material: '형태',
      provenance: '수집·공개',
    },
  },

  /* 아카이브 2차 내비 — /archive 안에서만 보인다. */
  nav: {
    artists: '사람',
    works: '작품',
    collections: '컬렉션',
    exhibitions: '기획전',
    library: '서재',
  },

  /* 브라우즈(시대·주제·장소). 축의 값이 2개 미만이면 화면에서 사라진다. */
  browse: {
    title: '찾아보기',
    decades: '시대',
    tags: '주제',
    places: '장소',
    all: '전체',
    resultCount: '{n}건',
  },

  /*
   * 기록에 대한 정직한 각주. 아카이브는 완결된 사실의 집합이 아니라
   * 확인된 만큼의 기록이라는 것을 화면에서도 밝힌다.
   */
  recordNote: {
    title: '이 기록에 대하여',
    body:
      '이 기록은 확인된 만큼만 적혀 있습니다. 빠진 것도, 나중에 고쳐질 것도 있습니다. ' +
      '다르게 알고 계신 것이 있으면 알려주세요.',
    updated: '갱신',
    sourceCount: '출처 {n}건',
  },
} as const;
