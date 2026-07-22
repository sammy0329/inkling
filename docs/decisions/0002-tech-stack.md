# 0002. 기술 스택

- 상태: 채택됨
- 날짜: 2026-07-21

## 배경 (Context)

풀스택 기본기 + AI 네이티브 개발 감각을 기르는 학습 프로젝트다. 스택 선택 기준은 (1) 각 계층의 경계를 또렷하게 학습할 수 있을 것, (2) 학습 전이 효과, (3) AI 연동이 자연스러울 것.

## 결정 (Decision)

- **Frontend**: Vite + React + TypeScript
- **Backend**: Fastify + TypeScript (dev 실행은 `tsx`)
- **DB**: PostgreSQL 16 (Docker) + Drizzle ORM + `postgres` 드라이버
- **AI**: Phase 5에서 Anthropic SDK. 그 전까지는 mock 생성기로 전체 흐름을 완성.

## 결과 (Consequences)

- **Drizzle 선택 근거**: 사용자가 다른 실무 프로젝트에서 이미 사용 중 → 학습 전이 효과. SQL에 가까운 타입세이프 쿼리로 "ORM이 뭘 하는지" 감을 잃지 않음.
- **Fastify 선택 근거**: JSON Schema 기반 요청/응답 검증이 1급 시민 → 하네스(계약 검증) 학습과 잘 맞음.
- **Vite 선택 근거**: 설정 최소, dev 서버 빠름 → 프론트 계층 자체에 집중.
- 감수하는 것: 각 계층을 직접 붙이는 보일러플레이트 비용. 이 프로젝트에서는 그 붙이는 과정 자체가 학습 목표이므로 감수한다.
