import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.ts'
import type { BlogItem } from '../types.ts'

export default function BlogList() {
  const [posts, setPosts] = useState<BlogItem[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    api
      .listBlog()
      .then((d) => {
        setPosts(d)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <>
      <h1>블로그</h1>
      {status === 'loading' && <p>불러오는 중…</p>}
      {status === 'error' && <p className="error">불러오지 못했습니다. 백엔드가 켜져 있나요?</p>}
      {status === 'ok' && posts.length === 0 && <p>아직 발행된 글이 없습니다.</p>}
      {status === 'ok' && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.id} className="post">
              <h2>{p.slug ? <Link to={`/blog/${p.slug}`}>{p.title}</Link> : p.title}</h2>
              <p className="desc">{p.description}</p>
              <small className="meta">
                {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('ko-KR') : ''}
                {p.tags.length > 0 ? ` · ${p.tags.join(', ')}` : ''}
              </small>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
