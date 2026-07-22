# frontend — Vite + React + TS (계층 규칙)

> 루트 헌법은 `../CLAUDE.md`. 여기는 **이 계층에서만** 유효한 규칙.

## 실행
```bash
npm install
npm run dev      # :5175 (백엔드 :3001이 떠 있어야 목록이 뜸)
npm run build    # tsc -b + vite build
npm run lint     # oxlint
```

## 구조
- `src/App.tsx` — GET /blog fetch → published 목록 렌더(loading/error/empty 처리)
- `src/{App.css,index.css}`, `index.html`, `vite.config.ts`(port 5175 고정)

## 규칙
- 백엔드 주소 `API_URL`은 `App.tsx` 상수(`http://localhost:3001`). 나중에 env로 뺄 수 있음.
- 포트 **5175** 고정 — 회사 프론트(5173/5174)와 충돌 회피.
- 응답 계약(`Post` 타입)은 백엔드 `GET /blog`와 **일치**시킬 것(백엔드가 진실원).
- 현재 CI/로컬 훅은 **백엔드만** 포함. 프론트 검사 편입은 후속 정리 대상.
