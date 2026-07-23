export type Post = {
  id: number
  title: string
  slug: string | null
  content: string
  description: string
  sourceNotes: string
  status: 'draft' | 'published'
  createdAt: string
  publishedAt: string | null
  tags: string[]
}

export type BlogItem = {
  id: number
  title: string
  slug: string | null
  description: string
  publishedAt: string | null
  tags: string[]
}

export type Draft = {
  title: string
  description: string
  content: string
  tags: string[]
}
