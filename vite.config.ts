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
