import { afterAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/server.ts'
import { closeDb } from '../src/db/index.ts'

// Phase 2 S1 계약 테스트: 글 생성/조회 + JSON Schema 검증(400).
afterAll(async () => {
  await closeDb()
})

describe('posts CRUD — S1 (생성/조회)', () => {
  it('POST /posts → 201, draft 생성(slug null)', async () => {
    const app = buildApp()
    const res = await app.inject({
      method: 'POST',
      url: '/posts',
      payload: { title: '테스트 글', content: '본문' },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.id).toBeGreaterThan(0)
    expect(body.status).toBe('draft')
    expect(body.slug).toBeNull() // 발행 전이라 slug 없음
    await app.close()
  })

  it('POST /posts 정의 밖 필드 → 400 (JSON Schema 검증)', async () => {
    const app = buildApp()
    const res = await app.inject({
      method: 'POST',
      url: '/posts',
      payload: { bogus: 1 },
    })
    expect(res.statusCode).toBe(400)
    await app.close()
  })

  it('GET /posts → 배열(draft 포함)', async () => {
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/posts' })
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.json())).toBe(true)
    await app.close()
  })

  it('GET /posts/:id → 생성 후 조회, 없는 id는 404', async () => {
    const app = buildApp()
    const created = await app.inject({
      method: 'POST',
      url: '/posts',
      payload: { title: '조회용' },
    })
    const id = created.json().id
    const ok = await app.inject({ method: 'GET', url: `/posts/${id}` })
    expect(ok.statusCode).toBe(200)
    expect(ok.json().title).toBe('조회용')

    const missing = await app.inject({ method: 'GET', url: '/posts/999999' })
    expect(missing.statusCode).toBe(404)
    await app.close()
  })
})
