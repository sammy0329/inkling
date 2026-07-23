import type { FastifyInstance } from 'fastify'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { posts } from '../db/schema.ts'
import { setPostTags, tagsByPostIds, tagsForPost } from '../db/tags.ts'
import {
  createPostBody,
  errorResponse,
  idParams,
  postResponse,
  updatePostBody,
} from '../schemas/post.ts'
import { slugify } from '../lib/slug.ts'

type PostRow = typeof posts.$inferSelect
type PostBody = Partial<{
  title: string
  content: string
  description: string
  sourceNotes: string
  tags: string[]
}>

function withTags(post: PostRow, tagNames: string[]) {
  return { ...post, tags: tagNames }
}

// 작성자용 글 CRUD (인증은 Phase 4).
export async function postsRoutes(app: FastifyInstance) {
  // 생성 → draft
  app.post(
    '/posts',
    { schema: { body: createPostBody, response: { 201: postResponse } } },
    async (req, reply) => {
      const body = req.body as PostBody
      const [created] = await db
        .insert(posts)
        .values({
          title: body.title ?? '',
          content: body.content ?? '',
          description: body.description ?? '',
          sourceNotes: body.sourceNotes ?? '',
        })
        .returning()
      if (body.tags) await setPostTags(created.id, body.tags)
      reply.code(201)
      return withTags(created, await tagsForPost(created.id))
    },
  )

  // 작성자 뷰: 전체(draft 포함), 최신 생성순
  app.get(
    '/posts',
    { schema: { response: { 200: { type: 'array', items: postResponse } } } },
    async () => {
      const rows = await db.select().from(posts).orderBy(desc(posts.createdAt))
      const tagMap = await tagsByPostIds(rows.map((r) => r.id))
      return rows.map((r) => withTags(r, tagMap.get(r.id) ?? []))
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
      return withTags(post, await tagsForPost(id))
    },
  )

  // 부분 수정 (tags 제공 시 링크 교체)
  app.patch(
    '/posts/:id',
    { schema: { params: idParams, body: updatePostBody, response: { 200: postResponse, 404: errorResponse } } },
    async (req, reply) => {
      const { id } = req.params as { id: number }
      const { tags, ...fields } = req.body as PostBody

      let updated: PostRow | undefined
      if (Object.keys(fields).length > 0) {
        const rows = await db.update(posts).set(fields).where(eq(posts.id, id)).returning()
        updated = rows[0]
      } else {
        const rows = await db.select().from(posts).where(eq(posts.id, id))
        updated = rows[0]
      }
      if (!updated) return reply.code(404).send({ message: 'post not found' })
      if (tags) await setPostTags(id, tags)
      return withTags(updated, await tagsForPost(id))
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
      if (post.status === 'published') return withTags(post, await tagsForPost(id)) // 멱등

      const base = slugify(post.title) || `post-${post.id}`
      let slug = base
      const [clash] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug))
      if (clash && clash.id !== post.id) slug = `${base}-${post.id}`

      const [published] = await db
        .update(posts)
        .set({ status: 'published', publishedAt: new Date(), slug })
        .where(eq(posts.id, id))
        .returning()
      return withTags(published, await tagsForPost(id))
    },
  )

  // 삭제 (post_tags는 FK cascade로 함께 삭제)
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
