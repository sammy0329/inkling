import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearToken, isLoggedIn } from './auth.ts'
import './App.css'

export default function App() {
  const nav = useNavigate()
  return (
    <div className="container">
      <nav className="nav">
        <Link to="/blog">블로그</Link>
        <Link to="/write">작성</Link>
        {isLoggedIn() ? (
          <button
            type="button"
            className="link"
            onClick={() => {
              clearToken()
              nav('/blog')
            }}
          >
            로그아웃
          </button>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </nav>
      <Outlet />
    </div>
  )
}
