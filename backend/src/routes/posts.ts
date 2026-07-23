import type { FastifyInstance } from 'fastify'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { posts } from '../db/schema.ts'
import { createPostBody, errorResponse, idParams, postResponse } from '../schemas/post.ts'

// 작성자용 글 CRUD (인증은 Phase 4 — 지금은 소유자 없음).
export async function postsRoutes(app: FastifyInstance) {
  // 생성 → draft
  app.post(
    '/posts',
    { schema: { body: createPostBody, response: { 201: postResponse } } },
    async (req, reply) => {
      const body = req.body as {
        title?: string
        content?: string
        description?: string
        sourceNotes?: string
      }
      const [created] = await db
        .insert(posts)
        .values({
          title: body.title ?? '',
          content: body.content ?? '',
          description: body.description ?? '',
          sourceNotes: body.sourceNotes ?? '',
        })
        .returning()
      reply.code(201)
      return created
    },
  )

  // 작성자 뷰: 전체(draft 포함), 최신 생성순
  app.get(
    '/posts',
    { schema: { response: { 200: { type: 'array', items: postResponse } } } },
    async () => {
      return db.select().from(posts).orderBy(desc(posts.createdAt))
    },
  )

  // 단건(편집용)
  app.get(
    '/posts/:id',
    { schema: { params: idParams, response: { 200: postResponse, 404: errorResponse } } },
    async (req, reply) => {
      const { id } = req.params as { id: number }
      const [post] = await db.select().from(posts).where(eq(posts.id, id))
      if (!post) return reply.code(404).send({ message: 'post not found' })
      return post
    },
  )
}
