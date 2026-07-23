// drizzle-kit(db:push, 마이그레이션 도구)의 설정.
// db:push는 여기의 schema를 읽어 DATABASE_URL의 DB에 테이블을 반영한다.
import { defineConfig } from 'drizzle-kit'

try {
  process.loadEnvFile()
} catch {
  /* .env 없음 */
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle', // 마이그레이션 SQL 산출 위치(push만 쓰면 거의 안 씀)
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
