// 제목 → URL slug. 문자/숫자(유니코드, 한글 포함) 외는 하이픈으로.
// 예: "Fastify로 시작하는 최소 REST API" → "fastify로-시작하는-최소-rest-api"
export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-') // 문자·숫자 아닌 구간 → 하이픈
    .replace(/^-+|-+$/g, '') // 양끝 하이픈 제거
}
