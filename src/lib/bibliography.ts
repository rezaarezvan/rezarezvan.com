import fs from 'node:fs'
import path from 'node:path'

// ---------------------------------------------------------------------------
// Bibliography: `references.bib` files colocated with content.
//
// Every `references.bib` under `src/content` is parsed into one global
// key -> entry map (keys must be globally unique). A post cites entries with
// `@cite:key`; citation numbers are assigned per document in order of first
// appearance, and the References section lists exactly the cited entries in
// that same order. This avoids any dependency on the source file path during
// markdown processing (the processor never learns it).
// ---------------------------------------------------------------------------

export type BibEntry = {
  type: string
  fields: Record<string, string>
}

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')

// Matches `@cite:key` the same way REF_TOKEN in references.ts does: the key
// may contain dots/hyphens internally but ends on a word character, so a
// sentence period after "@cite:key." stays outside the token.
const CITE_TOKEN = /@cite:([A-Za-z0-9](?:[\w.-]*\w)?)/g

// ---------------------------------------------------------------------------
// BibTeX parsing (minimal: @type{key, field = {...} | "..." | bare, ...})
// ---------------------------------------------------------------------------

export function parseBibtex(text: string): Map<string, BibEntry> {
  const entries = new Map<string, BibEntry>()
  const entryRe = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g
  let match: RegExpExecArray | null

  while ((match = entryRe.exec(text)) !== null) {
    const type = match[1].toLowerCase()
    if (type === 'comment' || type === 'preamble' || type === 'string') continue
    const key = match[2]
    const body = readBalanced(text, entryRe.lastIndex)
    entries.set(key, { type, fields: parseFields(body) })
  }

  return entries
}

// Reads from `start` (just past the opening `{...,`) to the entry's closing
// brace, tracking nesting.
function readBalanced(text: string, start: number): string {
  let depth = 1
  let i = start
  while (i < text.length && depth > 0) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') depth--
    i++
  }
  return text.slice(start, i - 1)
}

function parseFields(body: string): Record<string, string> {
  const fields: Record<string, string> = {}
  const fieldRe = /(\w+)\s*=\s*/g
  let match: RegExpExecArray | null

  while ((match = fieldRe.exec(body)) !== null) {
    const name = match[1].toLowerCase()
    let i = fieldRe.lastIndex
    let value = ''

    if (body[i] === '{') {
      let depth = 1
      i++
      const start = i
      while (i < body.length && depth > 0) {
        if (body[i] === '{') depth++
        else if (body[i] === '}') depth--
        i++
      }
      value = body.slice(start, i - 1)
    } else if (body[i] === '"') {
      i++
      const start = i
      while (i < body.length && body[i] !== '"') i++
      value = body.slice(start, i)
      i++
    } else {
      const start = i
      while (i < body.length && body[i] !== ',' && body[i] !== '\n') i++
      value = body.slice(start, i)
    }

    fields[name] = cleanBibValue(value)
    fieldRe.lastIndex = i
  }

  return fields
}

function cleanBibValue(value: string): string {
  return value
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\\&/g, '&')
    .trim()
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// "Last, First and Other, Person" / "First Last and Person Other" -> readable list.
function formatAuthors(raw: string): string {
  const authors = raw.split(/\s+and\s+/).map((a) => {
    const parts = a.split(',').map((s) => s.trim())
    return parts.length === 2 ? `${parts[1]} ${parts[0]}` : a.trim()
  })
  if (authors.length <= 2) return authors.join(' and ')
  return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`
}

export function formatBibEntry(entry: BibEntry): string {
  const f = entry.fields
  const parts: string[] = []

  if (f.author) parts.push(escapeHtml(formatAuthors(f.author)))
  if (f.year) parts.push(`(${escapeHtml(f.year)})`)
  if (f.title) parts.push(`&ldquo;${escapeHtml(f.title)}&rdquo;.`)

  const venue = f.journal ?? f.booktitle ?? f.publisher
  if (venue) {
    const volume = f.volume ? ` ${escapeHtml(f.volume)}` : ''
    const pages = f.pages ? `, ${escapeHtml(f.pages.replace(/--/g, '-'))}` : ''
    parts.push(`<em>${escapeHtml(venue)}</em>${volume}${pages}.`)
  }

  if (f.note) parts.push(`${escapeHtml(f.note)}.`)
  if (f.url) {
    parts.push(`<a href="${escapeHtml(f.url)}">Link</a>`)
  } else if (f.doi) {
    parts.push(`<a href="https://doi.org/${escapeHtml(f.doi)}">DOI</a>`)
  }

  return parts.join(' ')
}

// ---------------------------------------------------------------------------
// Global bibliography (cached scan of src/content/**/references.bib)
// ---------------------------------------------------------------------------

let cachedBibliography: Map<string, BibEntry> | null = null

function findBibFiles(dir: string): string[] {
  let out: string[] = []
  let listing: fs.Dirent[]
  try {
    listing = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const item of listing) {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) out = out.concat(findBibFiles(full))
    else if (item.name === 'references.bib') out.push(full)
  }
  return out
}

export function loadGlobalBibliography(): Map<string, BibEntry> {
  if (cachedBibliography) return cachedBibliography
  const bib = new Map<string, BibEntry>()
  for (const file of findBibFiles(CONTENT_ROOT)) {
    for (const [key, entry] of parseBibtex(fs.readFileSync(file, 'utf8'))) {
      if (bib.has(key)) {
        throw new Error(
          `Duplicate bibliography key "${key}" (in ${file}); keys must be unique across all references.bib files`,
        )
      }
      bib.set(key, entry)
    }
  }
  cachedBibliography = bib
  return bib
}

// ---------------------------------------------------------------------------
// Per-document citations
// ---------------------------------------------------------------------------

// Ordered unique cite keys, by first appearance in the markdown source.
export function citedKeys(source: string): string[] {
  const keys: string[] = []
  let match: RegExpExecArray | null
  CITE_TOKEN.lastIndex = 0
  while ((match = CITE_TOKEN.exec(source)) !== null) {
    if (!keys.includes(match[1])) keys.push(match[1])
  }
  return keys
}

export type CitationEntry = { key: string; html: string }

// The References list for a post: cited entries only, in citation order.
// Unknown keys are skipped here; the markdown pipeline leaves their `@cite:`
// tokens unresolved, which the rendered-markdown check reports.
export function getCitationEntries(body: string): CitationEntry[] {
  const bib = loadGlobalBibliography()
  const entries: CitationEntry[] = []
  for (const key of citedKeys(body)) {
    const entry = bib.get(key)
    if (entry) entries.push({ key, html: formatBibEntry(entry) })
  }
  return entries
}
