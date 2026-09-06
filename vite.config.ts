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
          map: ['maplibre-gl', 'pmtiles'],
        },
      },
    },
  },
  server: {
    proxy: {
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
