import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 회사 프로젝트(5173/5174)와 충돌 회피용으로 5175 고정. (DB 5433·API 3001과 동일 방침)
  server: { port: 5175 },
})
