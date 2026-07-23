# inkling

거친 메모 → **AI가 다듬은 기술블로그 초안**. 풀스택 학습용 앱.

> 설계·의도는 [`CLAUDE.md`](CLAUDE.md), 문서 지도는 [`docs/README.md`](docs/README.md), 결정 근거는 [`docs/decisions/`](docs/decisions/)(ADR).

## 스택
- **frontend** — Vite + React + TypeScript
- **backend** — Fastify + TypeScript
- **DB** — PostgreSQL 16 (Docker) + Drizzle ORM

## 빠른 시작
```bash
docker compose up -d                          # Postgres :5433

cd backend && npm install
npm run db:push && npm run db:seed            # 스키마 + 샘플
npm run dev                                   # 백엔드 :3001

# 새 터미널
cd frontend && npm install && npm run dev     # 프론트 :5175 → 브라우저에서 목록 확인
```

## 포트 (기본 포트 점유를 피해 이동)
| 계층 | 포트 |
|------|------|
| DB | 5433 |
| backend | 3001 |
| frontend | 5175 |

## 진행 상황
학습 로드맵(Phase 1~5)과 페이즈별 계획은 [`docs/phases/`](docs/phases/), 현재 **Phase 1(공개 블로그 목록) 완료**.
