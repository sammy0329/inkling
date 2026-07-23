// 개발용 샘플 데이터 주입. `npm run db:seed`로 실행.
// published/draft를 섞어 넣는다 → 나중에 GET /blog가 draft를 거르는지 검증할 재료.
import { db } from './index.ts'
import { posts } from './schema.ts'

const rows = [
  {
    title: 'Fastify로 시작하는 최소 REST API',
    slug: 'fastify-minimal-rest-api',
    description: 'Fastify로 첫 엔드포인트를 만들며 REST의 기본기를 잡는다.',
    content: '# Fastify 최소 REST API\n\n첫 서버를 띄우고 `/health`를 만들어 본다.',
    sourceNotes: 'fastify 빠름, JSON Schema 검증이 1급 시민',
    status: 'published' as const,
    publishedAt: new Date('2026-07-10T09:00:00Z'),
  },
  {
    title: 'Drizzle ORM로 스키마를 코드로 다루기',
    slug: 'drizzle-schema-as-code',
    description: '테이블을 TypeScript로 선언하고 db:push로 반영하는 흐름.',
    content: '# Drizzle 스키마\n\npgTable로 posts를 선언하고 push 한다.',
    sourceNotes: 'drizzle = SQL에 가까운 타입세이프 쿼리',
    status: 'published' as const,
    publishedAt: new Date('2026-07-14T09:00:00Z'),
  },
  {
    title: 'Docker로 로컬 Postgres 격리하기',
    slug: 'docker-local-postgres',
    description: '앱은 호스트, DB는 컨테이너. 포트 충돌은 매핑으로 회피.',
    content: '# 로컬 Postgres\n\ndocker compose up -d 한 방으로 DB를 띄운다.',
    sourceNotes: '5432 충돌 → 5433으로 매핑, 두 DB 공존',
    status: 'published' as const,
    publishedAt: new Date('2026-07-18T09:00:00Z'),
  },
  {
    title: '아직 다듬는 중인 초안',
    // draft는 slug 없음(발행 시 부여)
    description: '이 글은 draft라 공개 목록에 안 보여야 한다.',
    content: '# 작성 중\n\n공개되면 안 되는 초안.',
    sourceNotes: '거친 메모 상태',
    status: 'draft' as const,
    // publishedAt 없음(미발행)
  },
]

async function main() {
  await db.delete(posts) // 재실행 시 중복(slug 유니크 충돌) 방지 — 싹 지우고 다시.
  await db.insert(posts).values(rows)

  const all = await db.select().from(posts)
  const published = all.filter((p) => p.status === 'published').length
  const draft = all.filter((p) => p.status === 'draft').length
  console.log(`seeded ${all.length} posts (published: ${published}, draft: ${draft})`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
