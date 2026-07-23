import { useEffect, useState } from 'react'
import './App.css'

// 백엔드 GET /blog 응답 계약 (phase-1.md와 일치).
type Post = {
  id: number
  title: string
  slug: string
  description: string
  publishedAt: string | null
}

// 백엔드 주소. 기본 포트 점유 회피로 3001. (나중에 env로 뺄 수 있음)
const API_URL = 'http://localhost:3001'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    fetch(`${API_URL}/blog`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Post[]>
      })
      .then((data) => {
        setPosts(data)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="container">
      <h1>inkling — 블로그</h1>

      {status === 'loading' && <p>불러오는 중…</p>}
      {status === 'error' && (
        <p className="error">불러오지 못했습니다. 백엔드({API_URL})가 켜져 있나요?</p>
      )}
      {status === 'ok' && posts.length === 0 && <p>아직 발행된 글이 없습니다.</p>}

      {status === 'ok' && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post">
              <h2>{post.title}</h2>
              <p className="desc">{post.description}</p>
              <small className="meta">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('ko-KR')
                  : ''}{' '}
                · /{post.slug}
              </small>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
