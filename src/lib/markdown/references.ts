import type {
  Html,
  Image,
  Paragraph,
  Parent,
  PhrasingContent,
  Root,
  Text as MdastText,
} from 'mdast'
import { defineMdastPlugin, markdownToMdast } from 'satteri'
import { citedKeys, loadGlobalBibliography } from '../bibliography'

// ---------------------------------------------------------------------------
// Cross-reference configuration
// ---------------------------------------------------------------------------

// Theorem-like callout types that get auto-numbered and can be cross-referenced.
// The `prefix` is what the author writes both in the directive id (`{#def:foo}`)
// and in references (`@def:foo`). Numbering is per-type, in document order.
export const THEOREM_TYPES: Record<string, { prefix: string; word: string }> = {
  definition: { prefix: 'def', word: 'Definition' },
  theorem: { prefix: 'thm', word: 'Theorem' },
  lemma: { prefix: 'lem', word: 'Lemma' },
  corollary: { prefix: 'cor', word: 'Corollary' },
  proposition: { prefix: 'prop', word: 'Proposition' },
  conjecture: { prefix: 'conj', word: 'Conjecture' },
  axiom: { prefix: 'ax', word: 'Axiom' },
  example: { prefix: 'ex', word: 'Example' },
  exercise: { prefix: 'exer', word: 'Exercise' },
  problem: { prefix: 'prob', word: 'Problem' },
  remark: { prefix: 'rem', word: 'Remark' },
}

type RefFormat = { word: string; paren?: boolean }

// prefix -> how the reference text reads. `paren` renders "Equation (3)".
const REF_FORMATS: Record<string, RefFormat> = {
  fig: { word: 'Figure' },
  eq: { word: 'Equation', paren: true },
  tbl: { word: 'Table' },
  cite: { word: 'Reference' },
  ...Object.fromEntries(
    Object.values(THEOREM_TYPES).map((t) => [t.prefix, { word: t.word }]),
  ),
}

// Longest-first so `@exer` isn't shadowed by `@ex`.
const REF_PREFIXES = Object.keys(REF_FORMATS).sort(
  (a, b) => b.length - a.length,
)

const FIGURE_LABEL = /^fig:[A-Za-z0-9][\w:.-]*$/
const NUMBERED_ENV = /\\begin\{(equation|align|gather|multline)\}/
const LABEL_RE = /\\label\{([^}]*)\}/g
// The name may contain dots/hyphens internally but must end on a word
// character, so a sentence period after "@cite:key." stays outside the token.
const REF_TOKEN = new RegExp(
  `@(${REF_PREFIXES.join('|')}):([A-Za-z0-9](?:[\\w.-]*\\w)?)`,
  'g',
)

// ---------------------------------------------------------------------------
// Equation helpers (shared with equations.ts so detection stays identical)
// ---------------------------------------------------------------------------

export function isNumberedEquation(value: string): boolean {
  return NUMBERED_ENV.test(value)
}

export function extractEquationLabels(value: string): string[] {
  const labels: string[] = []
  let match: RegExpExecArray | null
  LABEL_RE.lastIndex = 0
  while ((match = LABEL_RE.exec(value)) !== null) {
    const label = match[1].trim()
    if (label) labels.push(label)
  }
  return labels
}

export function stripEquationLabels(value: string): string {
  return value.replace(LABEL_RE, '')
}

// How many equation numbers KaTeX emits for a block, so reference numbers stay
// in sync with KaTeX's page-wide counter. `equation`/`multline` emit one;
// `align`/`gather` number each row (minus `\notag`/`\nonumber`).
export function countEquationNumbers(value: string): number {
  if (/\\begin\{(equation|multline)\}/.test(value)) return 1
  if (/\\begin\{(align|gather)\}/.test(value)) {
    const rows = value.split(/\\\\/).length
    const unnumbered = (value.match(/\\(notag|nonumber)/g) ?? []).length
    return Math.max(1, rows - unnumbered)
  }
  return 0
}

export function equationId(label: string): string {
  return label.startsWith('eq:') ? label : `eq:${label}`
}

// ---------------------------------------------------------------------------
// Small AST/HTML utilities
// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;')
}

function mdastText(value: string): MdastText {
  return { type: 'text', value }
}

function isParent(node: unknown): node is Parent {
  return (
    typeof node === 'object' &&
    node !== null &&
    Array.isArray((node as { children?: unknown }).children)
  )
}

