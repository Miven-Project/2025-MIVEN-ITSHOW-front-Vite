import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/naver-api': {
        target: 'https://openapi.naver.com',  // 실제 백엔드 서버 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/naver-api/, ''),  // /naver-api 경로를 제거
      },
    },
  },
})
