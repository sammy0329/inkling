import { afterAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/server.ts'
import { closeDb } from '../src/db/index.ts'
import { auth, registerAndToken } from './helpers.ts'

// Phase 5 S1: AI 초안 생성(mock).
afterAll(async () => {
  await closeDb()
})

describe('AI 초안 생성 — P5-S1', () => {
  it('POST /posts/generate → 초안 필드(title/content/tags)', async () => {
    const app = buildApp()
    const h = auth(await registerAndToken(app))
    const res = await app.inject({
      method: 'POST',
      url: '/posts/generate',
      headers: h,
      payload: { notes: 'Fastify 라우팅\n스키마 검증이 좋다' },
    })
    expect(res.statusCode).toBe(200)
    const b = res.json()
    expect(b.title).toBeTruthy()
    expect(b.content).toContain('#') // 마크다운 제목
    expect(b.content).toContain('Fastify 라우팅') // 메모 반영
    expect(Array.isArray(b.tags)).toBe(true)
    await app.close()
  })

  it('인증 없이 → 401', async () => {
    const app = buildApp()
    const res = await app.inject({ method: 'POST', url: '/posts/generate', payload: { notes: 'x' } })
    expect(res.statusCode).toBe(401)
    await app.close()
  })

  it('notes 없음 → 400', async () => {
    const app = buildApp()
    const h = auth(await registerAndToken(app))
    const res = await app.inject({ method: 'POST', url: '/posts/generate', headers: h, payload: {} })
    expect(res.statusCode).toBe(400)
    await app.close()
  })
})
