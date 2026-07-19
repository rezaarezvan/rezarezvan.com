import { getCollection, type CollectionEntry } from 'astro:content'
import { calculateWordCountFromHtml, readingTime } from '@/lib/utils'

export async function getAllEssays(): Promise<CollectionEntry<'essays'>[]> {
  const essays = await getCollection('essays')
  return essays
    .filter((essay) => !essay.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAdjacentEssays(currentId: string): Promise<{
  newer: CollectionEntry<'essays'> | null
  older: CollectionEntry<'essays'> | null
}> {
  const essays = await getAllEssays()
  const index = essays.findIndex((essay) => essay.id === currentId)

  if (index === -1) return { newer: null, older: null }

  return {
    newer: index > 0 ? essays[index - 1] : null,
    older: index < essays.length - 1 ? essays[index + 1] : null,
  }
}

export async function getRecentEssays(
  count: number,
): Promise<CollectionEntry<'essays'>[]> {
  return (await getAllEssays()).slice(0, count)
}

export function groupEssaysByYear(
  essays: CollectionEntry<'essays'>[],
): Record<string, CollectionEntry<'essays'>[]> {
  return essays.reduce(
    (groups: Record<string, CollectionEntry<'essays'>[]>, essay) => {
      const year = essay.data.date.getFullYear().toString()
      ;(groups[year] ??= []).push(essay)
      return groups
    },
    {},
  )
}

export function getEssayReadingTime(essay: CollectionEntry<'essays'>): string {
  return readingTime(calculateWordCountFromHtml(essay.body))
}