function walkMdast(node: unknown, visit: (node: unknown) => void): void {
  visit(node)
  if (!isParent(node)) return
  for (const child of node.children) walkMdast(child, visit)
}

// ---------------------------------------------------------------------------
// Registry: key -> { id (href target), number, word, paren }, document order
// ---------------------------------------------------------------------------

export type RefEntry = {
  id: string
  number: number
  word: string
  paren: boolean
}

function collectRegistry(root: Root): Map<string, RefEntry> {
  const registry = new Map<string, RefEntry>()
  let figureCount = 0
  let equationCount = 0
  let tableCount = 0
  const theoremCounts = new Map<string, number>()

  walkMdast(root, (node) => {
    if (!node || typeof node !== 'object') return
    const typed = node as { type?: string }

    // Figures: a paragraph whose sole child is an image (mirrors figures()).
    if (
      typed.type === 'paragraph' &&
      isParent(node) &&
      node.children.length === 1 &&
      node.children[0].type === 'image'
    ) {
      figureCount += 1
      const image = node.children[0] as Image
      const title = typeof image.title === 'string' ? image.title.trim() : ''
      if (FIGURE_LABEL.test(title)) {
        registry.set(title, {
          id: title,
          number: figureCount,
          word: 'Figure',
          paren: false,
        })
      }
      return
    }

    // Equations: numbered LaTeX environments in display math. Labels map to the
    // block's first number; the counter advances by however many numbers KaTeX
    // emits so it tracks KaTeX's page-wide counter.
    if (typed.type === 'math') {
      const value = (node as { value?: unknown }).value
      if (typeof value === 'string' && isNumberedEquation(value)) {
        const firstNumber = equationCount + 1
        equationCount += countEquationNumbers(value)
        for (const label of extractEquationLabels(value)) {
          const id = equationId(label)
          registry.set(id, {
            id,
            number: firstNumber,
            word: 'Equation',
            paren: true,
          })
        }
      }
      return
    }

    // Container directives: theorem-like callouts (numbered per type) and
    // `:::table[Caption]{#label}` (numbered as tables).
    if (typed.type === 'containerDirective') {
      const rawName = (node as { name?: unknown }).name
      const name = typeof rawName === 'string' ? rawName.toLowerCase() : ''
      const attrs = (node as { attributes?: Record<string, unknown> | null })
        .attributes
      const attrId = typeof attrs?.id === 'string' ? attrs.id : null

      if (name === 'table') {
        tableCount += 1
        if (attrId) {
          const id = `tbl:${attrId}`
          registry.set(id, {
            id,
            number: tableCount,
            word: 'Table',
            paren: false,
          })
        }
        return
      }

      const config = THEOREM_TYPES[name]
      if (config) {
        const next = (theoremCounts.get(config.prefix) ?? 0) + 1
        theoremCounts.set(config.prefix, next)
        if (attrId) {
          registry.set(attrId, {
            id: attrId,
            number: next,
            word: config.word,
            paren: false,
          })
        }
      }
      return
    }
  })

  return registry
}

// ---------------------------------------------------------------------------
// Reference rewriting (generalized from figures.ts to all kinds)
// ---------------------------------------------------------------------------

function refAnchor(prefix: string, entry: RefEntry): Html {
  if (prefix === 'cite') {
    return {
      type: 'html',
      value: `<sup class="cite"><a href="#${escapeAttr(entry.id)}">${entry.number}</a></sup>`,
    }
  }

  const text = entry.paren
    ? `${entry.word} (${entry.number})`
    : `${entry.word} ${entry.number}`
  return {
    type: 'html',
    value: `<a href="#${escapeAttr(entry.id)}" class="xref xref-${prefix}">${text}</a>`,
  }
}

type TextDirective = PhrasingContent & { type: 'textDirective'; name?: unknown }

function textDirectiveName(node: unknown): string | null {
  if (
    typeof node !== 'object' ||
    node === null ||
    (node as { type?: unknown }).type !== 'textDirective'
  ) {
    return null
  }
  const name = (node as TextDirective).name
  return typeof name === 'string' ? name : null
}

function endingRefPrefix(value: string): string | null {
  for (const prefix of REF_PREFIXES) {
    if (value.endsWith(`@${prefix}`)) return prefix
  }
  return null
}

