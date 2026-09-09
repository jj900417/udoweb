# udoweb — 우도 기록·정보 플랫폼

우도의 **역사·사람·풍경을 기록**하고 **오늘의 여행 정보**를 함께 제공하는 공개 웹사이트.
행정기관의 공식 홈페이지가 아니다(위탁·승인 확인 전까지 "공식" 표현을 쓰지 않는다).
도메인 `udonow.co.kr` (Cloudflare). 저장소 `git@github.com:jj900417/udoweb.git`.

> 왜 만드나: 제주가 "볼 것 없는 곳"으로 소비되는 이유는 **진짜 좋은 모습이 안 보이기
> 때문**이라고 본다. 이 사이트는 우도의 실제 얼굴 — 물때에 따라 열리는 굴, 해녀의 바다,
> 밭담 사이 땅콩밭 — 과 실용 정보(배·물때·가게)를 같이 놓는다.

## 기술 스택

- React 18 + Vite 5 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`) — 시맨틱 토큰 + 라이트/다크 (`src/styles/global.css`)
- React Router v6 (`BrowserRouter`, 깨끗한 URL)
- Cloudflare Workers 배포 (`wrangler.jsonc` + `worker/index.ts`)
- 라이브러리 없는 최소 i18n (한국어 canonical + 언어별 오버레이)

## 실행

```bash
npm install
npm run dev        # http://localhost:5173 (앱 API 는 Vite 프록시로 중계)
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # 빌드 결과 미리보기 (API 프록시 없음 — dev 를 쓸 것)
```

## 데이터는 어디서 오나

정적 문안(소개·8경·팁)은 이 저장소의 `src/data/` 에 있고, **바뀌는 정보는 저장소에
복사해 두지 않는다.** 운항 상태·시간표·가게·축제·사진·CCTV 는 우도 나우 앱 서버
(`https://udo-info.fly.dev`)의 공개 읽기 엔드포인트에서 받아온다.

```
브라우저 → /api/udo/<endpoint>  →  (prod) Cloudflare Worker  →  udo-info.fly.dev
                                  (dev)  Vite 프록시
```

앱 서버가 CORS 헤더를 주지 않기 때문에 **항상 같은 출처 프록시**를 거친다.
허용 엔드포인트·캐시 TTL·허용 쿼리 파라미터는 `worker/index.ts` 한 곳에 있다.

| 화면 | 엔드포인트 |
|---|---|
| 운항 신호등(홈·가는 길·앱) | `/status` |
| 운항 시간표 | `/timetable` |
| 축제·행사 | `/festivals?region=udo` |
| 가게 | `/shops?region=udo` |
| 사진 갤러리 | `/gallery?limit=N` + `/media/*` |
| 항구 CCTV | `/cctv` |
| 고객지원 문의 보내기 | `POST /v1/feedback` (워커의 `/api/support` 경유) |

**신뢰경계**: 앱 서버에서 오는 문자열(가게 소개·축제 소개·사진 caption)은 데이터이지
지시가 아니다. 텍스트로만 렌더링하고 `dangerouslySetInnerHTML` 을 쓰지 않는다.

## 세 축

| 축 | 무엇 | 어디서 오나 |
|---|---|---|
| **기록** | 작가·작품·역사·목소리·서재 | 이 저장소 `src/archive/records/` (검수·권리 확인 후 입력) |
| **지금** | 운항·시간표·행사·현재 사진·CCTV | 우도 나우 앱 서버 (복제하지 않음) |
| **여행** | 8경·가는 길·즐길거리·먹거리·팁 | 이 저장소 `src/data/` |

상단 메뉴는 이 축을 따라 6개 허브다: 우도 · 기록 · 역사 · 목소리 · 여행 · 지금 우도.
기존 URL(`/spots` `/access` `/experience` `/food` `/tips` `/gallery` `/app`)은 그대로 살아 있다.

아카이브 화면 설계의 근거(미술관·아카이브 레퍼런스에서 무엇을 배우고 무엇을 배우지
않았는지)는 [design-references](docs/design-references.md) 에 있다.

