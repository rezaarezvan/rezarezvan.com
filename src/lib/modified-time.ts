import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

type Collection = 'essays' | 'bachelor' | 'master' | 'exchange' | 'research'

const collectionRoots: Record<Collection, string> = {
  essays: 'src/content/essays',
  bachelor: 'src/content/notes/bachelor',
  master: 'src/content/notes/master',
  exchange: 'src/content/notes/exchange',
  research: 'src/content/research',
}

function candidates(collection: Collection, id: string): string[] {
  const root = collectionRoots[collection]

  return [join(root, `${id}.md`), join(root, id, 'index.md')]
}

export function getLastModified(
  collection: Collection,
  id: string,
): Date | null {
  const file = candidates(collection, id).find((candidate) =>
    existsSync(candidate),
  )
  if (!file) return null

  try {
    const value = execFileSync(
      'git',
      ['log', '-1', '--pretty=format:%cI', '--', file],
      {
        stdio: ['ignore', 'pipe', 'ignore'],
        encoding: 'utf8',
      },
    ).trim()

    return value ? new Date(value) : null
  } catch {
    return null
  }
}

/**
 * Return the latest content revision after publication. Addition- and
 * rename-only commits are ignored so reorganising the collection does not
 * make every Essay look newly revised.
 */
export function getLastRevision(
  collection: Collection,
  id: string,
  published: Date,
): Date | null {
  const file = candidates(collection, id).find((candidate) =>
    existsSync(candidate),
  )
  if (!file) return null

  // Keep pre-migration history available while Essay files move from the old
  // collection path. This affects Git lookup only; it does not retain old URLs.
  const historyPaths = [
    file,
    ...(collection === 'essays'
      ? [
          join('src/content/blog', `${id}.md`),
          join('src/content/blog', id, 'index.md'),
        ]
      : []),
  ]

  for (const historyPath of historyPaths) {
    try {
      const value = execFileSync(
        'git',
        [
          'log',
          '-1',
          '--follow',
          '--diff-filter=M',
          '--pretty=format:%cI',
          '--',
          historyPath,
        ],
        {
          stdio: ['ignore', 'pipe', 'ignore'],
          encoding: 'utf8',
        },
      ).trim()

      if (!value) continue
      const revised = new Date(value)
      if (Number.isNaN(revised.valueOf())) continue

      const publishedDay = published.toISOString().slice(0, 10)
      const revisedDay = revised.toISOString().slice(0, 10)
      return revisedDay > publishedDay ? revised : null
    } catch {
      continue
    }
  }

  return null
}
