# Phase 4 — 인증(JWT) + 소유권

- 상태: ✅ 완료 (S1·S2)
- 기간: 2026-07-22

## 목표
회원가입/로그인으로 JWT를 발급하고, 작성자 라우트를 보호하며 글에 소유권을 부여한다.

## 무엇을 했나
- **S1**: `users`(email unique, passwordHash). 비번은 Node 내장 **scrypt**로 해시(`lib/password.ts`, 평문 저장 안 함). `@fastify/jwt`로 서명. `POST /auth/register`(중복 409), `POST /auth/login`(오류 401).
- **S2**: `posts.userId`(FK users). `postsRoutes`에 `preHandler requireAuth`(전 라우트 401), 쿼리를 본인 글로 스코프. 생성 시 userId 기록, `GET /posts`는 본인 글만, 타인 글 수정/삭제는 404. 공개 `/blog`·`/blog/:slug`는 인증 없이 접근.

## DoD
- [x] users db:push, register/login/JWT, 중복 409·오류 401
- [x] posts.userId, 보호 라우트 401, 본인 글만, 타인 404
- [x] 공개 라우트 회귀 없음
- [x] npm run check green(테스트를 인증 기반으로 갱신)

## 회고
- **배운 것**: Fastify 플러그인 스코프에 `addHook('preHandler', ...)`로 그 플러그인 라우트만 보호. `@fastify/jwt` 타입은 `declare module`로 payload/user 확장. 소유권은 쿼리에 `and(eq(id), eq(userId))`를 더해 비소유자를 자연스럽게 404로. 인증 추가로 기존 테스트가 401 → `test/helpers.ts`로 토큰 획득 공통화.
- **다음에 바꿀 것**: 토큰 만료/리프레시 미구현. 비밀번호 정책 최소(6자).
- **남긴 ADR**: 없음.
