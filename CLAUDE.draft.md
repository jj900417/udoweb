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

## 페이지·엔드포인트 추가 절차

- 페이지: `src/pages/X.tsx` → `src/App.tsx` 라우트 → (1차 메뉴면) `src/data/nav.ts`.
  `nav` 는 배열 번역이 index 로 붙으므로 항목을 바꾸면 `src/i18n/translations/*.ts` 의
  `nav` 도 같이 고친다. 아카이브 상세 경로는 `entityPath()` 로만 만든다.
- 앱 서버 엔드포인트: `worker/index.ts` `ENDPOINTS`(+TTL) → `vite.config.ts` 프록시 →
  `src/api/udo.ts` 타입·함수. (불변식 #4)
- 번역: `src/i18n/translations/<lang>.ts` 에 **덮어쓸 항목만**. 배열은 canonical 과
  순서를 맞춘다(index-wise 병합). 고유값(전화·URL·좌표·id)은 오버레이에 넣지 않는다.

## 빌드 / 확인

```bash
npm install
npm run dev      # 앱 서버 실데이터까지 붙은 상태로 확인 (Vite 프록시)
npm run build    # tsc --noEmit && vite build — 커밋 전 필수 게이트
```

`npm run preview` 는 API 프록시가 없다(Worker 가 없으므로) — 실데이터 확인은 `dev` 로.
