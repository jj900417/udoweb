# 내용 고치는 법

코드를 몰라도 고칠 수 있는 부분만 정리한다.

고치려는 것이 **화면 문안**인지 **아카이브 기록**인지 먼저 구분한다 — 사는 곳이 다르다.

| 고치려는 것 | 어디 |
|---|---|
| 홈·소개·여행 문안, 버튼·라벨, 섹션 제목 | `src/data/*.ts` |
| 작가·작품·컬렉션·기획전 | `src/archive/records/{artists,works,collections,exhibitions}.ts` |
| 역사 기록 | `src/archive/records/history.ts` |
| 목소리(인물·인터뷰·클립) | `src/archive/records/voices.ts` |
| 출처(인용) | `src/archive/records/sources.ts` |
| 서재(책·향토지·논문) | `src/archive/records/library.ts` |
| 사진·음성 메타데이터 | `src/archive/records/media.ts` |

배 시간·가게 영업시간·축제 날짜·현재 사진은 **어느 쪽도 아니다** — 우도 나우 앱에서 고친다.

## 화면 문안 (`src/data/`)

| 파일 | 무엇을 고치나 |
|---|---|
| `src/data/site.ts` | 사이트 이름·도메인·운영 주체·연락처·외부 링크·앱 링크 |
| `src/data/nav.ts` | 상단 메뉴 이름과 순서 |
| `src/data/home.ts` | 홈 히어로 문구, 각 섹션 제목·설명 |
| `src/data/about.ts` | 우도 소개 글, 숫자 카드, 키워드 4개 |
| `src/data/spots.ts` | 우도8경 8개, 주요 명소 목록(좌표 포함) |
| `src/data/access.ts` | 가는 길 4단계, 차량 반입 안내, 이동 수단, 안전 문구 |
| `src/data/experiences.ts` | 즐길거리 카드, 섬에서 지킬 것 |
| `src/data/food.ts` | 먹거리 카드, 가게 섹션 안내문 |
| `src/data/tips.ts` | 자주 묻는 질문, 떠나기 전 체크리스트 |
| `src/data/ui.ts` | 버튼·상태 라벨 (예: "전화하기", "불러오는 중…") |
| `src/data/archive.ts` | 기록·역사·목소리 화면의 제목·라벨·빈 상태 문구 |
| `src/data/hubs.ts` | '여행'·'지금 우도' 허브 페이지 문안 |

## 규칙

1. **컴포넌트(`src/components`, `src/pages`)에 문장을 직접 쓰지 않는다.** 바꿀 문장이
   화면에 하드코딩돼 있으면 그걸 `src/data/` 로 옮기는 것이 먼저다.
2. **자주 바뀌는 정보(배 시간·가게 영업시간·축제 날짜)는 여기 적지 않는다.**
   그건 우도 나우 앱(관리자 화면)에서 고치면 이 사이트에 자동 반영된다.
3. `VERIFY:` 주석이 달린 문장은 아직 사실 확인이 안 된 것이다. 확인했으면 주석을 지운다.
4. 번역은 `src/i18n/translations/<언어>.ts` 에 **덮어쓸 항목만** 적는다. 배열은
   한국어 원본과 **순서가 같아야** 하고, 안 적은 항목은 한국어로 남는다.

## 사진 넣기

- 8경·명소 카드: `src/data/spots.ts` 의 항목에 `image: '/images/xxx.jpg'` 를 추가하고
  파일을 `public/images/` 에 둔다.
- 갤러리 사진은 여기 두지 않는다 — 우도 나우 앱으로 올리면 검수 후 자동으로 뜬다.

## 고친 뒤 확인

```bash
npm run dev      # 브라우저에서 확인
npm run build    # 타입 오류 없이 빌드되는지 확인 (배포 전 필수)
```

## 아카이브 기록 (`src/archive/records/`) — 다루는 법이 다르다

여기는 문안이 아니라 **자료**다. 아래 규칙을 지키지 않으면 관계가 조용히 끊긴다.

1. **`id` 는 한 번 정하면 절대 바꾸지 않는다.** 제목·slug 는 바꿔도 되지만 id 는 고정이다.
   다른 기록이 이 id 로 이 기록을 가리키고 있다.
2. **순서를 바꾸거나 번호를 다시 매기지 않는다.** 목록의 순서는 화면 정렬과 무관하다
   (repository 가 날짜·제목으로 정렬한다).
3. **관계는 id 로만.** `artistIds: ['artist-0001']` 처럼. 이름으로 잇지 않는다.
4. **확인하지 않은 것을 적지 않는다.** 연도가 불확실하면 `precision: 'decade'`·`'approximate'`,
   모르면 `'unknown'` 으로 둔다. 확인 안 한 책 쪽수를 쓰지 않는다.
5. **권리·동의가 확인되지 않은 자료는 넣지 않는다.** `rightsStatus` 가 `verified` 가 아니면
   화면에 나오지도 않는다(`docs/archive-rights.md`, `docs/oral-history-workflow.md`).
6. 개발 서버(`npm run dev`)를 띄우면 콘솔에 **무결성 경고**가 뜬다 — 중복 id, 끊긴 참조,
   없는 미디어, 동의 위반, 사라진 기록의 번역이 남아 있는 경우 등. 경고가 있으면 고친다.

## 번역

- 화면 문안: `src/i18n/translations/<언어>.ts` — 한국어와 **순서를 맞춘 배열**.
- 아카이브 기록: `src/archive/i18n/<언어>.ts` — **id 를 키로** 적는다(순서 무관).
  ```ts
  entries: { 'artist-0001': { title: 'Kim …', body: ['…'] } }
  ```
  구술 원문(제주어)은 원자료이므로 번역으로 덮지 않는다.
