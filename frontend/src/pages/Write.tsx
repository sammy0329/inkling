import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.ts'
import { isLoggedIn } from '../auth.ts'
import type { Post } from '../types.ts'

export default function Write() {
  const nav = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [notes, setNotes] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  async function refresh() {
    setPosts(await api.listPosts())
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      nav('/login')
      return
    }
    void refresh()
  }, [nav])

  function tagArray(): string[] {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }

  function currentData() {
    return { title, content, description, sourceNotes: notes, tags: tagArray() }
  }

  function reset() {
    setEditingId(null)
    setNotes('')
    setTitle('')
    setDescription('')
    setTags('')
    setContent('')
    setMsg('')
  }

  async function generate() {
    if (!notes.trim()) return
    const d = await api.generate(notes)
    setTitle(d.title)
    setDescription(d.description)
    setContent(d.content)
    setTags(d.tags.join(', '))
    setMsg('AI 초안 생성됨 — 다듬어 저장하세요')
  }

  async function save(): Promise<number> {
    if (editingId) {
      await api.updatePost(editingId, currentData())
      setMsg('저장됨')
      await refresh()
      return editingId
    }
    const p = await api.createPost(currentData())
    setEditingId(p.id)
    setMsg('생성됨')
    await refresh()
    return p.id
  }

  async function publish() {
    const id = await save()
    const p = await api.publishPost(id)
    setMsg(`발행됨 → /blog/${p.slug ?? ''}`)
    await refresh()
  }

  function edit(p: Post) {
    setEditingId(p.id)
    setTitle(p.title)
    setDescription(p.description)
    setContent(p.content)
    setNotes(p.sourceNotes)
    setTags(p.tags.join(', '))
    setMsg('')
  }

  async function remove(id: number) {
    await api.deletePost(id)
    if (editingId === id) reset()
    await refresh()
  }

  return (
    <div className="write">
      <h1>작성 {editingId ? `(편집 #${editingId})` : '(새 글)'}</h1>

      <label>거친 메모</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="공부한 메모를 적고 'AI 초안 생성'을 누르세요…"
      />
      <button type="button" onClick={generate}>
        AI 초안 생성
      </button>

      <hr />

      <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="설명" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="태그(쉼표로 구분)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        placeholder="마크다운 본문"
      />

      <div className="row">
        <button type="button" onClick={save}>
          저장
        </button>
        <button type="button" onClick={publish}>
          발행
        </button>
        <button type="button" className="link" onClick={reset}>
          새 글
        </button>
      </div>
      {msg && <p className="meta">{msg}</p>}

      <hr />

      <h2>내 글</h2>
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.id} className="post">
            <strong>{p.title || '(제목 없음)'}</strong> <small className="meta">[{p.status}]</small>
            <div className="row">
              <button type="button" className="link" onClick={() => edit(p)}>
                편집
              </button>
              <button type="button" className="link" onClick={() => void remove(p.id)}>
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
