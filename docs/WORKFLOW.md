# 우리가 일하는 방식 (operating loop)

이 프로젝트의 학습 목표는 앱을 만드는 것만이 아니라 **Intent 엔지니어링**과 **하네스 엔지니어링**을 몸에 익히는 것이다. 아래 루프가 그 훈련의 골격이다.

## 페이즈 루프

각 페이즈는 이 5단계를 돈다.

```
1. INTENT     사용자가 phases/phase-N.md에 의도를 쓴다 (목표/비목표/완료기준/열린질문)
2. CHALLENGE  Claude가 그 의도를 되받아 모호함·리스크·빠진 엣지케이스를 지적 → 합의
3. BUILD      작은 단위로 구현
4. VERIFY     하네스로 검증. 완료 기준(DoD)을 하나씩 대조. 통과해야만 "완료"
5. SYNC       CLAUDE.md 로드맵 체크, ADR 기록, phase 문서에 회고 추가
```

핵심은 **1→2 사이의 마찰**이다. 의도가 모호하면 결과도 모호하다는 걸 매 페이즈 체감하는 게 Intent 엔지니어링 훈련이다. Claude는 애매한 intent를 만나면 **바로 구현하지 말고 먼저 되묻는다.**

## 완료 기준(DoD)을 쓰는 법

DoD는 반드시 **검증 가능한(observable)** 형태여야 한다.

- ❌ "블로그 목록이 보인다" — 무엇으로 확인? 통과/실패를 누가 판정?
- ✅ "`GET /blog`가 seed된 published 글 배열을 200으로 반환한다. 브라우저 `/blog`에서 그 글들이 렌더된다. `npm run check` 통과."

DoD의 각 줄은 그대로 **검증 절차**가 된다.

## 검증 관문 (harness contract)

"완료"라고 말하기 전에 통과해야 하는 관문. **아직 구현 안 됨 — Phase 1에서 만든다.** 여기서는 *의미*를 먼저 고정한다.

- `npm run check` (예정) = **typecheck + lint + test**를 한 번에. 초록불이 아니면 미완료.
- **스모크 검증**: 계약(엔드포인트)이 실제로 응답하는지 실제 호출로 확인.
- Claude는 DoD 체크리스트를 스스로 대조한 근거(명령 출력 등)를 제시한 뒤에만 완료를 선언한다.

> 규칙: "됐다"는 말은 근거와 함께. 테스트가 깨지면 깨졌다고 그대로 말한다.

## 슬라이스 = Issue + 브랜치 + PR (작업 추적 — ADR-0004)

입도 매핑: **Phase = Epic, BUILD 슬라이스 = Task, DoD 체크박스 = 완료 판정.**
각 슬라이스는 이 한 바퀴를 돈다:

```
1. Issue 생성     "Phase N · S_: 제목" (본문에 해당 DoD)
2. 브랜치         git switch -c <슬라이스명>   (SSH github-personal = 개인 계정)
3. BUILD + VERIFY 구현 → npm run check / 눈 확인
4. 커밋·푸시      작성자 = sammy0329
5. PR → merge     PR 본문에 "Closes #N" → Issue 자동 종료
```

- `main`은 항상 `npm run check` 통과 상태로 보호. 작업은 브랜치에서.
- **자격증명 주의**: `gh` CLI는 회사 계정 → Issue/PR은 **웹(sammy0329)** 또는 격리된 개인 gh로. git 작업은 SSH `github-personal`. (상세: ADR-0004)

## 커밋/문서 동기화

- 페이즈가 끝나면 CLAUDE.md 로드맵의 해당 `[ ]`를 `[x]`로.
- 결정이 있었으면 `decisions/`에 ADR 추가.
- `phases/phase-N.md` 하단에 **회고**(무엇을 배웠나, 다음에 바꿀 것) 추가.
