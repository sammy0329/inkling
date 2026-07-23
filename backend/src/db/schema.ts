// Drizzle 스키마 = "테이블을 TypeScript로 선언" → db:push가 이 선언을 실제 DB 테이블로 만든다.
// 이 파일이 posts 구조의 진실원(single source of truth). 문서는 이걸 설명만 함.
import { pgTable, serial, text, timestamp, pgEnum, integer, primaryKey } from 'drizzle-orm/pg-core'

// 글 상태 enum (glossary.md 참조). DB 레벨에서 draft|published만 허용.
export const postStatus = pgEnum('post_status', ['draft', 'published'])

// Phase 1 최소본: 공개 블로그 목록에 필요한 필드만.
// userId(users FK)는 Phase 4(인증)에서 추가한다 — 지금은 없음.
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique(), // 발행 시 부여(그 전엔 null). 공개 상세 URL (/blog/:slug). NULL 다중 허용 + unique.
  content: text('content').notNull().default(''), // 마크다운 본문
  description: text('description').notNull().default(''), // 요약(목록/메타용)
  sourceNotes: text('source_notes').notNull().default(''), // 입력 메모 원문
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }), // 작성자(Phase 4). 기존 글은 null.
  status: postStatus('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }), // 발행 시각(미발행이면 null)
})

// 사용자 (Phase 4). 비밀번호는 해시로만 저장.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// 태그 (Phase 3). posts와 N:M — post_tags 중간 테이블로 연결.
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
})

export const postTags = pgTable(
  'post_tags',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }), // 글 삭제 시 링크도 삭제
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })], // 같은 (post,tag) 중복 방지
)
