import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { api } from '../api.ts'
import type { Post } from '../types.ts'

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'notfound'>('loading')

  useEffect(() => {
    if (!slug) return
    api
      .getBlog(slug)
      .then((d) => {
        setPost(d)
        setStatus('ok')
      })
      .catch(() => setStatus('notfound'))
  }, [slug])

  if (status === 'loading') return <p>불러오는 중…</p>
  if (status === 'notfound' || !post)
    return (
      <p>
        글을 찾을 수 없습니다. <Link to="/blog">목록으로</Link>
      </p>
    )

  return (
    <article>
      <h1>{post.title}</h1>
      <small className="meta">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ko-KR') : ''}
        {post.tags.length > 0 ? ` · ${post.tags.join(', ')}` : ''}
      </small>
      <div className="markdown">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <p>
        <Link to="/blog">← 목록</Link>
      </p>
    </article>
  )
}
