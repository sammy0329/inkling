import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.ts'
import { setToken } from '../auth.ts'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const { token } =
        mode === 'login' ? await api.login(email, password) : await api.register(email, password)
      setToken(token)
      nav('/write')
    } catch {
      setError(mode === 'login' ? '로그인 실패' : '가입 실패(이미 있는 이메일?)')
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호(6자 이상)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">{mode === 'login' ? '로그인' : '가입'}</button>
      <button
        type="button"
        className="link"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? '회원가입으로' : '로그인으로'}
      </button>
    </form>
  )
}
