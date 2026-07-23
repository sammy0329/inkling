import type { FastifyInstance } from 'fastify'

// 유니크 이메일로 회원가입하고 JWT를 반환.
export async function registerAndToken(app: FastifyInstance): Promise<string> {
  const email = `u_${Math.random().toString(36).slice(2)}@test.com`
  const res = await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: { email, password: 'secret123' },
  })
  return res.json().token as string
}

// Authorization 헤더
export function auth(token: string) {
  return { authorization: `Bearer ${token}` }
}
