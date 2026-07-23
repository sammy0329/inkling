import { afterAll, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { buildApp } from '../src/server.ts'
import { closeDb, db } from '../src/db/index.ts'
import { tags } from '../src/db/schema.ts'

// Phase 3 S1: 태그 N:M 연결/조회/재사용.
afterAll(async () => {
  await closeDb()
})

async function create(app: FastifyInstance, payload: Record<string, unknown>) {
  const res = await app.inject({ method: 'POST', url: '/posts', payload })
  return res.json() as { id: number; tags: string[] }
}

describe('tags N:M — P3-S1', () => {
  it('POST /posts with tags → GET /posts/:id에 tags 포함', async () => {
    const app = buildApp()
    const p = await create(app, { title: '태그글', tags: ['drizzle', 'fastify'] })
    const res = await app.inject({ method: 'GET', url: `/posts/${p.id}` })
    expect(res.statusCode).toBe(200)
    expect((res.json().tags as string[]).sort()).toEqual(['drizzle', 'fastify'])
    await app.close()
  })

  it('PATCH tags → 링크 교체', async () => {
    const app = buildApp()
    const p = await create(app, { title: 'x', tags: ['a', 'b'] })
    await app.inject({ method: 'PATCH', url: `/posts/${p.id}`, payload: { tags: ['c'] } })
    const res = await app.inject({ method: 'GET', url: `/posts/${p.id}` })
    expect(res.json().tags).toEqual(['c'])
    await app.close()
  })

  it('중복 태그는 재사용(tags 테이블에 1행)', async () => {
    const app = buildApp()
    const name = 'reuse-tag-p3'
    await create(app, { title: 'one', tags: [name] })
    await create(app, { title: 'two', tags: [name] })
    const rows = await db.select().from(tags).where(eq(tags.name, name))
    expect(rows).toHaveLength(1)
    await app.close()
  })
})
