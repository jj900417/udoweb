import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/*
 * Dev proxy: the site calls the Udo Now app server through the same-origin
 * path /api/udo/* (in production the Cloudflare Worker does this — see
 * worker/index.ts). In dev, Vite proxies it so the browser never hits CORS.
 */
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        /*
         * 지도 엔진은 크고(≈250KB gz) 거의 바뀌지 않는다. 앱 코드와 분리해 두면
         * 사이트를 배포해도 지도 청크는 브라우저 캐시에 그대로 남는다.
         *
         * SSR 빌드에는 적용하지 않는다 — 거기서 maplibre-gl 은 external 이라
         * 청크로 묶을 대상이 아니고, 묶으려 하면 빌드가 실패한다.
         */
        manualChunks: isSsrBuild ? undefined : { map: ['maplibre-gl'] },
      },
    },
  },
  server: {
    proxy: {
      // /api/udo/* 전체를 넘긴다. 단, 프로덕션은 worker/index.ts 의 ENDPOINTS
      // allowlist 를 지나므로 새 엔드포인트를 쓸 때는 거기에도 추가해야 한다.
      '/api/udo': {
        target: 'https://udo-info.fly.dev',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/udo/, ''),
      },
      '/media': {
        target: 'https://udo-info.fly.dev',
        changeOrigin: true,
      },
      // 고객지원 문의. 프로덕션은 worker/index.ts 의 /api/support 가 허니팟·크기·값
      // 검증을 거친 뒤 같은 곳으로 넘긴다 — dev 는 앞단 방어 없이 바로 간다.
      '/api/support': {
        target: 'https://udo-info.fly.dev',
        changeOrigin: true,
        rewrite: () => '/v1/feedback',
      },
      // 방침·약관은 앱 서버 문서가 단일 소스다(프로덕션은 워커가 같은 일을 한다).
      '/privacy': { target: 'https://udo-info.fly.dev', changeOrigin: true },
      '/terms': { target: 'https://udo-info.fly.dev', changeOrigin: true },
      '/account-delete': { target: 'https://udo-info.fly.dev', changeOrigin: true },
      '/legal': { target: 'https://udo-info.fly.dev', changeOrigin: true },
    },
  },
}));