function splitReferences(
  value: string,
  registry: Map<string, RefEntry>,
): PhrasingContent[] | null {
  const nodes: PhrasingContent[] = []
  let lastIndex = 0
  let found = false

  for (const match of value.matchAll(REF_TOKEN)) {
    const prefix = match[1]
    const id = `${prefix}:${match[2]}`
    const entry = registry.get(id)
    if (!entry) continue

    const index = match.index ?? 0
    if (index > lastIndex) nodes.push(mdastText(value.slice(lastIndex, index)))
    nodes.push(refAnchor(prefix, entry))
    lastIndex = index + match[0].length
    found = true
  }

  if (!found) return null
  if (lastIndex < value.length) nodes.push(mdastText(value.slice(lastIndex)))
  return nodes
}

function rewriteReferences(
  node: unknown,
  registry: Map<string, RefEntry>,
): boolean {
  if (!isParent(node)) return false

  const typedNode = node as Parent & { type?: string }
  if (
    typedNode.type === 'link' ||
    typedNode.type === 'linkReference' ||
    typedNode.type === 'image' ||
    typedNode.type === 'imageReference'
  ) {
    return false
  }

  const rewritten: Parent['children'] = []
  let changed = false

  for (let index = 0; index < typedNode.children.length; index += 1) {
    const child = typedNode.children[index]

    if (child.type === 'text') {
      const value = (child as MdastText).value
      // Edge case: `@fig:foo` where `:foo` was parsed as a text directive,
      // leaving the text ending in `@fig` and a following directive node.
      const prefix = endingRefPrefix(value)
      const nextName = textDirectiveName(typedNode.children[index + 1])

      if (prefix && nextName) {
        const id = `${prefix}:${nextName}`
        const entry = registry.get(id)
        const head = value.slice(0, value.length - `@${prefix}`.length)

        if (entry) {
          if (head) rewritten.push(mdastText(head))
          rewritten.push(refAnchor(prefix, entry))
        } else {
          rewritten.push(mdastText(`${head}@${id}`))
        }

        changed = true
        index += 1
        continue
      }

      const replacement = splitReferences(value, registry)
      if (replacement) {
        rewritten.push(...replacement)
        changed = true
        continue
      }
    }

    changed = rewriteReferences(child, registry) || changed
    rewritten.push(child)
  }

  if (changed) typedNode.children = rewritten
  return changed
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

type MdastContext = { readonly source: string; readonly filename?: string }

// Citations resolve against the global bibliography (every `references.bib`
// under src/content — see src/lib/bibliography.ts). Numbers are assigned per
// document in order of first `@cite:` appearance, matching the References
// section rendered by References.astro via getCitationEntries().
function addCitations(registry: Map<string, RefEntry>, source: string): void {
  const bib = loadGlobalBibliography()
  let number = 0
  for (const key of citedKeys(source)) {
    if (!bib.has(key)) continue // unresolved token leaks; the checker reports it
    number += 1
    registry.set(`cite:${key}`, {
      id: `ref-${number}`,
      number,
      word: 'Reference',
      paren: false,
    })
  }
}

export function crossReferences() {
  let cachedKey: string | null = null
  let cachedRegistry = new Map<string, RefEntry>()

  const registryFor = (
    source: string,
    filename: string | undefined,
  ): Map<string, RefEntry> => {
    const key = `${filename ?? ''} ${source}`
    if (key === cachedKey) return cachedRegistry
    cachedKey = key
    cachedRegistry = collectRegistry(
      markdownToMdast(source, {
        features: { directive: true, math: true },
      }) as Root,
    )
    addCitations(cachedRegistry, source)
    return cachedRegistry
  }

  return defineMdastPlugin({
    name: 'cross-references',
    paragraph(node: Paragraph, ctx: MdastContext) {
      const hasPossibleReference = node.children.some((child, index) => {
        if (child.type === 'text' && child.value.includes('@')) return true
        const value = child.type === 'text' ? child.value : ''
        return (
          endingRefPrefix(value) !== null &&
          textDirectiveName(node.children[index + 1]) !== null
        )
      })

      if (!hasPossibleReference) return

      const registry = registryFor(ctx.source, ctx.filename)
      if (registry.size === 0) return
      if (!rewriteReferences(node, registry)) return

      return { ...node } satisfies Paragraph
    },
  })
}
