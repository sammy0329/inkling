// ESLint 플랫 설정. src/test의 TypeScript만 검사한다.
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules/**', 'drizzle/**'] },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly' },
    },
  },
)
