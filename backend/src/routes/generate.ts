import type { FastifyInstance } from 'fastify'
import { draftGenerator } from '../lib/generate.ts'
import { requireAuth } from '../plugins/auth.ts'

const generateBody = {
  type: 'object',
  additionalProperties: false,
  required: ['notes'],
  properties: { notes: { type: 'string', minLength: 1 } },
}

const generateResponse = {
  type: 'object',
  required: ['title', 'description', 'content', 'tags'],
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    content: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
  },
}

// POST /posts/generate — 메모 → AI 초안(현재 mock). 응답만 반환(글 생성은 프론트가 POST /posts로).
export async function generateRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)
  app.post(
    '/posts/generate',
    { schema: { body: generateBody, response: { 200: generateResponse } } },
    async (req) => {
      const { notes } = req.body as { notes: string }
      return draftGenerator.generate(notes)
    },
  )
}
