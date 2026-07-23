import { afterAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/server.ts'
import { closeDb } from '../src/db/index.ts'

// Phase 4 S1: 회원가입/로그인/JWT.
afterAll(async () => {
  await closeDb()
})

function email() {
  return `u_${Math.random().toString(36).slice(2)}@test.com`
}

describe('auth — P4-S1', () => {
  it('register → 201 + JWT, 중복 이메일 → 409', async () => {
    const app = buildApp()
    const e = email()
    const r1 = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: e, password: 'secret123' },
    })
    expect(r1.statusCode).toBe(201)
    expect(r1.json().token.split('.')).toHaveLength(3) // JWT = header.payload.sig

    const r2 = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: e, password: 'secret123' },
    })
    expect(r2.statusCode).toBe(409)
    await app.close()
  })

  it('login 성공(200+token) / 틀린 비번·없는 유저(401)', async () => {
    const app = buildApp()
    const e = email()
    await app.inject({ method: 'POST', url: '/auth/register', payload: { email: e, password: 'secret123' } })

    const ok = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: e, password: 'secret123' } })
    expect(ok.statusCode).toBe(200)
    expect(ok.json().token).toBeTruthy()

    const wrong = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: e, password: 'wrongpass' } })
    expect(wrong.statusCode).toBe(401)

    const noUser = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: email(), password: 'secret123' } })
    expect(noUser.statusCode).toBe(401)
    await app.close()
  })

  it('약한 비번/잘못된 이메일 → 400', async () => {
    const app = buildApp()
    const short = await app.inject({ method: 'POST', url: '/auth/register', payload: { email: email(), password: '123' } })
    expect(short.statusCode).toBe(400)
    const badEmail = await app.inject({ method: 'POST', url: '/auth/register', payload: { email: 'notanemail', password: 'secret123' } })
    expect(badEmail.statusCode).toBe(400)
    await app.close()
  })
})
