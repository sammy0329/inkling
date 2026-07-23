# 0004. 작업 추적: 슬라이스마다 GitHub Issue + PR

- 상태: 채택됨
- 날짜: 2026-07-21

## 배경 (Context)

솔로 학습 프로젝트지만, 실무 협업 흐름(Issue → 브랜치 → PR → merge) 근육을 의도적으로 훈련하려 한다. 작업 입도는 이미 phase 문서의 **BUILD 슬라이스**(S1, S2, …)로 정해져 있다(= Task 단위). 별도 티켓 시스템을 새로 만들면 정합성 규칙("사실은 한 곳에만")을 깨므로, 기존 슬라이스에 GitHub의 Issue/PR을 얹는다.

## 결정 (Decision)

- **입도 매핑**: Phase = Epic, BUILD 슬라이스 = Task(= Issue 1개 + PR 1개), DoD 체크박스 = 완료 판정 기준.
- 각 슬라이스는 **Issue 생성 → 브랜치 → 구현/검증 → 커밋·푸시 → PR → merge** 순으로 진행한다. PR 본문에 `Closes #N`으로 Issue를 자동 종료.
- `main`은 항상 `npm run check` 통과 상태로 보호. 작업은 브랜치에서.
- 진행 상태의 단일 진실원은 여전히 `docs/phases/`(DoD 체크박스) + git 히스토리. Issue/PR은 그 위의 협업 레이어.

## 자격증명 제약 (중요)

`gh` CLI 기본 로그인이 다른 계정일 수 있다. 개인 격리를 위해:
- **git 작업(branch/commit/push)**: SSH 별칭 `github-personal`(= sammy0329)로만. ✅
- **Issue/PR 생성·merge**: 기본 `gh`를 쓰지 않는다. 둘 중 하나:
  1. **웹**(sammy0329 브라우저 로그인)에서 생성 — 설정 0, 기본값.
  2. **격리된 개인 `gh`**: `GH_CONFIG_DIR`를 개인 전용 경로로 두고 `gh auth login`(sammy0329). 기본 gh 설정은 건드리지 않음. 여러 프로젝트 동시 진행 시에도 안전.

## 결과 (Consequences)

- 좋아지는 것: 실무 Issue/PR/merge 흐름 학습, 변경마다 리뷰 지점, main 보호.
- 감수하는 것: 슬라이스마다 Issue/PR 관리 오버헤드. 계정 격리를 매번 의식해야 함(위 제약).
