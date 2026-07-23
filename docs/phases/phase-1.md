# Phase 1 — 공개 블로그 목록 화면

- 상태: ✅ 완료 (S1~S4)
- 기간: 2026-07-21 ~ 2026-07-22

> 목적: 프론트 ↔ 백엔드 ↔ DB가 실제로 연결되는 걸 눈으로 확인. **목록만** 관통한다.

## 목표 (Goal)
브라우저에서 `/blog`에 접속하면 DB에 seed된 **발행(published) 글 목록**이 화면에 보인다. 데이터가 Postgres → Fastify → React를 거쳐 흐르는 전체 경로를 한 번 관통한다.

## 비목표 (Non-goals)
- 글 상세 페이지 `/blog/:slug` → **Phase 2** (이번엔 목록만)
- 글 작성/수정/삭제 (Phase 2) · 태그 (Phase 3) · 인증 (Phase 4) · AI 생성 (Phase 5)
- 예쁜 디자인/CSS — 데이터가 흐르는 것 확인이 우선

## 계약 (Contract)
`GET /blog` → published 글 배열, 각 항목 필드: `id`, `title`, `slug`, `description`, `publishedAt`.
(draft는 제외. `content` 전체는 목록에 과하므로 제외 — 상세는 Phase 2에서 slug로.)

## 완료 기준 (DoD)
- [x] `docker compose up -d`로 Postgres 16이 뜬다. (S1 — 호스트 5433, 기존 5432 서비스와 공존)
- [x] `npm run db:push`로 스키마가 DB에 반영된다. (S1 — posts 테이블 생성 확인)
- [x] `npm run db:seed`로 published/draft 섞인 샘플 글이 들어간다. (S1 — published 3, draft 1)
- [x] `GET /health`가 200을 반환한다. (S2 — `{"status":"ok"}`, 포트 3001)
- [x] `GET /blog`가 **published 글만** 위 계약대로 200 반환 (draft 제외를 테스트로 확인). (S2 — 3건, 발행일 내림차순)
- [x] **vitest 계약 테스트**: `/blog`가 published만 반환하고 draft를 노출하지 않음을 검증. (S2)
- [x] 프론트 dev 서버에서 `/blog` 접속 시 그 글 제목들이 렌더된다. (S3 — 브라우저 확인: 3건 렌더, draft 미노출. 프론트 :5175)
- [x] `npm run check`(typecheck + lint + **test**) 통과. (S2 — 관문 구성 완료)

## 결정된 사항 (구 열린 질문)
1. ✅ 스코프: **목록만**. 상세(`/blog/:slug`)는 Phase 2.
2. ✅ 응답 필드: `id/title/slug/description/publishedAt` (위 계약).
3. ✅ 테스트 하네스: **Phase 1부터 vitest** 계약 테스트를 `npm run check`에 포함.
4. ✅ 폴더별 CLAUDE.md(`backend/`, `frontend/`) 생성 (S4).

## BUILD 슬라이스 (한 번에 쏟지 않고 단계로 — 교육 방침 ADR-0003)
> 각 슬라이스 끝에서 눈으로/명령으로 확인한 뒤 다음으로.
- **S1. DB 계층**: docker-compose(Postgres16) + backend 초기화(package.json/tsconfig) + Drizzle schema(`posts` 최소) + 연결 + seed → `db:push`/`db:seed` 동작 확인.
- **S2. API 계층**: Fastify `/health`, `/blog`(published만) + `@fastify/cors` + vitest 계약 테스트 + `npm run check` 관문 구성.
- **S3. 프론트 계층**: Vite react-ts + `/blog` fetch 목록 화면 → 브라우저 확인.
- **S4. SYNC**: 폴더별 CLAUDE.md, README(실행법), 로드맵 체크, 회고.

---

## 회고
**무엇을 배웠나**
- **계층별 포트 격리가 병렬 프로젝트의 실전 이슈**: 로컬에서 이미 쓰던 DB(5432), API(3000), 프론트(5173/5174) 포트와 전부 충돌 → 5433/3001/5175로 이동. 세 번 다 같은 패턴.
- **계약 테스트(inject) + HTTP 스모크 둘 다 필요**: 포트 충돌은 inject 테스트로는 안 잡히고 실제 기동 스모크에서만 드러났다.
- **하네스를 코드와 함께**: `npm run check` 관문 → 로컬 훅(commit-msg/pre-commit/pre-push) → CI → branch protection 순으로 "완료의 의미"를 코드보다 먼저/같이 고정하니, 이후 슬라이스가 안전 궤도 위에서 굴러갔다.
- **격리된 개인 gh(GH_CONFIG_DIR)**로 기본 gh 계정을 안 건드리고 터미널에서 Issue→PR→CI→merge 전부 자동화.
- **INTENT→CHALLENGE→BUILD→VERIFY→SYNC 루프**: intent를 먼저 검증가능한 DoD로 적으니 판단 기준이 또렷했다.

**다음에 바꿀 것**
- 프론트가 CI/훅 밖(백엔드만) → 프론트 typecheck/lint를 CI·pre-push에 편입.
- 계약 테스트가 seed 개수(3)에 하드 의존 → 취약. 상태 기준 검증으로 견고화.
- CI 액션의 Node20 deprecation 경고 → 액션 버전 업.
- 백엔드 `API_URL`/포트를 프론트에 하드코딩 → env(`VITE_*`)로.

**남긴 ADR**: 0001(ADR 방침)·0002(스택)·0003(교육 방침)·0004(작업 추적)·0005(GitHub 하네스)
