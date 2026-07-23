# inkling — AI 기술블로그 어시스턴트 (프로젝트 헌법)

> **inkling**: 거친 메모(어렴풋한 생각) → AI가 다듬은 블로그 초안. 이름이 곧 제품 흐름.

> 이 파일은 프로젝트의 **안정적인 맥락**만 담는다(거의 안 바뀜). 결정의 근거·우리가 일하는 방식·페이즈별 계획은 `docs/`에 있고, 여기서는 링크만 한다.
> 새 세션은 이 파일 → `docs/WORKFLOW.md` → `docs/phases/phase-N.md` 순으로 읽는다.

## 문서 지도
- `docs/README.md` — 문서 계층·정합성 규칙("사실은 한 곳에만")
- `docs/WORKFLOW.md` — 우리가 일하는 방식(페이즈 루프, DoD, 검증 관문)
- `docs/decisions/` — ADR: 왜 이렇게 정했나 ([스택](docs/decisions/0002-tech-stack.md) · [교육 방침](docs/decisions/0003-education-policy.md) · [작업 추적 Issue/PR](docs/decisions/0004-work-tracking.md) · [GitHub 하네스](docs/decisions/0005-github-workflow-harness.md))
- `docs/glossary.md` — 도메인 용어·데이터 모델 개념
- `docs/phases/` — 페이즈별 intent + 회고

## 이 프로젝트가 뭔가
공부한 거친 메모를 입력하면 **AI가 기술블로그 초안(마크다운)을 써주고**, 사용자가 다듬어서 발행하는 학습용 풀스택 앱.
목표: 풀스택(프론트/백/DB) 기본기 + AI 네이티브 개발 감각. 동시에 실제 기술블로그 콘텐츠를 뽑는 실용 도구.

## 사용자(학습자) 배경
- AI 네이티브 개발자로 성장하려는 학습자. 기본 원리 이해를 중시함("AI에게 잘 시키려면 결과를 판단할 수 있어야 한다").
- 이번 프로젝트에서 **Intent 엔지니어링 + 하네스 엔지니어링 + 문서 정합성**을 의도적으로 훈련한다 → `docs/WORKFLOW.md`.
- 개인 GitHub 계정으로 개인 작업 폴더에서 진행.

## 기술 스택 (근거는 ADR-0002)
- **Frontend**: Vite + React + TypeScript
- **Backend**: Fastify + TypeScript (dev는 `tsx`)
- **DB**: PostgreSQL 16 (Docker) + Drizzle ORM + `postgres` 드라이버
- **AI**: Phase 5에서 Anthropic SDK (그 전까진 mock)

## 핵심 워크플로우
메모 입력 → AI 초안 생성(제목/목차/마크다운 본문/태그/설명) → 마크다운 에디터로 편집 → 발행(draft→published) → .md 내보내기

## 데이터 모델
개념·용어는 `docs/glossary.md`, 필드의 **진실원은 `backend/src/db/schema.ts`**(Phase 1에서 생성). 요약:
- `users` 1:N `posts`, `posts` N:M `tags`(중간 테이블 `post_tags`)
- `posts.status`: `draft` | `published`

## API 설계 (Fastify)
```
POST /auth/register, /auth/login        인증 (Phase 4)
GET  /posts                             내 글 목록(draft 포함, 인증)
POST /posts                             빈 글 생성
POST /posts/generate                    메모→AI 초안 (스트리밍, Phase 5)
PATCH /posts/:id                        수정
POST /posts/:id/publish                 발행
GET  /posts/:id/export                  .md 다운로드
GET  /blog                              발행된 글 목록 (공개)
GET  /blog/:slug                        글 상세 (공개)
```

## 폴더 구조
```
backend-study/
  docs/              프로젝트 문서(위 지도 참조)
  frontend/          Vite + React + TS  (pages: /write, /blog, /blog/:slug) + CLAUDE.md
  backend/           Fastify + TS + CLAUDE.md
    src/
      routes/        엔드포인트
      plugins/       db, auth, anthropic
      schemas/       요청/응답 JSON Schema 검증
      db/            schema.ts(Drizzle), index.ts(연결), seed.ts
  docker-compose.yml PostgreSQL
```
> **CLAUDE.md 분리 원칙**: 루트는 헌법. `backend/`, `frontend/`가 생기면 각 폴더에 계층별 CLAUDE.md를 둔다(그 계층에서만 유효한 규칙·명령). Phase 1 스캐폴딩 때 함께 만든다.

## 학습 로드맵
- [x] **Phase 1**: 공개 블로그 목록 화면 — 프론트↔백엔드↔DB 연결 확인 (✅ 완료 → `docs/phases/phase-1.md`)
- [x] **Phase 2**: 글 작성 CRUD + Fastify JSON Schema 검증 (✅ 완료 → `docs/phases/phase-2.md`)
- [ ] **Phase 3**: 태그(N:M 관계)
- [ ] **Phase 4**: 인증(로그인, JWT) + 작성자/공개 화면 분리
- [ ] **Phase 5**: AI 초안 생성 (Anthropic SDK, 스트리밍 렌더링)