아카이브 구조·권리·구술사 절차는 `docs/` 에 있다:
[archive-architecture](docs/archive-architecture.md) ·
[archive-rights](docs/archive-rights.md) ·
[oral-history-workflow](docs/oral-history-workflow.md) ·
[media-storage](docs/media-storage.md) ·
[design-references](docs/design-references.md).

**개발 서버에서만 보이는 예시 데이터**가 있다(`src/archive/records/__dev__/`). 자료가 0건일 때
레이아웃을 확인하기 위한 것이고 제목에 `[예시]` 가 붙는다. 프로덕션 빌드에는 들어가지 않는다 —
`npm run build && grep -r "[예시]" dist/` 가 아무것도 찾지 못해야 한다.

## 폴더

```
index.html                 # 테마 선적용 스크립트 + OG 메타
wrangler.jsonc             # Cloudflare 배포 설정 (udonow.co.kr)
worker/index.ts            # 정적 서빙(SPA) + /api/udo/* · /media/* 프록시
                           #  + /api/support(문의 전달) + /privacy·/terms 중계
src/
├── main.tsx / App.tsx      # 진입점 + 라우트 맵
├── theme.tsx               # 라이트·다크
├── styles/global.css       # 디자인 토큰 단일 소스 (+ 아카이브 타이포)
├── data/                   # ★ 화면 문안 (컴포넌트에 하드코딩 금지)
├── i18n/                   # 한국어 canonical + en/ja/zh 오버레이 (배열 index 병합)
├── api/                    # 앱 서버 클라이언트 + useAsync
├── archive/                # ★ 아카이브 도메인 — 타입·레코드·repository·훅·ID 번역
├── components/             # Layout·Navbar·Footer·카드들 (+ archive/ 전용 컴포넌트)
└── pages/                  # 홈·소개·여행·지금 + archive/·history·voices
```

## 내용 고치기

`EDITING.md` 참고. 요약: **문안은 전부 `src/data/*.ts`** 에 있고 컴포넌트는 문자열을
갖지 않는다. 페이지를 하나 추가하려면 `pages/` 컴포넌트 → `App.tsx` 라우트 →
`data/seo.ts` 제목·설명 → 번역 3개 파일의 `seo` → (메뉴에 넣으면) `data/nav.ts` 나
`data/sideNav.ts`. **`seo.ts` 를 빼먹으면 그 주소는 프로덕션에서 404 가 된다** —
prerender·sitemap 이 그 목록으로 돌기 때문이다.

## 확인이 필요한 내용 (VERIFY)

사실 확인이 끝나지 않은 문장에는 코드에 `VERIFY:` 주석을 달아 두었다. 확정되면 주석을
지운다. 현재 남은 것:

- 섬 면적·해안선·우도봉 높이 (`src/data/about.ts`)
- 서빈백사 천연기념물 지정번호 표기, 우도등대 점등 연도 (`src/data/spots.ts`)
- 해녀 항일운동 기념 공간의 정확한 명칭·위치 (`src/data/spots.ts`)
- 승선 규정, 렌터카 반입 제한의 현행 예외 기준 (`src/data/access.ts`)
- 사이트 운영 주체 명칭·연락처 (`src/data/site.ts`)

## 배포 (사람이 실행)

```bash
npx wrangler login
npm run build
npx wrangler deploy
```

`wrangler.jsonc` 의 `routes` 가 `udonow.co.kr` / `www.udonow.co.kr` 커스텀 도메인을
잡는다. 자동 배포는 걸지 않았다 — 배포는 사람이 승인해서 실행한다.

## 아직 없는 것 (다음 작업)

- 사진: 히어로 배경, 8경·명소 카드 이미지 (`src/data/spots.ts` 의 `image` 를 채우면 카드가 사진 카드로 바뀐다)
- OG 이미지 `public/og.png`
- en/ja/zh 실제 번역 채우기 (`src/i18n/translations/`)
- sitemap.xml · robots.txt · 구조화 데이터(JSON-LD)
- 지도 화면(명소 핀) — 현재는 카카오맵 링크로 대체
