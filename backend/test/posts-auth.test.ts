import { afterAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/server.ts'
import { closeDb } from '../src/db/index.ts'
import { auth, registerAndToken } from './helpers.ts'

// Phase 4 S2: 라우트 보호 + 소유권.
afterAll(async () => {
  await closeDb()
})

describe('auth 보호 + 소유권 — P4-S2', () => {
  it('인증 없이 /posts 접근 → 401', async () => {
    const app = buildApp()
    expect((await app.inject({ method: 'GET', url: '/posts' })).statusCode).toBe(401)
    expect(
      (await app.inject({ method: 'POST', url: '/posts', payload: { title: 'x' } })).statusCode,
    ).toBe(401)
    await app.close()
  })

  it('GET /posts는 본인 글만 반환', async () => {
    const app = buildApp()
    const hA = auth(await registerAndToken(app))
    const hB = auth(await registerAndToken(app))

    await app.inject({ method: 'POST', url: '/posts', headers: hA, payload: { title: 'A의 글' } })

    const listB = (await app.inject({ method: 'GET', url: '/posts', headers: hB })).json() as Array<{
      title: string
    }>
    expect(listB.every((p) => p.title !== 'A의 글')).toBe(true)

    const listA = (await app.inject({ method: 'GET', url: '/posts', headers: hA })).json() as Array<{
      title: string
    }>
    expect(listA.some((p) => p.title === 'A의 글')).toBe(true)
    await app.close()
  })

  it('타인 글은 수정/삭제 불가(404)', async () => {
    const app = buildApp()
    const hA = auth(await registerAndToken(app))
    const hB = auth(await registerAndToken(app))
    const a = (
      await app.inject({ method: 'POST', url: '/posts', headers: hA, payload: { title: 'A글' } })
    ).json()
    const patchByB = await app.inject({
      method: 'PATCH',
      url: `/posts/${a.id}`,
      headers: hB,
      payload: { title: '침범' },
    })
    expect(patchByB.statusCode).toBe(404)
    await app.close()
  })

  it('공개 /blog는 인증 없이 200', async () => {
    const app = buildApp()
    expect((await app.inject({ method: 'GET', url: '/blog' })).statusCode).toBe(200)
    await app.close()
  })
})
