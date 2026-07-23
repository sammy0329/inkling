// DB 연결 지점. 앱 어디서든 `import { db } from './db/index.ts'`로 같은 연결을 쓴다.
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.ts'

// .env 로드(Node 24 내장). 파일 없으면 실제 환경변수를 그대로 사용.
try {
  process.loadEnvFile()
} catch {
  /* .env 없음 — CI 등에서는 주입된 환경변수 사용 */
}

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL이 설정되지 않았습니다. backend/.env를 확인하세요.')

// postgres 드라이버 커넥션. drizzle이 이 위에서 타입세이프 쿼리를 제공.
const client = postgres(url)
export const db = drizzle(client, { schema })

// 커넥션 종료(테스트 종료 시 열린 핸들 정리용).
export const closeDb = () => client.end({ timeout: 5 })
