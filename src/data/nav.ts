/* 상단 내비게이션. 순서 = 표시 순서. path 는 App.tsx 라우트와 1:1. */
export const nav = [
  { path: '/', label: '홈' },
  { path: '/about', label: '우도 소개' },
  { path: '/spots', label: '우도8경·명소' },
  { path: '/access', label: '가는 길' },
  { path: '/experience', label: '즐길거리' },
  { path: '/food', label: '먹거리·가게' },
  { path: '/gallery', label: '사진' },
  { path: '/tips', label: '여행 팁' },
  { path: '/app', label: '우도 나우 앱' },
] as const;
