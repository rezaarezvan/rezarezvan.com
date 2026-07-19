import type {
  Delete,
  Emphasis,
  Html,
  InlineCode,
  Link,
  Paragraph,
  PhrasingContent,
  Strong,
} from 'mdast'
import { defineMdastPlugin } from 'satteri'
import { decodeHTML } from 'entities'
import katex from 'katex'
import type { MdastNode } from 'satteri'
import { icon } from './icons'
import { THEOREM_TYPES } from './references'

type CalloutConfig = {
  icon: string
  accent: string
  defaultClosed?: boolean
}

// Desaturated "pigment" accents (chroma 0.07-0.14, L 46-62%) tuned to read as
// inks on the parchment/candlelit palette. Family hues: slate, olive, ochre,
// brick, aubergine, verdigris, indigo, gold leaf, wash blue, sienna, oxblood,
// forest. Lightness staggers within a family mirror the original palette.
export const calloutConfig: Record<string, CalloutConfig> = {
  note: { icon: 'info', accent: 'oklch(52% 0.08 250)' },
  tip: { icon: 'lightbulb', accent: 'oklch(55% 0.1 130)' },
  warning: { icon: 'alert-triangle', accent: 'oklch(62% 0.12 80)' },
  caution: { icon: 'shield-alert', accent: 'oklch(52% 0.14 30)' },
  danger: { icon: 'shield-alert', accent: 'oklch(52% 0.14 30)' },
  important: {
    icon: 'message-square-warning',
    accent: 'oklch(48% 0.1 330)',
  },
  definition: { icon: 'book-open', accent: 'oklch(50% 0.09 195)' },
  axiom: { icon: 'anchor', accent: 'oklch(54% 0.08 195)' },
  notation: { icon: 'pen-tool', accent: 'oklch(58% 0.07 195)' },
  theorem: { icon: 'check-circle', accent: 'oklch(46% 0.11 265)' },
  lemma: { icon: 'puzzle', accent: 'oklch(50% 0.1 265)' },
  corollary: { icon: 'git-branch', accent: 'oklch(54% 0.09 265)' },
  proposition: { icon: 'file-text', accent: 'oklch(54% 0.09 265)' },
  conjecture: { icon: 'help-circle', accent: 'oklch(52% 0.1 330)' },
  proof: { icon: 'check-square', accent: 'oklch(60% 0.11 78)' },
  remark: { icon: 'message-circle', accent: 'oklch(58% 0.08 235)' },
  intuition: { icon: 'lightbulb', accent: 'oklch(58% 0.08 235)' },
  recall: { icon: 'rotate-ccw', accent: 'oklch(58% 0.08 235)' },
  example: { icon: 'code', accent: 'oklch(55% 0.11 45)' },
  explanation: { icon: 'help-circle', accent: 'oklch(55% 0.11 45)' },
  exercise: { icon: 'dumbbell', accent: 'oklch(50% 0.13 25)' },
  problem: { icon: 'alert-circle', accent: 'oklch(50% 0.13 25)' },
  answer: {
    icon: 'check',
    accent: 'oklch(58% 0.11 25)',
    defaultClosed: true,
  },
  solution: {
    icon: 'check-circle-2',
    accent: 'oklch(58% 0.11 25)',
    defaultClosed: true,
  },
  summary: { icon: 'list', accent: 'oklch(50% 0.09 150)' },
  algorithm: { icon: 'cpu', accent: 'oklch(50% 0.09 150)' },
  derivation: { icon: 'pen-tool', accent: 'oklch(54% 0.08 150)' },
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderInline(nodes: PhrasingContent[]): string {
  return nodes.map(renderInlineNode).join('')
}

function renderInlineNode(node: PhrasingContent): string {
  const maybeValueNode = node as PhrasingContent & { value?: unknown }

  if (node.type === 'inlineMath' && typeof maybeValueNode.value === 'string') {
    return katex.renderToString(maybeValueNode.value, {
      strict: 'ignore',
      throwOnError: false,
    })
  }

  switch (node.type) {
    case 'text':
      return escapeHtml(node.value)
    case 'html':
      return node.value
    case 'inlineCode':
      return `<code>${escapeHtml((node as InlineCode).value)}</code>`
    case 'emphasis':
      return `<em>${renderInline((node as Emphasis).children)}</em>`
    case 'strong':
      return `<strong>${renderInline((node as Strong).children)}</strong>`
    case 'delete':
      return `<del>${renderInline((node as Delete).children)}</del>`
    case 'link': {
      const link = node as Link
      const title = link.title ? ` title="${escapeHtml(link.title)}"` : ''
      return `<a href="${escapeHtml(link.url)}"${title}>${renderInline(link.children)}</a>`
    }
    case 'break':
      return '<br />'
    default: {
      return escapeHtml(
        typeof maybeValueNode.value === 'undefined'
          ? ''
          : String(maybeValueNode.value),
      )
    }
  }
}

function summaryHtmlRaw(
  type: string,
  labelHtml: string | null,
  number: number | null,
): Html {
  // Theorem-like callouts render their proper word + auto number (e.g.
  // "Definition 3"); others just capitalize the type name.
  const theorem = THEOREM_TYPES[type]
  const heading = theorem ? theorem.word : capitalize(type)
  const main = number !== null ? `${heading} ${number}` : heading
  const title = labelHtml ? `${main} <span>(${labelHtml})</span>` : main

  return {
    type: 'html',
    value: [
      '<summary>',
      icon(calloutConfig[type]?.icon ?? 'info'),
      `<span>${title}</span>`,
      icon('chevron-down'),
      '</summary>',
    ].join(''),
  }
}

function detailsData(type: string, open: boolean, id: string | null) {
  return {
    hName: 'details',
    hProperties: {
      dataCallout: type,
      style: `--callout-accent:${calloutConfig[type]?.accent}`,
      open,
      ...(id ? { id } : {}),
    },
  }
}

// Satteri parses a directive label (`:::type[label]`) only minimally: `` `code` ``
// becomes an `inlineCode` node, but `*emph*`/`**strong**`, `$…$` math, HTML
// entities, and smartypants typography all stay as raw `text`. The legacy
// blockquote path got full inline Markdown for free, so to keep labels lossless
// across the migration we replicate those text transforms ourselves on each
// `text` node, while non-text nodes (code, links) render via `renderInlineNode`.

// Educated punctuation matching Satteri's body-text smartypants so labels read
// identically to the legacy callouts (en/em dashes, curly quotes, ellipsis).
function smartypants(text: string): string {
  return text
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/\.\.\./g, '…')
    .replace(/"(?=\S)/g, '“')
    .replace(/"/g, '”')
    .replace(/(?<=[\p{L}\p{N}.,!?])'/gu, '’')
    .replace(/'(?=\S)/g, '‘')
    .replace(/'/g, '’')
}

// Decode entities + smartypants, then tokenize `**strong**` / `*emph*` / `_em_`,
// HTML-escaping the literal remainder.
function renderLabelMarkup(text: string): string {
  const value = smartypants(decodeHTML(text))
  let out = ''
  let index = 0
  while (index < value.length) {
    if (value.startsWith('**', index)) {
      const end = value.indexOf('**', index + 2)
      if (end !== -1) {
        out += `<strong>${escapeHtml(value.slice(index + 2, end))}</strong>`
        index = end + 2
        continue
      }
    }
    const char = value[index]
    if (char === '*' || char === '_') {
      const end = value.indexOf(char, index + 1)
      if (end !== -1) {
        out += `<em>${escapeHtml(value.slice(index + 1, end))}</em>`
        index = end + 1
        continue
      }
    }
    out += escapeHtml(char)
    index += 1
  }
  return out
}

function renderLabelTextWithMath(value: string): string {
  return value
    .split(/(\$[^$]*\$)/g)
    .map((part) =>
      part.length > 1 && part.startsWith('$') && part.endsWith('$')
        ? katex.renderToString(part.slice(1, -1), {
            strict: 'ignore',
            throwOnError: false,
          })
        : renderLabelMarkup(part),
    )
    .join('')
}

export function renderLabelNodes(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) =>
      node.type === 'text'
        ? renderLabelTextWithMath(node.value)
        : renderInlineNode(node),
    )
    .join('')
}

function getDirectiveLabelHtml(node: Readonly<DirectiveNode>): string | null {
  if (!Array.isArray(node.children)) return null

  const first = node.children[0] as Paragraph | undefined
  const isLabel =
    first?.type === 'paragraph' &&
    (first.data as { directiveLabel?: boolean } | undefined)?.directiveLabel ===
      true

  if (!isLabel || !Array.isArray(first.children)) return null

  const html = renderLabelNodes(first.children).trim()
  return html || null
}

export function calloutDirectives() {
  // Per-document, per-type counters for theorem-like callouts. Keyed by source
  // so numbering resets per document and matches the registry in references.ts
  // (which re-counts in the same document order for cross-references).
  const counters = new Map<string, Map<string, number>>()

  return defineMdastPlugin({
    name: 'callout-directives',
    containerDirective(node, ctx) {
      const type = node.name.toLowerCase()
      if (!calloutConfig[type]) return

      const labelHtml = getDirectiveLabelHtml(node)
      if (labelHtml !== null) ctx.removeNode(node.children[0])

      const closed = !!node.attributes && 'closed' in node.attributes
      const open = !closed && !calloutConfig[type]?.defaultClosed

      let number: number | null = null
      if (THEOREM_TYPES[type]) {
        const source = ctx.source ?? ''
        let perType = counters.get(source)
        if (!perType) {
          perType = new Map()
          counters.set(source, perType)
        }
        number = (perType.get(type) ?? 0) + 1
        perType.set(type, number)
      }

      const id =
        typeof node.attributes?.id === 'string' ? node.attributes.id : null

      ctx.prependChild(node, summaryHtmlRaw(type, labelHtml, number))
      ctx.setProperty(node, 'data', detailsData(type, open, id) as never)
    },
  })
}

type DirectiveNode = MdastNode & {
  name: string
  attributes?: Record<string, unknown> | null
  children?: MdastNode[]
}
