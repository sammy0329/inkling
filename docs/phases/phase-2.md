# Phase 2 — 글 작성 CRUD + Fastify JSON Schema 검증

- 상태: 진행중 (INTENT 확정 2026-07-22 — BUILD로)
- 기간: 2026-07-22 ~

> 목적: 작성자가 글을 만들고 → 편집 → 발행하는 흐름을, **Fastify JSON Schema 검증**으로 계약을 강제하며 구현. Phase 2는 **백엔드 + 테스트**에 집중(프론트 /write는 후속).

## 목표 (Goal) — 초안
글을 생성(draft)하고, 부분 수정하고, 발행(draft→published)할 수 있다. 모든 요청/응답은 JSON Schema로 검증·직렬화된다(잘못된 입력은 400).

## 비목표 (Non-goals) — 초안
- 인증/소유권 (Phase 4) — 지금은 글에 소유자 없음. `GET /posts`는 "전체 작성자 뷰".
- 태그 (Phase 3), AI 생성 (Phase 5)
- 리치 마크다운 에디터 — textarea 수준이면 충분(디자인 비목표)

## 엔드포인트 (Phase 2) — 초안
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /posts | 글 생성 → draft |
| GET | /posts | 작성자 뷰: 전체 목록(draft 포함) |
| GET | /posts/:id | 단건 조회(편집용) |
| PATCH | /posts/:id | 부분 수정(title/content/description/sourceNotes) |
| POST | /posts/:id/publish | 발행(status→published, publishedAt, slug 확정) |
| DELETE | /posts/:id | 삭제 |

공개 `/blog`(published 목록)는 Phase 1에서 완료.

## 완료 기준 (DoD) — 초안
- [ ] 각 엔드포인트에 body/params/response **JSON Schema** 부착, Fastify가 검증.
- [x] 잘못된 body(필수 누락/타입 오류)는 **400** 반환(테스트로 확인). (S1 — removeAdditional:false로 엄격 계약)
- [ ] vitest 계약 테스트: 생성→조회→수정→발행 흐름 + draft가 /blog엔 안 뜨고 발행 후 뜬다.
- [ ] `npm run check` 통과.
- [ ] (프론트 포함 시) 브라우저 `/write`에서 글 작성·발행 확인.

## 결정된 사항 (구 열린 질문)
1. ✅ 범위: **백엔드 + 테스트만**. 프론트 `/write`는 후속 페이즈.
2. ✅ slug: **발행 시 자동 생성**(title→kebab, 중복이면 `-2` suffix, title 비면 `post-<id>`).
3. ✅ DELETE 포함 (CRUD 완결성).
4. ✅ 스키마 변화: `slug`를 **nullable**로(draft는 slug 없음 → 발행 때 부여). unique 유지(NULL 다중 허용).

## BUILD 슬라이스
- **S1**: 스키마 변경(slug nullable) + JSON Schema 검증 인프라 + `POST /posts`·`GET /posts`·`GET /posts/:id`(404 처리) + 계약 테스트.
- **S2**: `PATCH /posts/:id`·`POST /posts/:id/publish`(slug 자동)·`DELETE /posts/:id` + 테스트(생성→수정→발행→/blog 노출 흐름, 잘못된 body 400).

---

## 회고 (페이즈 종료 후 작성)
- 무엇을 배웠나:
- 다음에 바꿀 것:
- 남긴 ADR:
