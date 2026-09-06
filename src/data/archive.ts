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
      '그 기록을 살아낸 사람의 말이 있습니다.',
    featured: '오늘의 기록',
  },

  sections: {
    artists: { title: '우도를 기록한 사람들', sub: 'Artists', desc: '섬을 오래 찍고 쓰고 그린 이들' },
    works: { title: '사진과 기록', sub: 'Works', desc: '남겨진 작품과 기록물' },
    collections: { title: '컬렉션', sub: 'Collections', desc: '주제로 묶어 읽는 자료' },
    exhibitions: { title: '기획전', sub: 'Exhibitions', desc: '온라인으로 여는 전시' },
    library: { title: '우도 서재', sub: 'Library', desc: '우도를 다룬 책·향토지·논문·기사' },
    history: { title: '우도의 시간', sub: 'History', desc: '출처를 밝힌 우도의 역사' },
    voices: { title: '우도의 목소리', sub: 'Voices of Udo', desc: '섬에서 살아온 분들의 말과 기억' },
    selectedWorks: { title: '주요 작품', sub: '', desc: '' },
    biography: { title: '생애', sub: '', desc: '' },
    statement: { title: '작가의 말', sub: '', desc: '' },
    related: { title: '이 기록과 이어진 것', sub: '', desc: '' },
    sources: { title: '출처', sub: '', desc: '' },
    timeline: { title: '연표', sub: '', desc: '' },
    sessions: { title: '인터뷰 기록', sub: '', desc: '' },
    clips: { title: '들어보기', sub: '', desc: '' },
  },

  /* 자료가 아직 없을 때. 가짜 자료 대신 이 상태를 보여준다. */
  empty: {
    title: '자료 준비 중',
    body: '아직 공개된 자료가 없습니다. 원자료와 권리·동의 확인이 끝나는 대로 이 자리에 올라갑니다.',
    notFound: '찾는 기록이 없습니다',
    notFoundBody: '주소가 바뀌었거나 아직 공개되지 않은 기록입니다.',
    backToArchive: '기록으로 돌아가기',
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
  },

  work: {
    credit: 'Credit',
    medium: '재료·형식',
    dimensions: '크기',
    date: '제작 시기',
    place: '장소',
    unknownArtist: '작자 미상',
    rightsNote: '이 사진의 저작권은 권리자에게 있습니다. 무단 복제·배포를 금합니다.',
  },
} as const;
