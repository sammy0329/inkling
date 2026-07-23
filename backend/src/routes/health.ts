import type { FastifyInstance } from 'fastify'

// GET /health — 서버가 살아있는지 확인용(스모크). 하네스에서 계약 확인에 씀.
export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }))
}
