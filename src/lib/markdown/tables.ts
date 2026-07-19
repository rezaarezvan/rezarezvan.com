import type { Html, Paragraph } from 'mdast'
import { defineMdastPlugin } from 'satteri'
import { renderLabelNodes } from './callouts'

type DirectiveNode = {
  type: string
  name?: string
  attributes?: Record<string, unknown> | null
  children?: unknown[]
}

function captionFromLabel(node: DirectiveNode): string | null {
  if (!Array.isArray(node.children)) return null

  const first = node.children[0] as Paragraph | undefined
  const isLabel =
    first?.type === 'paragraph' &&
    (first.data as { directiveLabel?: boolean } | undefined)?.directiveLabel ===
      true

  if (!isLabel || !Array.isArray(first.children)) return null
  return renderLabelNodes(first.children)
}

type MaybeNode = { type?: string; children?: unknown[]; value?: unknown }

function cellText(cell: MaybeNode): string {
  if (!Array.isArray(cell.children)) return ''
  return cell.children
    .map((c) =>
      (c as MaybeNode).type === 'text'
        ? String((c as MaybeNode).value ?? '')
        : '',
    )
    .join('')
    .trim()
}

// Without a blank line before the closing `:::`, a GFM table swallows the fence
// as a final one-cell row (`| ::: |`). Drop that artifact row so authors don't
// have to remember the blank line.
function stripFenceArtifactRow(
  node: DirectiveNode,
  ctx: { removeNode: (n: never) => void },
): void {
  if (!Array.isArray(node.children)) return
  const table = node.children.find((c) => (c as MaybeNode).type === 'table') as
    | MaybeNode
    | undefined
  if (!table || !Array.isArray(table.children)) return

  const lastRow = table.children[table.children.length - 1] as MaybeNode
  if (
    !lastRow ||
    lastRow.type !== 'tableRow' ||
    !Array.isArray(lastRow.children)
  ) {
    return
  }
  if (
    lastRow.children.length === 1 &&
    cellText(lastRow.children[0] as MaybeNode) === ':::'
  ) {
    ctx.removeNode(lastRow as never)
  }
}

// Wraps a `:::table[Caption]{#label}` directive into a numbered, anchorable
// `<figure class="table-figure" id="tbl:label">` with a `<figcaption>Table N:
// Caption</figcaption>`. A container directive (rather than a Pandoc-style
// `{#tbl:label}` caption line) is used because a bare `:label` in markdown is
// parsed as a text directive and mangled. Numbering matches references.ts.
export function tableDirectives() {
  const counters = new Map<string, number>()

  return defineMdastPlugin({
    name: 'table-directives',
    containerDirective(node, ctx) {
      if (node.name.toLowerCase() !== 'table') return

      const caption = captionFromLabel(node as DirectiveNode)
      if (caption !== null && Array.isArray(node.children)) {
        ctx.removeNode(node.children[0])
      }

      stripFenceArtifactRow(node as DirectiveNode, ctx)

      const source = ctx.source ?? ''
      const number = (counters.get(source) ?? 0) + 1
      counters.set(source, number)

      const rawId =
        typeof node.attributes?.id === 'string' ? node.attributes.id : null
      const id = rawId ? `tbl:${rawId}` : `tbl-${number}`

      const figcaption: Html = {
        type: 'html',
        value: `<figcaption><span class="table-number">Table ${number}:</span> ${caption ?? ''}</figcaption>`,
      }
      // Caption above the table (ML-paper convention).
      ctx.prependChild(node, figcaption)

      ctx.setProperty(node, 'data', {
        hName: 'figure',
        hProperties: { className: ['table-figure'], id },
      } as never)
    },
  })
}
