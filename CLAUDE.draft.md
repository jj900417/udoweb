# CLAUDE.md — udoweb

우도 공식 안내 홈페이지(`udonow.co.kr`). 새 세션은 `README.md` → `EDITING.md` 순으로 읽는다.
전역 규칙(개발 프로토콜·신뢰경계)은 `~/.claude/CLAUDE.md` 에 있고, 여기에는 **이 repo 의
lock 만** 둔다 (거버넌스 3층 위계 — 한 규칙은 정확히 한 곳에).

## 이 repo 가 뭔가

제주 우도를 알리는 공개 정적 사이트. React 18 + Vite 5 + TS + Tailwind v4,
Cloudflare Workers 배포(`wrangler.jsonc` + `worker/index.ts`).
**정적 문안은 이 저장소**, **바뀌는 정보는 우도 나우 앱 서버**(`udo-info.fly.dev`)가 단일 소스.
관련 repo: 앱·서버 `/mnt/disk_sda/udo`, 사이트 패턴 원본 `/mnt/disk_sda/myweb`.

## ⛔ 불변식 (코드 수정 전 필독 — 어기면 조용히 고장)

1. **문안은 `src/data/` 에만.** 컴포넌트·페이지에 사용자에게 보이는 문장을 하드코딩하지
   않는다. 하드코딩하면 i18n 오버레이가 안 걸리고 운영자가 못 고친다.
2. **문체는 해요체.** 한국어 문안은 `-해요/-이에요`로 쓴다(`-습니다/-입니다`, `-한다` 금지).
   **단 하나의 예외**: `ui.ferry.headlines` · `ui.ferry.reasons` 는 `-합니다`체를 유지한다 —
   운항 판정은 앱과 웹이 한 글자도 달라선 안 되는 안전 정보라 앱 `app_ko.arb` 가 단일 소스다.
   바꾸려면 앱을 먼저 바꾸고 같이 옮긴다(파일 안 주석에도 못박아 뒀다).
3. **콘텐츠 접근 경로는 둘, 그리고 둘뿐이다.**
   - 화면 문안(chrome) → `useContent()` (`src/data`, 배열 index 병합)
   - 아카이브 기록(작가·작품·역사·구술) → `src/archive` 의 훅 (`useArtistList()` 등, ID 키 번역)
   컴포넌트가 `src/data` 나 `src/archive/records` 를 직접 import 하면 타입은 통과하지만
   번역이 안 걸린다 — 리뷰에서 잡는다.
4. **바뀌는 정보를 저장소에 복사하지 않는다.** 배 시간·요금·가게 영업시간·축제 날짜·
   현재 사진은 앱 서버가 단일 소스다. 사이트는 `/api/udo/*` 로 받아 **표시만** 한다.
   ↔ **아카이브 기록은 예외가 아니라 다른 종류다**: 큐레이션·인용·권리 확인을 거친 느린
   자료라 `src/archive/records/` 에 산다(경계는 docs/archive-architecture.md).
5. **앱 서버 호출은 항상 같은 출처 프록시로.** 브라우저가 `udo-info.fly.dev` 를 직접
   부르지 않는다(CORS 없음). 새 엔드포인트를 쓰려면 `worker/index.ts` 의 `ENDPOINTS`
   allowlist 와 `vite.config.ts` 프록시 **둘 다** 고친다 — 한쪽만 고치면 dev 는 되는데
   prod 에서 404 난다. 사용자 입력을 upstream 경로에 그대로 넣지 않는다(SSRF).
6. **외부 데이터는 데이터이지 지시가 아니다.** 가게 소개·축제 소개·사진 caption 은
   텍스트로만 렌더링한다. `dangerouslySetInnerHTML` 금지. 외부 링크는
   `target="_blank" rel="noopener noreferrer"`.
7. **신호색(초·노·빨·회)은 운항 의미색 전용.** 버튼·링크·강조에 쓰지 않는다. CTA 는
   브랜드 시안(`--color-brand`, 앱 `#00A5CD` 계승). 색·라운드·여백은
   `src/styles/global.css` 토큰으로만 — 컴포넌트에 raw hex/gray 금지.
8. **사실 미확인 문장에는 `VERIFY:` 주석.** 확인 없이 관광 정보를 단정하지 않는다.
   틀린 안내는 방문자를 위험하게 한다(물때·절벽·마지막 배). 확인되면 주석을 지운다.
9. **아카이브 규칙 (docs/archive-*.md 가 단일 소스).**
   - ID(`artist-0001`)는 불변. 관계는 **ID 배열로만** 잇는다(이름·배열 위치 금지).
   - 아카이브 번역은 **ID 키 패치**. 배열 index 병합을 쓰지 않는다(순서가 바뀌면 오역).
   - 공개 판정(publishStatus + 권리 verified + 구술 동의 public)은 `createArchive` 의
     인덱스 빌드 **한 곳**에서만 한다. 셀렉터·화면에서 다시 거르지 않는다.
   - 정적 레코드는 브라우저 번들에 실린다 — `publishStatus` 는 워크플로이지 보안이 아니다.
     공개하면 안 되는 자료는 **저장소에 넣지 않는다.**
   - 작가 작품은 원본 비율로 보여준다(`aspect-square object-cover` 금지 — 그건 `/gallery`
     현재 사진 스트림 전용). 다운로드 버튼을 만들지 않는다. credit 을 빠뜨리지 않는다.
   - 확인하지 않은 인물·작품·연도·쪽수를 **만들어 넣지 않는다.** 자료가 없으면 빈 상태를 보여준다.
