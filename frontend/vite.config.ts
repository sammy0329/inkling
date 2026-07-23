import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 기본 포트(5173/5174) 점유 회피로 5175 고정. (DB 5433·API 3001과 동일 방침)
  server: { port: 5175 },
})
