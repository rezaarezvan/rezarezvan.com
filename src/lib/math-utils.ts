import katex from 'katex'

const inlineMath =
  /(^|[^\\])\$(?!\$|\s)((?:\\.|[^$\n\\])*)(?<![\s\\])\$(?!\$)/gm

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function hasInlineMath(value = ''): boolean {
  return new RegExp(inlineMath.source, inlineMath.flags).test(value)
}

export function renderInlineMath(value = ''): string {
  const pattern = new RegExp(inlineMath.source, inlineMath.flags)
  let html = ''
  let cursor = 0

  for (const match of value.matchAll(pattern)) {
    const prefix = match[1] ?? ''
    const start = (match.index ?? 0) + prefix.length
    html += escapeHtml(value.slice(cursor, start))
    html += katex.renderToString(match[2], {
      strict: 'ignore',
      throwOnError: false,
    })
    cursor = (match.index ?? 0) + match[0].length
  }

  return html + escapeHtml(value.slice(cursor))
}

export function plainInlineMath(value = ''): string {
  return value.replace(
    new RegExp(inlineMath.source, inlineMath.flags),
    (_match, prefix: string, expression: string) => `${prefix}${expression}`,
  )
}

export function containsMath(markdown = ''): boolean {
  const prose = markdown
    .replace(/^ {0,3}(```|~~~)[^\n]*\n[\s\S]*?^ {0,3}\1\s*$/gm, '')
    .replace(/(`+)[\s\S]*?\1/g, '')

  return /(^|[^\\])\$\$[\s\S]+?[^\\]\$\$/m.test(prose) || hasInlineMath(prose)
}
