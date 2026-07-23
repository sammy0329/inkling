import type { FastifyReply, FastifyRequest } from 'fastify'

// JWT 페이로드/디코드 타입 (app.jwt.sign, req.user에 반영됨)
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: number; email: string }
    user: { userId: number; email: string }
  }
}

// 보호 라우트용 preHandler — 유효한 JWT 없으면 401.
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch {
    reply.code(401).send({ message: 'unauthorized' })
  }
}
