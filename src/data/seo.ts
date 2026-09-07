/*
 * 검색 결과에 뜨는 문장.
 *
 * 지금까지 모든 페이지가 홈의 제목·설명을 그대로 달고 나갔어요. `/spots` 도
 * `/access` 도 검색 결과에서는 "우도 — 기록과 지금" 한 줄로만 보였다는 뜻이에요.
 * 무엇에 관한 페이지인지 알 수 없으니 눌러 볼 이유도 없었고요.
 *
 * 여기 있는 문장은 **방문자가 검색 결과에서 읽는 문장**이에요. 화면 안의 문안과
 * 같은 규칙을 따라요 — 해요체, 확인 안 된 사실은 안 씁니다.
 *
 * 경로를 키로 써요. 배열이 아니라 객체라서 번역은 **키로 병합**돼요(순서가 바뀌어도
 * 안 어긋나요). 새 페이지를 만들면 여기에도 한 줄 추가하고, 없으면 홈 것이 쓰여요.
 */
export interface PageSeo {
  title: string;
  description: string;
}

export const seo: Record<string, PageSeo> = {
  '/': {
    title: '우도 — 기록과 지금',
    description:
      '제주 우도의 역사·사람·풍경을 기록하고, 배편·버스·가게 같은 오늘의 여행 정보를 함께 안내해요.',
  },
  '/about': {
    title: '우도 소개 — 섬은 어떤 곳인가요',
    description: '제주 동쪽 바다 위의 작은 섬 우도가 어떤 곳인지, 무엇을 볼 수 있는지 안내해요.',
  },
  '/now': {
    title: '지금 우도 — 배편·날씨·현재 상황',
    description: '지금 배가 뜨는지, 날씨는 어떤지, 항구는 어떤 모습인지 실시간으로 확인해요.',
  },
  '/travel': {
    title: '우도 여행 안내',
    description: '우도를 처음 가는 사람이 알아야 할 것 — 가는 길, 볼 곳, 먹을 곳, 주의할 점.',
  },
  '/access': {
    title: '우도 가는 길 — 배편과 항구',
    description: '성산항에서 우도 가는 배편, 항구 위치, 배 시간과 요금을 안내해요.',
  },
  '/spots': {
    title: '우도 볼거리 — 우도팔경과 명소',
    description: '우도봉·검멀레·서빈백사 등 우도에서 꼭 보아야 할 곳을 모았어요.',
  },
  '/experience': {
    title: '우도에서 할 수 있는 것',
    description: '우도에서 해볼 만한 체험과 즐길 거리를 안내해요.',
  },
  '/food': {
    title: '우도 먹거리 — 땅콩과 해산물',
    description: '우도 땅콩아이스크림부터 해산물까지, 섬에서 맛볼 수 있는 것들이에요.',
  },
  '/tips': {
    title: '우도 여행 팁 — 가기 전에 알아둘 것',
    description: '배 시간, 섬 안 이동, 준비물 등 우도 여행 전에 알아두면 좋은 것들이에요.',
  },
  '/harbor': {
    title: '우도 항구 — 지금 모습',
    description: '천진항·하우목동항의 지금 모습과 배편 상황을 확인해요.',
  },
  '/app': {
    title: '우도 나우 앱',
    description: '오늘 배가 뜨는지, 버스는 언제 오는지 — 우도 여행에 필요한 것을 모은 앱이에요.',
  },
  '/archive': {
    title: '우도 기록 — 아카이브',
    description: '사라지기 전에 남겨 두는 우도의 기록. 사람과 작품, 역사와 목소리를 모아요.',
  },
  '/archive/artists': {
    title: '우도를 기록한 사람들',
    description: '우도를 사진과 그림으로 남긴 사람들을 소개해요.',
  },
  '/archive/works': {
    title: '우도 작품 — 아카이브',
    description: '우도를 담은 사진과 그림을 모았어요.',
  },
  '/archive/collections': {
    title: '우도 컬렉션 — 아카이브',
    description: '주제별로 묶은 우도의 기록이에요.',
  },
  '/archive/exhibitions': {
    title: '우도 전시 기록',
    description: '우도를 다룬 전시의 기록이에요.',
  },
  '/archive/library': {
    title: '우도 자료실',
    description: '우도를 다룬 책·문헌·자료 목록이에요.',
  },
  '/history': {
    title: '우도의 역사',
    description: '사람이 살기 시작한 때부터 지금까지, 우도가 지나온 시간이에요.',
  },
  '/voices': {
    title: '우도 사람들의 목소리',
    description: '우도에 살아온 사람들이 들려주는 이야기를 기록해요.',
  },
  '/sounds': {
    title: '우도의 소리',
    description: '파도와 바람, 섬에서 들리는 소리를 기록해요.',
  },
};

/** prerender·sitemap 이 도는 경로 목록. 여기 있는 것만 HTML 로 구워져요. */
export const seoPaths = Object.keys(seo);
