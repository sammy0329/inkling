// Fastify 앱. buildApp()은 테스트에서도 재사용한다(포트 없이 inject).
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { fileURLToPath } from 'node:url'
import { healthRoutes } from './routes/health.ts'
import { blogRoutes } from './routes/blog.ts'
import { postsRoutes } from './routes/posts.ts'
import { authRoutes } from './routes/auth.ts'
import { generateRoutes } from './routes/generate.ts'

export function buildApp() {
  // removeAdditional:false → 정의 밖 필드를 제거하지 않고 400으로 거부(엄격한 계약).
  const app = Fastify({
    logger: false,
    ajv: { customOptions: { removeAdditional: false } },
  })
  app.register(cors) // 프론트(다른 origin)에서 fetch 허용 — 계층 분리(ADR-0003)
  app.register(jwt, { secret: process.env.JWT_SECRET ?? 'dev-secret-change-me' })
  app.register(healthRoutes)
  app.register(blogRoutes)
  app.register(authRoutes)
  app.register(postsRoutes)
  app.register(generateRoutes)
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
