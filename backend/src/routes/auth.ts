import type { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { users } from '../db/schema.ts'
import { hashPassword, verifyPassword } from '../lib/password.ts'
import { loginBody, registerBody, tokenResponse } from '../schemas/auth.ts'
import { errorResponse } from '../schemas/post.ts'

export async function authRoutes(app: FastifyInstance) {
  // 회원가입 → JWT
  app.post(
    '/auth/register',
    { schema: { body: registerBody, response: { 201: tokenResponse, 409: errorResponse } } },
    async (req, reply) => {
      const { email, password } = req.body as { email: string; password: string }
      const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
      if (existing) return reply.code(409).send({ message: 'email already registered' })

      const [user] = await db
        .insert(users)
        .values({ email, passwordHash: hashPassword(password) })
        .returning()
      reply.code(201)
      return { token: app.jwt.sign({ userId: user.id, email: user.email }) }
    },
  )

  // 로그인 → JWT
  app.post(
    '/auth/login',
    { schema: { body: loginBody, response: { 200: tokenResponse, 401: errorResponse } } },
    async (req, reply) => {
      const { email, password } = req.body as { email: string; password: string }
      const [user] = await db.select().from(users).where(eq(users.email, email))
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return reply.code(401).send({ message: 'invalid credentials' })
      }
      return { token: app.jwt.sign({ userId: user.id, email: user.email }) }
    },
  )
}
