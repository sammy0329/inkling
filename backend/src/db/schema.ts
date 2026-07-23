// Drizzle 스키마 = "테이블을 TypeScript로 선언" → db:push가 이 선언을 실제 DB 테이블로 만든다.
// 이 파일이 posts 구조의 진실원(single source of truth). 문서는 이걸 설명만 함.
import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

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
  status: postStatus('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }), // 발행 시각(미발행이면 null)
})