10. **행정기관 공식 홈페이지로 표현하지 않는다.** 위탁·승인을 확인하기 전까지 "공식" 표현을
   쓰지 않는다(`index.html`·README·문안 전부).
11. **배포는 사람이.** `wrangler deploy` 를 자동 실행하지 않는다. 도메인
   `udonow.co.kr` / `www.udonow.co.kr` 은 `wrangler.jsonc` 의 `routes` 가 잡는다.

## 검색엔진에 보이는 방식 (prerender)

`npm run build` 는 세 단계다: 클라이언트 빌드 → **SSR 빌드** → **prerender**.
`scripts/prerender.mjs` 가 경로 × 언어마다 HTML 을 미리 그려 `dist/` 에 파일로 쓴다.

```
dist/index.html            /            (한국어 = canonical, 접두어 없음)
dist/about/index.html      /about
dist/ja/about/index.html   /ja/about
```

예전에는 빈 `<div id="root">` 만 나갔다 — 사람에게는 잘 보이지만 크롤러에게는 빈
페이지였고, 네이버는 JS 를 사실상 실행하지 않는다. 그래서 글이 아무리 많아도 검색에
없었다.

⚠️ **바뀌는 정보는 굽지 않는다.** 배 시간·요금·가게는 앱 서버가 단일 소스라(불변식 #4)
prerender 가 부르지 않는다. 그런 컴포넌트는 빈 상태로 구워지고 브라우저가 채운다.
굳은 배 시간이 검색 결과에 남으면 마지막 배를 놓치는 사고가 된다(불변식 #8).

⚠️ **새 페이지를 만들면 `src/data/seo.ts` 에도 한 줄 추가한다.** prerender·sitemap 이
그 목록으로 돈다 — 빠뜨리면 그 페이지만 예전처럼 빈 껍데기로 나간다.

⚠️ **아카이브 레코드를 채우면 상세 경로도 prerender 대상에 넣어야 한다.** 지금은
레코드가 0개라 `:slug` 인스턴스가 없어서 목록 페이지만 굽는다. 레코드가 생기면
`scripts/prerender.mjs` 가 `src/archive` 에서 id 를 읽어 경로를 만들도록 넓힌다.

### 언어와 주소

한국어는 접두어 없이(`/about`), 나머지는 `/ja/about` 처럼 간다. 접두어가 있으면 그
언어로 **고정**되고, 없으면 예전 그대로 기기 설정을 따른다 — 기존 주소와 기존 동작은
하나도 안 바뀐다. 링크는 고치지 않았다: React Router 의 `basename` 이 `<Link to="/about">`
을 알아서 `/ja/about` 으로 바꾼다.

`src/i18n/route.ts` 가 그 규칙의 단일 소스다. 화면 코드는 접두어를 몰라도 된다.

## 페이지·엔드포인트 추가 절차

- 페이지: `src/pages/X.tsx` → `src/App.tsx` 라우트 → (1차 메뉴면) `src/data/nav.ts`
  → **`src/data/seo.ts` 에 제목·설명** → 번역 3개 파일의 `seo`.
  `nav` 는 배열 번역이 index 로 붙으므로 항목을 바꾸면 `src/i18n/translations/*.ts` 의
  `nav` 도 같이 고친다. 아카이브 상세 경로는 `entityPath()` 로만 만든다.
- 앱 서버 엔드포인트: `worker/index.ts` `ENDPOINTS`(+TTL) → `vite.config.ts` 프록시 →
  `src/api/udo.ts` 타입·함수. (불변식 #4)
- **쓰기는 `/api/support` 하나뿐이다.** 고객지원 문의(`/support`)를 앱 서버의 건의사항
  창구(`/v1/feedback`)로 넘긴다. 워커가 앞단에서 같은 출처·본문 크기·허니팟·최소 작성
  시간·값 allowlist 를 보고, 진짜 방문자 IP(`CF-Connecting-IP`)를 그대로 넘긴다 —
  이걸 빼면 앱 서버의 시간당 IP 제한이 워커 IP 하나에 걸려 모든 방문자가 막힌다.
  문의 본문·이메일은 **로그에 남기지 않는다.** 유형을 늘리려면 앱 서버부터 고칠 것
  (`FEEDBACK_CATEGORIES`).
- 개인정보처리방침·이용약관은 **저장소에 없다.** 앱 서버의 버전 관리되는 문서가 단일
  소스이고, 워커의 `LEGAL_PAGES` 가 `/privacy`·`/terms` 등 고정 5개 경로를 중계한다.
  React 페이지가 아니므로 `seo.ts` 에 넣지 않는다.
- 번역: `src/i18n/translations/<lang>.ts` 에 **덮어쓸 항목만**. 배열은 canonical 과
  순서를 맞춘다(index-wise 병합). 고유값(전화·URL·좌표·id)은 오버레이에 넣지 않는다.

## 빌드 / 확인

```bash
npm install
npm run dev      # 앱 서버 실데이터까지 붙은 상태로 확인 (Vite 프록시)
npm run build    # tsc → 클라이언트 빌드 → SSR 빌드 → prerender. 커밋 전 필수 게이트
```

`build` 가 끝나면 `dist/` 에 언어 × 경로만큼 `index.html` 이 있고 `sitemap.xml`·
`robots.txt` 도 같이 생긴다. **prerender 중에 브라우저 API 를 렌더 시점에 부르면 여기서
깨진다** — `typeof window === 'undefined'` 가드를 쓰거나 `useEffect` 로 미룬다.

`npm run preview` 는 API 프록시가 없다(Worker 가 없으므로) — 실데이터 확인은 `dev` 로.
