# frontend — Vite + React + TS (계층 규칙)

> 루트 헌법은 `../CLAUDE.md`. 여기는 **이 계층에서만** 유효한 규칙.

## 실행
```bash
npm install
npm run dev      # :5175 (백엔드 :3001이 떠 있어야 함)
npm run build    # tsc -b + vite build
npm run lint     # oxlint
```

## 구조
- `src/main.tsx` — react-router 라우팅(`/blog`, `/blog/:slug`, `/login`, `/write`)
- `src/App.tsx` — 레이아웃(내비 + `<Outlet/>`)
- `src/api.ts` — fetch 래퍼(자동 JWT 헤더), 모든 백엔드 호출
- `src/auth.ts` — JWT localStorage 보관, `src/types.ts` — 응답 타입
- `src/pages/` — `BlogList`, `BlogDetail`(react-markdown), `Login`, `Write`(메모→generate→편집→저장/발행/삭제)

## 규칙
- 모든 백엔드 호출은 `api.ts`를 거친다(주소·인증 헤더 일원화). `API_URL='http://localhost:3001'`.
- 인증 필요한 API는 로그인 후 사용(토큰 없으면 백엔드가 401). 응답 계약(`types.ts`)은 백엔드와 일치시킬 것(백엔드가 진실원).
- 포트 **5175** 고정 — 기본 포트(5173/5174) 점유 회피.
- CI: 프론트 job(lint+build)이 PR마다 실행됨.
