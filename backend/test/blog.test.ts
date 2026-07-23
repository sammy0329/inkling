import { afterAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/server.ts'
import { closeDb } from '../src/db/index.ts'

// 계약 테스트: GET /blog가 published만 노출하고 draft를 흘리지 않는지.
// seed 데이터(published 3, draft 1)에 의존한다.
afterAll(async () => {
  await closeDb()
})

describe('GET /blog', () => {
  it('published 글만 반환하고 draft는 노출하지 않는다', async () => {
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/blog' })

    expect(res.statusCode).toBe(200)
    const body = res.json() as Array<{ slug: string; publishedAt: string | null }>
    const slugs = body.map((p) => p.slug)
    // 개수에 의존하지 않고(다른 테스트가 글을 추가할 수 있음) 슬러그 기준으로 검증
    expect(slugs).toContain('fastify-minimal-rest-api') // seed된 published 포함
    expect(slugs).not.toContain('wip-draft-post') // draft는 제외
    expect(body.every((p) => p.publishedAt !== null)).toBe(true) // 전부 발행 시각 존재

    await app.close()
  })
})
