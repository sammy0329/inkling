# 0005. GitHub 워크플로 하네스 (커밋 컨벤션 + 템플릿 + 로컬 훅)

- 상태: 채택됨
- 날짜: 2026-07-21

## 배경 (Context)

작업 흐름(커밋 메시지·브랜치명·Issue/PR)을 사람 기억에 의존하면 어긋난다. Intent/하네스 엔지니어링 훈련의 일부로, **형식을 자동 강제**하고 **입력을 템플릿으로 일관화**한다. `gh`가 회사 계정이라, 하네스는 gh에 의존하지 않고 (1) 로컬 훅 (2) repo 내 템플릿 (3) 격리된 개인 gh 로 구성한다.

## 결정 (Decision)

### 1. 커밋 컨벤션 — Conventional Commits
첫 줄 형식: `<type>(<scope>): <subject>`. type ∈ `feat|fix|docs|chore|refactor|test|style|perf|ci|build`.
`.githooks/commit-msg`가 매 커밋에서 검증(위반 시 커밋 거부). Merge/Revert/fixup은 통과.

### 2. 브랜치 전략
- `main`: 항상 초록불(보호). 직접 커밋 지양 — 작업은 브랜치에서.
- Phase 슬라이스: `s<번호>-<설명>` (예: `s1-db-layer`, `s2-api-blog`).
- 그 외: `<type>/<설명>` (예: `chore/github-harness`, `fix/blog-filter`).
- `.githooks/pre-commit`가 현재 브랜치명을 검증(`main` 제외, 위반 시 거부).

### 3. 훅 활성화 — 의존성 없이
훅 스크립트는 `.githooks/`에 커밋하고, 각 클론에서 **한 번** 활성화한다:
```
git config core.hooksPath .githooks
```
husky 같은 도구 없이 "훅이 실제 무엇인지" 보이게 한다.

### 4. 템플릿 (GitHub 웹이 자동 인식)
- `.github/PULL_REQUEST_TEMPLATE.md` — 무엇/검증/메모 + `Closes #`.
- `.github/ISSUE_TEMPLATE/slice.md` — Phase 슬라이스용.

### 5. 격리된 개인 gh (터미널에서 Issue/PR/merge)
기본 `gh`는 회사 계정(sammy-an-mk)이라 사용 금지. 개인 작업은 **별도 설정 폴더**로 격리:
```
export GH_CONFIG_DIR="C:/Users/Admin/.config/gh-personal"   # sammy0329 인증 저장
gh issue create / gh pr create / gh pr merge ...
```
이 폴더에만 sammy0329 토큰이 저장되고, 회사 `~/.config/gh`는 무관. git 작업은 SSH `github-personal`.

## 결과 (Consequences)

- 좋아지는 것: 커밋/브랜치 형식이 자동 강제(사람·AI 둘 다), Issue/PR 입력 일관, 터미널에서 개인 계정으로 전체 흐름 자동화.
- 감수하는 것: 클론마다 `core.hooksPath` 1회 설정 필요. gh 호출 시 `GH_CONFIG_DIR` prefix 필요.
## 추가 (S2-b, `npm run check` 생긴 뒤)

- **GitHub Actions CI** (`.github/workflows/ci.yml`): PR/누적 push 시 Postgres 서비스를 띄워 `db:push`→`db:seed`→`npm run check` 실행. `.env`가 없으므로 `DATABASE_URL`을 job env로 주입(index.ts의 `loadEnvFile()`가 없으면 이 값 사용).
- **pre-push 훅** (`.githooks/pre-push`): push 전 **정적 검사(typecheck + lint)** 만 로컬 강제 — 빠르고 DB 무관. DB 의존 통합 테스트(vitest)는 CI가 담당(표준 분업).
- **branch protection**: `main`은 CI `check` 통과해야 merge(strict). `enforce_admins=false`(솔로 안전밸브), 리뷰 미요구. `gh api`로 설정.
