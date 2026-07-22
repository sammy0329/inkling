# backend — Fastify + Drizzle (계층 규칙)

> 루트 헌법은 `../CLAUDE.md`, 일하는 방식은 `../docs/WORKFLOW.md`. 여기는 **이 계층에서만** 유효한 규칙.

## 실행
```bash
# 사전: 루트에서 docker compose up -d  (Postgres :5433)
npm install
npm run db:push     # 스키마 반영
npm run db:seed     # 샘플(published 3 + draft 1)
npm run dev         # :3001 (tsx watch)
npm run check       # typecheck + lint + test — 커밋/PR 전 통과 필수
```

## 구조
- `src/db/` — `schema.ts`(테이블 **진실원**), `index.ts`(연결·`closeDb`), `seed.ts`
- `src/routes/` — `health.ts`(/health), `blog.ts`(/blog, published만)
- `src/server.ts` — `buildApp()`(테스트가 inject로 재사용) + 직접 실행 시 `listen`
- `drizzle.config.ts`, `.env`(.example)

## 규칙
- `posts` 필드의 진실원은 `src/db/schema.ts`. 문서/타입은 여기에 맞춘다.
- import는 `.ts` 확장자 사용(tsconfig `allowImportingTsExtensions`).
- 환경변수는 `.env`(gitignore) → `process.loadEnvFile()`로 로드, 없으면 주입값 사용(CI).
- 포트 **3001** / DB **5433** — 회사 프로젝트(3000/5432)와 충돌 회피용 고정.
- 계약 테스트는 `app.inject`(포트 무관) + 실제 seed DB에 의존. 포트 충돌은 테스트가 못 잡으니 HTTP 스모크도 함께.
