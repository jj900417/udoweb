# 미디어 저장 전략 (사진·음성)

## 지금 (Phase 1)

- 아카이브 미디어는 **메타데이터만** 있고 실제 파일은 아직 없다(`MediaRef` 에는 URL 필드가
  없다 — `key` 만 있고 URL 은 `src/archive/media.ts` 의 `mediaUrl()` 이 만든다).
- 파일이 생기면 우선 `public/archive-media/` 아래에 두고 `/archive-media/<key>` 로 열린다.
- **우도 나우 사진의 `/media/*` 프록시와 섞지 않는다.** 그건 앱 서버 사진 전용 경로다.

## 앞으로 (Phase 2)

- 파생본(웹 배포용)은 Cloudflare R2 로 옮기고 Worker 에 `/archive-media/*` 브랜치를 만든다.
  그때 고칠 코드는 `mediaUrl()` 하나 + Worker 라우트다.
- 보존용 원본(Archive Master: WAV 48 kHz/24-bit, 원본 영상, 스캔 원본, 전사 전문)은
  **git 에 커밋하지 않는다.** 저장소는 코드와 메타데이터만 담는다.
- 웹 배포본: 이미지는 긴 변 1600px 내외 JPEG/WebP, 음성은 MP3 또는 AAC.

## 오디오를 Worker 로 프록시하게 되면

브라우저가 재생 중 **탐색(seek)** 을 하려면 부분 요청이 되어야 한다. 그대로 흘려보내면
전체 파일을 매번 받거나 탐색이 막힌다. 필요한 처리:

- 요청의 `Range` 헤더를 업스트림으로 그대로 전달
- 응답 `206 Partial Content` 와 `Content-Range` 를 보존
- `Accept-Ranges: bytes` 를 내려보내기
- 정확한 `Content-Type`(`audio/mpeg` 등)과 `Content-Length`
- 캐시: 파생본은 불변이므로 `immutable` 하게 길게

지금은 실제 저장소가 없으므로 **불완전한 프록시를 미리 넣지 않는다.** 위 요구사항만 남긴다.

## SEO / 링크 미리보기 한계

이 사이트는 SPA 라 `PageMeta` 가 title·description 을 바꿔도 **JS 를 실행하지 않는
크롤러**(카카오톡·페이스북 미리보기 등)는 `index.html` 의 기본값만 본다.
아카이브 상세 페이지가 공유되기 시작하면 다음 중 하나를 검토한다:

1. 빌드 시 주요 라우트 prerender (레코드가 정적일 때 가장 간단)
2. Worker 에서 크롤러 UA 에만 메타 태그를 주입
3. SSR 전환

지금은 자료가 없어 결정할 근거가 없다 — 레코드가 쌓인 뒤에 정한다.
