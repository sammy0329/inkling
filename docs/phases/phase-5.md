# Phase 5 — AI 초안 생성 + 프론트 작성 UI

- 상태: ✅ 완료 (백엔드 mock + 프론트)
- 기간: 2026-07-22

## 목표
메모 → AI 초안(제목/설명/마크다운/태그) 생성. 프론트에서 작성·생성·발행 전체 흐름 완성.

## 무엇을 했나
- **백엔드(P5-S1)**: `POST /posts/generate`(인증 필요). 생성기는 `DraftGenerator` 인터페이스 뒤 `mockGenerator`(외부 호출 없음, 메모→제목/태그/마크다운 스캐폴드). **교체 지점 주석**으로 실 Anthropic SDK 주입 예정. 응답만 반환(글 생성은 프론트가 `POST /posts`).
- **프론트(FE-S1·S2)**: react-router 라우팅(`/blog`, `/blog/:slug`, `/login`, `/write`). `api.ts`(fetch+JWT), `auth.ts`(localStorage). 페이지: 로그인/가입, 작성(메모→generate→편집→저장/발행/삭제, 내 글 목록), 상세(`react-markdown`). CI에 프론트 job(lint+build) 추가.

## DoD
- [x] POST /posts/generate mock, 인증 필요, notes 없으면 400
- [x] 라우팅 + 로그인(JWT 보관) + 작성/생성/발행 UI
- [x] 상세 페이지 마크다운 렌더
- [x] backend check + frontend build/oxlint green(CI 양쪽 job)

## 회고
- **배운 것**: "mock 먼저"(ADR-0003)로 AI 흐름을 API 키 없이 완성 — 인터페이스 뒤에 두어 실연동은 구현 교체만. 프론트는 fetch 래퍼에 JWT를 주입해 인증 흐름 단순화. SPA 라우팅.
- **다음에 바꿀 것**: 실 Anthropic SDK 스트리밍 연동(교체 지점 준비됨). 프론트 E2E 테스트(현재 build/lint만). 토큰 만료 처리.
- **남긴 ADR**: 없음(mock 방침은 ADR-0003).
