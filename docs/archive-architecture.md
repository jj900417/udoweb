# UDO Archive — 구조

이 문서는 **왜 이렇게 나눠 놨는지**를 적는다. 화면을 늘리기 전에 한 번 읽으면
나중에 자료가 수천 건이 되어도 구조를 다시 뜯을 일이 줄어든다.

## 두 종류의 데이터

| 종류 | 예 | 단일 소스 | 갱신 주기 |
|---|---|---|---|
| **운영 데이터** | 운항 상태·시간표·가게 영업시간·축제 날짜·현재 사진·CCTV | 우도 나우 앱 서버 (`/api/udo/*` 프록시) | 분·시간 단위 |
| **아카이브 레코드** | 작가·작품·역사·구술·출처·서지 | 이 저장소 `src/archive/records/` (Phase 2 에 Archive API) | 사람이 확인한 뒤에만 |

둘을 섞지 않는다. "바뀌는 정보를 저장소에 복제하지 않는다"는 규칙은 **운영 데이터**에
대한 것이고, 아카이브 레코드는 큐레이션·인용·권리 확인을 거친 느린 자료라 저장소에 산다.

## 계층

```
records/ (또는 Phase 2: Archive API)
   ↓                       ← 여기서만 데이터가 들어온다
repository.ts  createArchive(dataset, translation, visibility)
   ↓                       ← 공개/권리/동의 판정 · 인덱스 · 관계 · 정렬
hooks.ts       useArtistList() … → { data, loading, error }
   ↓                       ← 화면이 보는 유일한 모양
pages / components
```

- **페이지는 records/ 를 직접 import 하지 않는다.** `src/archive` 배럴의 훅만 쓴다.
- 훅은 지금 동기지만 반환 모양이 `AsyncState<T>` 라, Phase 2 에서 `hooks.ts` 본문만
  `useAsync(...)` 로 바꾸면 **페이지는 한 줄도 안 바뀐다.**

## 공개 판정은 한 곳에서만

`createArchive` 가 인덱스를 만들 때 아래를 통과하지 못한 레코드는 `byId` 맵에
**들어가지 않는다.** 그래서 어떤 셀렉터·관계 해석기도 비공개 자료를 흘릴 수 없다.

1. `publishStatus === 'published'`
2. `rights.webDisplayAllowed && rights.rightsStatus === 'verified'` (기간이 있으면 유효)
3. 구술 자료는 `consent.obtained && consent.scope === 'public'`
   (클립은 세션·인물의 동의를 따른다 — 가장 엄격한 쪽)

> ⚠ 정적 레코드는 **번들에 실려 브라우저로 간다.** `publishStatus` 는 편집 워크플로이지
> 보안장치가 아니다. 진짜로 공개하면 안 되는 자료(동의 범위가 public 이 아닌 구술 포함)는
> Phase 2 의 서버측 필터가 생길 때까지 **저장소에 넣지 않는다.**

## ID 와 관계

- ID 는 `artist-0001` 처럼 종류 접두사를 갖고 **절대 바뀌지 않는다.** 제목·slug 는 바뀐다.
- 관계는 ID 배열로만. 이름·배열 위치로 잇지 않는다.
- 관계는 **한 방향만** 선언한다(작품이 작가를 가리킨다). 역방향은 repository 가 만든다.
- 없는 ID·비공개 ID 를 가리키면 조용히 빠지고, 결과가 비면 섹션 자체가 사라진다.
  개발 모드에서는 `integrity.ts` 가 콘솔에 경고한다(오타 vs 비공개를 구분해서).

## 번역

| 대상 | 위치 | 방식 |
|---|---|---|
| 화면 문안(섹션 제목·라벨·빈 상태) | `src/data/archive.ts` → `useContent()` | 기존 index 병합 (객체만 쓰므로 안전) |
| 레코드 텍스트(제목·본문·credit·전사) | `src/archive/i18n/<lang>.ts` | **ID 키 패치**, 값 통째 교체 |

레코드 번역에 index 병합을 쓰지 않는 이유: 레코드는 계속 추가되고 순서가 바뀐다.
index 로 붙이면 어느 날 조용히 다른 사람의 설명이 붙는다.

## Phase 2 로 가는 길

```
Master Console / Archive CMS   (입력·검수·권리 관리 — 아직 없음)
        ↓
Archive API / DB               (published 만 내보낸다)
        ↓
UdoWeb (이 저장소)             createArchive 에 먹이는 dataset 만 교체
```

그때 필요한 작업은: `worker/index.ts` 의 `ENDPOINTS` 에 아카이브 엔드포인트 추가
(+`vite.config.ts` 프록시 — **둘 다** 고쳐야 한다), `hooks.ts` 를 비동기로,
`records/` 를 시드로 강등. 페이지·컴포넌트는 그대로다.
