# Phase 3 — 태그 (N:M)

- 상태: ✅ 완료 (S1·S2)
- 기간: 2026-07-22

## 목표
글에 태그를 달고(N:M), 공개 블로그에서 태그를 노출·필터하며, 글 상세를 조회한다.

## 무엇을 했나
- **S1**: `tags`(name unique) + `post_tags`(복합 PK, FK cascade). `POST/PATCH /posts`가 `tags[]`를 받아 upsert+링크, 모든 글 응답에 `tags` 포함. 헬퍼 `db/tags.ts`(upsert/set/group).
- **S2**: `GET /blog` 항목에 `tags`, `GET /blog?tag=<name>` 필터, `GET /blog/:slug` 공개 상세(content 포함, 404).

## DoD
- [x] tags/post_tags db:push, 생성/수정 시 연결, 응답에 tags
- [x] 중복 태그 재사용(테이블 1행)
- [x] /blog tags·?tag 필터·/blog/:slug 상세
- [x] npm run check green

## 회고
- **배운 것**: 중간 테이블 + 복합 PK로 N:M, `onConflictDoNothing`으로 태그 upsert 재사용, `inArray` 그룹 조회로 N+1 회피, FK `onDelete: cascade`로 글 삭제 시 링크 자동 정리.
- **남긴 ADR**: 없음(스키마 결정 범위 내).
