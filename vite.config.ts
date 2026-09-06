import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/*
 * Dev proxy: the site calls the Udo Now app server through the same-origin
 * path /api/udo/* (in production the Cloudflare Worker does this — see
 * worker/index.ts). In dev, Vite proxies it so the browser never hits CORS.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        /*
         * 지도 엔진은 크고(≈250KB gz) 거의 바뀌지 않는다. 앱 코드와 분리해 두면
         * 사이트를 배포해도 지도 청크는 브라우저 캐시에 그대로 남는다.
         */
        manualChunks: {
          map: ['maplibre-gl'],
        },
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
    },
  },
});
