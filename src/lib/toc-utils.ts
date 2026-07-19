import type { MarkdownHeading } from 'astro'

function sourceHeadings(markdown: string) {
  const headings: { depth: number; text: string }[] = []
  let fence: '`' | '~' | null = null

  for (const line of markdown.split('\n')) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fenceMatch) {
      const marker = fenceMatch[1][0] as '`' | '~'
      if (!fence) fence = marker
      else if (fence === marker) fence = null
      continue
    }
    if (fence) continue

    const match = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*$/)
    if (!match) continue

    headings.push({
      depth: match[1].length,
      text: match[2]
        .replace(/\s+#+\s*$/, '')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/(`+)(.*?)\1/g, '$2')
        .replace(/(\w)'(\w)/g, '$1’$2'),
    })
  }

  return headings
}

export function getTocLabels(
  markdown: string,
  headings: MarkdownHeading[],
): string[] {
  const source = sourceHeadings(markdown)
  let cursor = 0

  return headings.map((heading) => {
    const match = source.findIndex(
      (candidate, index) =>
        index >= cursor && candidate.depth === heading.depth,
    )
    if (match === -1) return heading.text
    cursor = match + 1
    return source[match].text
  })
}
