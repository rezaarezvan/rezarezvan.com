import { getCollection, type CollectionEntry } from 'astro:content'

export type SchoolCollection = 'bachelor' | 'master' | 'exchange'
export type SubjectEntry = {
  slug: string
  title: string
  count: number
}

// URL generation utilities
export function getSchoolUrl(): string {
  return `/notes/`
}

export function getSubjectUrl(
  collection: SchoolCollection,
  subject: string,
): string {
  return `/notes/${collection}/${subject}/`
}

export function getPostUrl(
  collection: SchoolCollection,
  postId: string,
): string {
  return `/notes/${collection}/${postId}/`
}

export function getSchoolBreadcrumbLabel(collection: SchoolCollection): string {
  const labels = {
    bachelor: 'Bachelor',
    master: 'Master',
    exchange: 'Exchange',
  }
  return labels[collection]
}

function getEntryIdentifier(entry: CollectionEntry<SchoolCollection>): string {
  return entry.id || ''
}

export async function getSchoolEntries(
  collection: SchoolCollection,
): Promise<CollectionEntry<SchoolCollection>[]> {
  const entries = await getCollection(collection)
  return entries
    .filter((entry) => !entry.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
    )
}

export async function getSubjectEntries(
  collection: SchoolCollection,
  subject: string,
): Promise<CollectionEntry<SchoolCollection>[]> {
  const entries = await getSchoolEntries(collection)
  return entries
    .filter((entry) => {
      const identifier = getEntryIdentifier(entry)
      return identifier.startsWith(subject + '/')
    })
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
    )
}

export async function getAllSubjects(
  collection: SchoolCollection,
): Promise<SubjectEntry[]> {
  const entries = await getSchoolEntries(collection)

  if (entries.length === 0) {
    return []
  }

  const subjects = [
    ...new Set(
      entries
        .map((entry) => {
          const identifier = getEntryIdentifier(entry)
          const parts = identifier.split('/')
          return parts.length > 0 ? parts[0] : null
        })
        .filter(Boolean) as string[],
    ),
  ]

  return subjects
    .map((subject) => {
      const subjectEntries = entries.filter((entry) => {
        const identifier = getEntryIdentifier(entry)
        return identifier.startsWith(subject + '/') && !entry.data.draft
      })

      const subjectName =
        subjectEntries[0]?.data.school?.[0] || capitalizeWords(subject)

      return {
        slug: subject,
        title: subjectName,
        count: subjectEntries.length,
      }
    })
    .sort((a, b) => b.count - a.count)
}

export async function getAdjacentSubjectPosts(
  collection: SchoolCollection,
  currentSlug: string,
): Promise<{
  prev: CollectionEntry<SchoolCollection> | null
  next: CollectionEntry<SchoolCollection> | null
}> {
  const parts = currentSlug.split('/')
  const subject = parts.length > 0 ? parts[0] : null

  if (!subject) {
    return { prev: null, next: null }
  }

  const subjectPosts = await getSubjectEntries(collection, subject)
  const currentIndex = subjectPosts.findIndex(
    (post) => getEntryIdentifier(post) === currentSlug,
  )

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    next: currentIndex > 0 ? subjectPosts[currentIndex - 1] : null,
    prev:
      currentIndex < subjectPosts.length - 1
        ? subjectPosts[currentIndex + 1]
        : null,
  }
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (l) => l.toUpperCase())
}
