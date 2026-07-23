// 태그 N:M 헬퍼 — upsert, 링크 교체, 그룹 조회.
import { eq, inArray } from 'drizzle-orm'
import { db } from './index.ts'
import { tags, postTags } from './schema.ts'

// 태그 이름들을 upsert하고 name→id 맵 반환(중복/공백 정리).
export async function upsertTags(names: string[]): Promise<Map<string, number>> {
  const clean = [...new Set(names.map((n) => n.trim()).filter(Boolean))]
  if (clean.length === 0) return new Map()
  await db
    .insert(tags)
    .values(clean.map((name) => ({ name })))
    .onConflictDoNothing() // 이미 있으면 재사용
  const rows = await db.select().from(tags).where(inArray(tags.name, clean))
  return new Map(rows.map((r) => [r.name, r.id]))
}

// post의 태그 링크를 주어진 names로 통째로 교체.
export async function setPostTags(postId: number, names: string[]): Promise<void> {
  await db.delete(postTags).where(eq(postTags.postId, postId))
  const map = await upsertTags(names)
  if (map.size === 0) return
  await db.insert(postTags).values([...map.values()].map((tagId) => ({ postId, tagId })))
}

// 여러 post의 태그 이름을 한 번에 조회(postId→string[]).
export async function tagsByPostIds(postIds: number[]): Promise<Map<number, string[]>> {
  const result = new Map<number, string[]>()
  if (postIds.length === 0) return result
  const rows = await db
    .select({ postId: postTags.postId, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(inArray(postTags.postId, postIds))
  for (const r of rows) {
    const arr = result.get(r.postId) ?? []
    arr.push(r.name)
    result.set(r.postId, arr)
  }
  return result
}

// 단일 post의 태그.
export async function tagsForPost(postId: number): Promise<string[]> {
  return (await tagsByPostIds([postId])).get(postId) ?? []
}
