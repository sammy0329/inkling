import { getToken } from './auth.ts'
import type { BlogItem, Draft, Post } from './types.ts'

const API_URL = 'http://localhost:3001'

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (res.status === 204 ? null : await res.json()) as T
}

type PostInput = {
  title: string
  content: string
  description: string
  sourceNotes: string
  tags: string[]
}
type TokenResp = { token: string }

export const api = {
  register: (email: string, password: string) =>
    req<TokenResp>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    req<TokenResp>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  listBlog: (tag?: string) =>
    req<BlogItem[]>(`/blog${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`),
  getBlog: (slug: string) => req<Post>(`/blog/${encodeURIComponent(slug)}`),
  listPosts: () => req<Post[]>('/posts'),
  createPost: (data: Partial<PostInput>) =>
    req<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id: number, data: Partial<PostInput>) =>
    req<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  publishPost: (id: number) => req<Post>(`/posts/${id}/publish`, { method: 'POST' }),
  deletePost: (id: number) => req<{ deleted: boolean }>(`/posts/${id}`, { method: 'DELETE' }),
  generate: (notes: string) =>
    req<Draft>('/posts/generate', { method: 'POST', body: JSON.stringify({ notes }) }),
}
