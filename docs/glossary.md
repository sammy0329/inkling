# 용어·데이터 모델 (glossary)

도메인 용어와 상태값의 **단일 정의처**. 코드/문서 어디서든 이 뜻으로 쓴다.
스키마 필드의 **진실원은 `backend/src/db/schema.ts`**(Phase 1에서 생성). 아래는 그 개념 설명이며, 필드 목록을 복붙하지 않는다.

## 엔티티

- **user** — 글 작성자. 인증(Phase 4)에서 활성화. `posts`와 1:N.
- **post** — 블로그 글. `user`에 속함. 아래 상태(status)를 가짐.
- **tag** — 태그. `name` 유니크. `post`와 N:M(`post_tags` 중간 테이블). Phase 3에서 활성화.

## 상태값 (post.status)

- **draft** — 작성 중. 작성자에게만 보임. 새 글의 기본값.
- **published** — 발행됨. 공개 화면(`/blog`)에 노출. 발행 시각(`publishedAt`) 기록.

전이: `draft → published`는 `POST /posts/:id/publish`로만. (되돌리기는 아직 스코프 밖 → 필요 시 ADR로.)

## 기타 용어

- **slug** — post의 URL 식별자. 유니크. 공개 상세는 `/blog/:slug`로 접근.
- **sourceNotes** — 사용자가 입력한 거친 메모 원문. AI 초안(content)의 입력 재료.
- **content** — 마크다운 본문(AI 초안 또는 사용자가 다듬은 결과).
- **description** — 글 요약/설명(목록·메타용).
