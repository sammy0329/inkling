import type { FastifyInstance } from 'fastify'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { posts } from '../db/schema.ts'

// GET /blog — 공개 엔드포인트. published 글만, 최신 발행순.
// 계약(phase-1.md): id / title / slug / description / publishedAt. (content 전체는 목록에 과함)
export async function blogRoutes(app: FastifyInstance) {
  app.get('/blog', async () => {
    return db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        description: posts.description,
        publishedAt: posts.publishedAt,
      })
      .from(posts)
      .where(eq(posts.status, 'published')) // draft 제외 — 이게 공개/비공개 경계
      .orderBy(desc(posts.publishedAt))
  })
}
