// Fastify 앱. buildApp()은 테스트에서도 재사용한다(포트 없이 inject).
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { fileURLToPath } from 'node:url'
import { healthRoutes } from './routes/health.ts'
import { blogRoutes } from './routes/blog.ts'

export function buildApp() {
  const app = Fastify({ logger: false })
  app.register(cors) // 프론트(다른 origin)에서 fetch 허용 — 계층 분리(ADR-0003)
  app.register(healthRoutes)
  app.register(blogRoutes)
  return app
}

async function start() {
  const app = buildApp()
  try {
    const port = Number(process.env.PORT ?? 3000)
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`inkling backend listening on :${port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

// 이 파일을 직접 실행할 때만 서버 기동(테스트가 import할 땐 기동 안 함).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  void start()
}
