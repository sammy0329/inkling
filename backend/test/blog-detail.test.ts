import { afterAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/server.ts'
import { closeDb } from '../src/db/index.ts'
import { auth, registerAndToken } from './helpers.ts'

// Phase 3 S2: 공개 블로그 태그 노출 + ?tag 필터 + /blog/:slug 상세.
afterAll(async () => {
  await closeDb()
})

describe('blog tags + detail — P3-S2', () => {
  it('발행 글이 태그와 함께 필터되고 상세 조회됨', async () => {
    const app = buildApp()
    const h = auth(await registerAndToken(app))
    const uniqueTag = 'p3s2-tag'

    const created = (
      await app.inject({
        method: 'POST',
        url: '/posts',
        headers: h,
        payload: { title: 'P3S2 상세 글', content: '# 본문', description: '설명', tags: [uniqueTag] },
      })
    ).json()
    const pub = (await app.inject({ method: 'POST', url: `/posts/${created.id}/publish`, headers: h })).json()
    const slug: string = pub.slug
    expect(slug).toBeTruthy()

    // ?tag 필터 (공개 — 인증 불필요)
    const filtered = (
      await app.inject({ method: 'GET', url: `/blog?tag=${encodeURIComponent(uniqueTag)}` })
    ).json() as Array<{ slug: string; tags: string[] }>
    const match = filtered.find((p) => p.slug === slug)
    expect(match).toBeTruthy()
    expect(match!.tags).toContain(uniqueTag)

    // 상세
    const detail = await app.inject({ method: 'GET', url: `/blog/${encodeURIComponent(slug)}` })
    expect(detail.statusCode).toBe(200)
    expect(detail.json().content).toBe('# 본문')
    expect(detail.json().tags).toContain(uniqueTag)

    // 없는 slug → 404
    const missing = await app.inject({ method: 'GET', url: '/blog/no-such-slug-xyz' })
    expect(missing.statusCode).toBe(404)

    await app.close()
  })
})
