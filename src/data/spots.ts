/*
 * 우도8경 + 주요 명소.
 * - eight[]: 우도팔경(牛島八景) — 전통적으로 꼽아온 여덟 풍경.
 *   설명 문안은 초안이다. VERIFY: 우도면·제주관광공사 자료로 표현 확정.
 * - places[]: 실제로 찾아가는 장소. lat/lon 은 우도 나우 앱
 *   server/app/photo.py 의 UDO_SPOTS 좌표(근사)와 같은 값을 쓴다.
 * 사진은 아직 없다 — image 를 채우면 카드가 사진 카드로 바뀐다(SpotCard).
 */
/* 8경·명소 화면 문안(제목·부제) — 컴포넌트에 문장을 두지 않기 위해 여기 둔다. */
export const spotsPage = {
  eightTitle: '우도8경',
  eightSubtitle: '섬 사람들이 오래 꼽아온 여덟 풍경 — 시간과 물때가 맞아야 보이는 것들',
  placesTitle: '주요 명소',
  placesSubtitle: '실제로 찾아가는 자리',
} as const;

export type EightView = {
  id: string;
  name: string;
  hanja: string;
  meaning: string;
  desc: string;
  when: string;
};

export const eightViews: EightView[] = [
  {
    id: 'jugan-myeongwol',
    name: '주간명월',
    hanja: '晝間明月',
    meaning: '낮에 뜨는 달',
    desc: '동안경굴 안으로 든 햇빛이 천장 바위에 둥글게 맺혀 달처럼 보여요. 우도팔경 중 첫째로 꼽혀요.',
    when: '맑은 날 정오 무렵 · 물이 빠졌을 때',
  },
  {
    id: 'yahang-eobeom',
    name: '야항어범',
    hanja: '夜航漁帆',
    meaning: '밤바다의 고깃배',
    desc: '한치·갈치 배가 불을 켜고 나가면 수평선에 불빛의 줄이 생겨요. 섬에서 자야만 볼 수 있는 풍경이에요.',
    when: '여름밤 · 조업철',
  },
  {
    id: 'cheonjin-gwansan',
    name: '천진관산',
    hanja: '天津觀山',
    meaning: '천진항에서 바라본 한라산',
    desc: '우도에서 바다 건너 제주 본섬을 보면 한라산이 통째로 누워요. 배에서 내리자마자 보이는 첫 풍경이에요.',
    when: '공기 맑은 날 아침',
  },
  {
    id: 'jidu-cheongsa',
    name: '지두청사',
    hanja: '指頭靑沙',
    meaning: '우도봉에서 내려다본 푸른 모래',
    desc: '우도봉 능선에 올라 섬 전체와 그 너머 바다를 한눈에 담는 자리예요. 우도에서 가장 넓은 시야가 열려요.',
    when: '해 지기 한두 시간 전',
  },
  {
    id: 'jeonpo-mangdo',
    name: '전포망도',
    hanja: '前浦望島',
    meaning: '바다에서 바라본 우도',
    desc: '성산포에서 배로 건너오며 보는 우도의 옆모습. 누운 소의 등처럼 낮고 길게 이어져요.',
    when: '배 위 · 오는 길',
  },
  {
    id: 'huhae-seokbyeok',
    name: '후해석벽',
    hanja: '後海石壁',
    meaning: '섬 뒤편의 검은 절벽',
    desc: '우도봉 뒤로 돌아가면 수직으로 깎인 현무암 절벽이 바다로 떨어져요. 파도가 높은 날은 소리가 달라요.',
    when: '사철 · 바람 잔잔한 날 안전하게',
  },
  {
    id: 'dongan-gyeonggul',
    name: '동안경굴',
    hanja: '東岸鯨窟',
    meaning: '동쪽 해안의 고래굴',
    desc: '검멀레해변 끝 검은 모래 옆에 뚫린 큰 굴이에요. 고래가 살았다는 이야기가 전해져요. 물때에 따라 들어갈 수 있어요.',
    when: '간조 전후 · 물때 확인 필수',
  },
  {
    id: 'seobin-baeksa',
    name: '서빈백사',
    hanja: '西濱白沙',
    meaning: '서쪽 물가의 흰 모래',
    desc: '모래가 아니라 부서진 홍조단괴가 쌓인 해변이에요. 우리나라에서 드문 지형으로 천연기념물로 지정돼 있어요. 모래는 가져갈 수 없어요.',
    when: '한낮 · 햇빛 강할 때 물빛이 가장 밝아요',
  },
];

export type Place = {
  id: string;
  name: string;
  category: '해변' | '오름·전망' | '항구' | '문화·역사';
  lat: number;
  lon: number;
  summary: string;
  tips?: string;
  image?: string;
};

export const places: Place[] = [
  {
    id: 'seobin-baeksa',
    name: '서빈백사 (산호해변)',
    category: '해변',
    lat: 33.5083,
    lon: 126.9486,
    summary: '홍조단괴가 부서져 쌓인 흰 해변이에요. 날이 맑으면 물빛이 옥색으로 갈라져요.',
    tips: '천연기념물이라 모래·자갈을 가져가면 안 돼요. VERIFY: 지정번호 표기 확인',
  },
  {
    id: 'geommeolle',
    name: '검멀레해변',
    category: '해변',
    lat: 33.4936,
    lon: 126.9722,
    summary: '검은 모래(검멀레) 해변이에요. 절벽 아래 동안경굴로 이어져요.',
    tips: '굴 진입은 물때에 좌우돼요 — 만조에는 들어가지 마세요.',
  },
  {
    id: 'hagosudong',
    name: '하고수동해변',
    category: '해변',
    lat: 33.5128,
    lon: 126.9655,
    summary: '얕고 잔잔한 백사 해변이에요. 여름철 물놀이·스노클링 자리로 좋아요.',
  },
  {
    id: 'udobong',
    name: '우도봉 · 우도등대',
    category: '오름·전망',
    lat: 33.4986,
    lon: 126.9606,
    summary: '섬에서 가장 높은 곳이에요. 정상 능선에서 섬 전체와 성산일출봉이 함께 보여요.',
    tips: '그늘이 거의 없어요 — 여름엔 이른 아침이나 해 질 무렵에 가세요. VERIFY: 등대 점등 연도 표기',
  },
  {
    id: 'biyangdo',
    name: '비양도',
    category: '해변',
    lat: 33.5158,
    lon: 126.9719,
    summary: '우도에 다리로 붙은 작은 섬이에요. 일출과 캠핑, 그리고 탁 트인 수평선.',
  },
  {
    id: 'cheonjin',
    name: '천진항',
    category: '항구',
    lat: 33.505,
    lon: 126.953,
    summary: '우도의 관문 중 하나예요. 성산항에서 오는 배가 닿아요.',
  },
  {
    id: 'hawoomokdong',
    name: '하우목동항',
    category: '항구',
    lat: 33.511,
    lon: 126.956,
    summary: '섬 서북쪽 항구예요. 계절·물때에 따라 이쪽으로 배가 들어와요.',
    tips: '나갈 때 어느 항구에서 타는지 꼭 확인하세요 — 두 항구는 걸어서 멀어요.',
  },
  {
    id: 'haenyeo-memorial',
    name: '우도 해녀 항일운동 기념 공간',
    category: '문화·역사',
    lat: 33.5065,
    lon: 126.9605,
    summary: '바다에서 일하던 해녀들이 조직적으로 목소리를 낸 역사를 기리는 자리예요.',
    tips: 'VERIFY: 정확한 명칭·위치·개방 시간 확인 필요',
  },
];
