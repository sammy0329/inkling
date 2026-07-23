import { afterAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/server.ts'
import { closeDb } from '../src/db/index.ts'
import type { FastifyInstance } from 'fastify'

// Phase 2 S2: 수정/발행/삭제 계약 테스트.
afterAll(async () => {
  await closeDb()
})

async function createDraft(app: FastifyInstance, payload: Record<string, unknown>) {
  const res = await app.inject({ method: 'POST', url: '/posts', payload })
  return res.json() as { id: number; slug: string | null; status: string }
}

describe('posts CRUD — S2 (수정/발행/삭제)', () => {
  it('PATCH /posts/:id → 부분 수정이 조회에 반영', async () => {
    const app = buildApp()
    const p = await createDraft(app, { title: '수정 전' })
    const res = await app.inject({
      method: 'PATCH',
      url: `/posts/${p.id}`,
      payload: { title: '수정 후' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().title).toBe('수정 후')
    await app.close()
  })

  it('PATCH 빈 body → 400 (minProperties)', async () => {
    const app = buildApp()
    const p = await createDraft(app, { title: 'x' })
    const res = await app.inject({ method: 'PATCH', url: `/posts/${p.id}`, payload: {} })
    expect(res.statusCode).toBe(400)
    await app.close()
  })

  it('publish → published + slug 생성 + /blog에 노출', async () => {
    const app = buildApp()
    const p = await createDraft(app, { title: 'S2 발행 테스트 글', description: '설명' })
    expect(p.slug).toBeNull() // 발행 전엔 slug 없음

    const pub = await app.inject({ method: 'POST', url: `/posts/${p.id}/publish` })
    expect(pub.statusCode).toBe(200)
    const body = pub.json()
    expect(body.status).toBe('published')
    expect(body.slug).toBeTruthy()
    expect(body.publishedAt).toBeTruthy()

    // 공개 목록에 나타나는지(관통)
    const blog = await app.inject({ method: 'GET', url: '/blog' })
    const slugs = (blog.json() as Array<{ slug: string }>).map((x) => x.slug)
    expect(slugs).toContain(body.slug)
    await app.close()
  })

  it('publish 없는 id → 404', async () => {
    const app = buildApp()
    const res = await app.inject({ method: 'POST', url: '/posts/999999/publish' })
    expect(res.statusCode).toBe(404)
    await app.close()
  })

  it('DELETE → 이후 조회 404', async () => {
    const app = buildApp()
    const p = await createDraft(app, { title: '삭제될 글' })
    const del = await app.inject({ method: 'DELETE', url: `/posts/${p.id}` })
    expect(del.statusCode).toBe(200)
    expect(del.json().deleted).toBe(true)

    const get = await app.inject({ method: 'GET', url: `/posts/${p.id}` })
    expect(get.statusCode).toBe(404)
    await app.close()
  })
})
