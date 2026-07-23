# Phase 2 — 글 작성 CRUD + Fastify JSON Schema 검증

- 상태: ✅ 완료 (S1·S2)
- 기간: 2026-07-22

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
- [x] 각 엔드포인트에 body/params/response **JSON Schema** 부착, Fastify가 검증. (S1·S2)
- [x] 잘못된 body(필수 누락/타입 오류)는 **400** 반환(테스트로 확인). (S1 — removeAdditional:false로 엄격 계약)
- [x] vitest 계약 테스트: 생성→조회→수정→발행 흐름 + draft가 /blog엔 안 뜨고 발행 후 뜬다. (S2 — 10 tests)
- [x] `npm run check` 통과. (S2)
- [–] 프론트 `/write` — Phase 2 범위 밖(후속 페이즈).

## 결정된 사항 (구 열린 질문)
1. ✅ 범위: **백엔드 + 테스트만**. 프론트 `/write`는 후속 페이즈.
2. ✅ slug: **발행 시 자동 생성**(title→kebab, 중복이면 `-2` suffix, title 비면 `post-<id>`).
3. ✅ DELETE 포함 (CRUD 완결성).
4. ✅ 스키마 변화: `slug`를 **nullable**로(draft는 slug 없음 → 발행 때 부여). unique 유지(NULL 다중 허용).

## BUILD 슬라이스
- **S1**: 스키마 변경(slug nullable) + JSON Schema 검증 인프라 + `POST /posts`·`GET /posts`·`GET /posts/:id`(404 처리) + 계약 테스트.
- **S2**: `PATCH /posts/:id`·`POST /posts/:id/publish`(slug 자동)·`DELETE /posts/:id` + 테스트(생성→수정→발행→/blog 노출 흐름, 잘못된 body 400).

---

## 회고
**무엇을 배웠나**
- **Fastify JSON Schema가 계약을 강제**: body/params 검증(위반 시 자동 400) + response 직렬화(스키마 밖 필드 제거). `reply.code`도 response 스키마의 선언 코드로 타입 제한됨 → 404 쓰려면 404 스키마 선언.
- **`removeAdditional:false`로 엄격 계약**: 기본값은 정의 밖 필드를 조용히 제거 → 400이 안 남. 끄니 계약 위반이 드러남.
- **slug 유니크 보장**: title→kebab(유니코드/한글 유지), 충돌 시 `-id` 접미. 발행은 멱등(이미 published면 no-op).
- **통합 테스트의 크로스파일 DB 오염**: publish 테스트가 published를 추가하니 blog.test의 "정확히 3건" 단언이 깨짐 → 개수 의존을 없애고 슬러그 포함/제외로 검증(= Phase 1 회고 항목 해결).

**다음에 바꿀 것**
- 상태 전이 규칙 확장(발행 취소/재발행) 미정 — 필요 시 ADR.
- 테스트가 DB에 글을 누적 → 파일별 트랜잭션 롤백 등으로 격리 고려.
- 프론트 `/write` 작성·발행 UI는 후속 페이즈.

**남긴 ADR**: 없음(요청 검증은 스택 결정(ADR-0002) 범위 내).
