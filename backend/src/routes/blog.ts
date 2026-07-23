import type { FastifyInstance } from 'fastify'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { posts, postTags, tags } from '../db/schema.ts'
import { tagsByPostIds, tagsForPost } from '../db/tags.ts'
import { errorResponse, postResponse } from '../schemas/post.ts'

// 공개 목록 항목(가벼운 형태 + tags)
const blogListItem = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    slug: { type: ['string', 'null'] },
    description: { type: 'string' },
    publishedAt: { type: ['string', 'null'], format: 'date-time' },
    tags: { type: 'array', items: { type: 'string' } },
  },
}

const listFields = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  description: posts.description,
  publishedAt: posts.publishedAt,
}

export async function blogRoutes(app: FastifyInstance) {
  // GET /blog?tag= — published만, 최신 발행순. tag 있으면 해당 태그 글만.
  app.get(
    '/blog',
    {
      schema: {
        querystring: { type: 'object', properties: { tag: { type: 'string' } } },
        response: { 200: { type: 'array', items: blogListItem } },
      },
    },
    async (req) => {
      const { tag } = req.query as { tag?: string }

      const rows = tag
        ? await db
            .select(listFields)
            .from(posts)
            .innerJoin(postTags, eq(postTags.postId, posts.id))
            .innerJoin(tags, eq(tags.id, postTags.tagId))
            .where(and(eq(posts.status, 'published'), eq(tags.name, tag)))
            .orderBy(desc(posts.publishedAt))
        : await db
            .select(listFields)
            .from(posts)
            .where(eq(posts.status, 'published'))
            .orderBy(desc(posts.publishedAt))

      const tagMap = await tagsByPostIds(rows.map((r) => r.id))
      return rows.map((r) => ({ ...r, tags: tagMap.get(r.id) ?? [] }))
    },
  )

  // GET /blog/:slug — 공개 상세(published만). content 포함.
  app.get(
    '/blog/:slug',
    {
      schema: {
        params: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] },
        response: { 200: postResponse, 404: errorResponse },
      },
    },
    async (req, reply) => {
      const { slug } = req.params as { slug: string }
      const [post] = await db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, slug), eq(posts.status, 'published')))
      if (!post) return reply.code(404).send({ message: 'post not found' })
      return { ...post, tags: await tagsForPost(post.id) }
    },
  )
}
