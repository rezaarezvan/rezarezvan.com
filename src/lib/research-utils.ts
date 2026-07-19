import { getCollection, type CollectionEntry } from 'astro:content'

export async function getAllPublications(): Promise<
  CollectionEntry<'research'>[]
> {
  const publications = await getCollection('research')
  return publications
    .filter((pub) => !pub.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export function groupPublicationsByYear(
  publications: CollectionEntry<'research'>[],
): Record<string, CollectionEntry<'research'>[]> {
  return publications.reduce(
    (acc: Record<string, CollectionEntry<'research'>[]>, pub) => {
      const year = pub.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(pub)
      return acc
    },
    {},
  )
}
