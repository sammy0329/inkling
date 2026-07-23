// 인증 요청/응답 JSON Schema.
export const registerBody = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    // format 의존 없이 간단 패턴으로 이메일 형태 검증
    email: { type: 'string', pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' },
    password: { type: 'string', minLength: 6 },
  },
}

// 로그인도 동일 형태
export const loginBody = registerBody

export const tokenResponse = {
  type: 'object',
  properties: { token: { type: 'string' } },
  required: ['token'],
}
