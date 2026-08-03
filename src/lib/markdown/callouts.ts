import type { Html, Paragraph } from 'mdast'
import { defineMdastPlugin } from 'satteri'
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

function summaryHtmlRaw(type: string, number: number | null): Html {
  // Theorem-like callouts render their proper word + auto number (e.g.
  // "Definition 3"); others just capitalize the type name.
  const theorem = THEOREM_TYPES[type]
  const heading = theorem ? theorem.word : capitalize(type)
  const main = number !== null ? `${heading} ${number}` : heading

  return {
    type: 'html',
    value: [
      '<summary>',
      icon(calloutConfig[type]?.icon ?? 'info'),
      `<span>${main}</span>`,
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

function getDirectiveLabel(node: Readonly<DirectiveNode>): Paragraph | null {
  if (!Array.isArray(node.children)) return null

  const first = node.children[0] as Paragraph | undefined
  const isLabel =
    first?.type === 'paragraph' &&
    (first.data as { directiveLabel?: boolean } | undefined)?.directiveLabel ===
      true

  return isLabel ? first : null
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

      const label = getDirectiveLabel(node)

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

      if (label) {
        const theorem = THEOREM_TYPES[type]
        const heading = theorem ? theorem.word : capitalize(type)
        const main = number !== null ? `${heading} ${number}` : heading
        ctx.setProperty(label, 'data', { hName: 'summary' } as never)
        ctx.prependChild(label, {
          type: 'html',
          value: `${icon(calloutConfig[type]?.icon ?? 'info')}<span>${main}<span> (`,
        })
        ctx.appendChild(label, {
          type: 'html',
          value: `)</span></span>${icon('chevron-down')}`,
        })
      } else {
        ctx.prependChild(node, summaryHtmlRaw(type, number))
      }
      ctx.setProperty(node, 'data', detailsData(type, open, id) as never)
    },
  })
}

type DirectiveNode = MdastNode & {
  name: string
  attributes?: Record<string, unknown> | null
  children?: MdastNode[]
}
