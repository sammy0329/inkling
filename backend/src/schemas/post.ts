// Fastify JSON Schema — 요청/응답 계약.
// Fastify가 이걸로 (1) 요청 검증(위반 시 자동 400) (2) 응답 직렬화(스키마 밖 필드 제거)를 해준다.

// 글 1건 응답 형태
export const postResponse = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    slug: { type: ['string', 'null'] }, // draft는 null
    content: { type: 'string' },
    description: { type: 'string' },
    sourceNotes: { type: 'string' },
    status: { type: 'string', enum: ['draft', 'published'] },
    createdAt: { type: 'string', format: 'date-time' },
    publishedAt: { type: ['string', 'null'], format: 'date-time' },
    tags: { type: 'array', items: { type: 'string' } },
  },
  required: ['id', 'title', 'status'],
}

// 생성 body — 전부 선택(빈 글도 허용). 정의 밖 필드는 거부(400).
export const createPostBody = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    description: { type: 'string' },
    sourceNotes: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
  },
}

// 부분 수정 body — 최소 1개 필드(빈 수정 거부).
export const updatePostBody = {
  type: 'object',
  additionalProperties: false,
  minProperties: 1,
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    description: { type: 'string' },
    sourceNotes: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
  },
}

// 경로 파라미터 :id (문자열→정수로 강제 변환됨)
export const idParams = {
  type: 'object',
  properties: { id: { type: 'integer' } },
  required: ['id'],
}

// 에러 응답(404 등)
export const errorResponse = {
  type: 'object',
  properties: { message: { type: 'string' } },
  required: ['message'],
}
