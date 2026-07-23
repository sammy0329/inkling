import type { FastifyInstance } from 'fastify'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { posts } from '../db/schema.ts'
import {
  createPostBody,
  errorResponse,
  idParams,
  postResponse,
  updatePostBody,
} from '../schemas/post.ts'
import { slugify } from '../lib/slug.ts'

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

  // 부분 수정
  app.patch(
    '/posts/:id',
    { schema: { params: idParams, body: updatePostBody, response: { 200: postResponse, 404: errorResponse } } },
    async (req, reply) => {
      const { id } = req.params as { id: number }
      const body = req.body as Partial<{
        title: string
        content: string
        description: string
        sourceNotes: string
      }>
      const [updated] = await db.update(posts).set(body).where(eq(posts.id, id)).returning()
      if (!updated) return reply.code(404).send({ message: 'post not found' })
      return updated
    },
  )

  // 발행: draft → published, slug 자동 부여
  app.post(
    '/posts/:id/publish',
    { schema: { params: idParams, response: { 200: postResponse, 404: errorResponse } } },
    async (req, reply) => {
      const { id } = req.params as { id: number }
      const [post] = await db.select().from(posts).where(eq(posts.id, id))
      if (!post) return reply.code(404).send({ message: 'post not found' })
      if (post.status === 'published') return post // 멱등: 이미 발행됨

      // slug 생성 + 유니크 보장(이미 있으면 -id 붙임)
      const base = slugify(post.title) || `post-${post.id}`
      let slug = base
      const [clash] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug))
      if (clash && clash.id !== post.id) slug = `${base}-${post.id}`

      const [published] = await db
        .update(posts)
        .set({ status: 'published', publishedAt: new Date(), slug })
        .where(eq(posts.id, id))
        .returning()
      return published
    },
  )

  // 삭제
  app.delete(
    '/posts/:id',
    {
      schema: {
        params: idParams,
        response: {
          200: { type: 'object', properties: { deleted: { type: 'boolean' } }, required: ['deleted'] },
          404: errorResponse,
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: number }
      const deleted = await db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id })
      if (deleted.length === 0) return reply.code(404).send({ message: 'post not found' })
      return { deleted: true }
    },
  )
}
