import type { FootnoteDefinition, FootnoteReference, Html, Root } from 'mdast'
import { defineMdastPlugin } from 'satteri'
import type { MdastNode } from 'satteri'

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalized(identifier: string): string {
  return identifier.trim().toLowerCase()
}

function safeId(identifier: string): string {
  const value = normalized(identifier)
    .normalize('NFKD')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return value || 'note'
}

function childrenOf(node: MdastNode): readonly MdastNode[] {
  return 'children' in node && Array.isArray(node.children)
    ? (node.children as readonly MdastNode[])
    : []
}

function documentRoot(node: MdastNode, parent: (node: MdastNode) => unknown) {
  let current = node
  while (current.type !== 'root') {
    const next = parent(current)
    if (!next || typeof next !== 'object') break
    current = next as MdastNode
  }
  return current as Root
}

/**
 * Satteri currently counts GFM footnotes inside directives but cannot render
 * their reference nodes once the directive becomes a component. Rendering the
 * small, standard HTML structure here keeps `[^id]` genuinely universal: the
 * same syntax works in prose, callouts, captions, lists, and blockquotes.
 */
export function footnotes() {
  const numberById = new Map<string, number>()
  const referenceCountById = new Map<string, number>()
  const referenceVisitById = new Map<string, number>()
  const outputIdById = new Map<string, string>()
  let usedDefinitions: FootnoteDefinition[] = []
  let appendAnchor: MdastNode | undefined
  let indexed = false
  let sectionEmitted = false

  function indexDocument(
    node: MdastNode,
    ctx: { parent: (node: never) => unknown },
  ) {
    if (indexed) return
    indexed = true
    const root = documentRoot(node, (current) => ctx.parent(current as never))
    const definitions: FootnoteDefinition[] = []
    const occupiedIds = new Set<string>()

    const visit = (current: MdastNode) => {
      if (current.type === 'footnoteReference') {
        const id = normalized((current as FootnoteReference).identifier)
        if (!numberById.has(id)) {
          numberById.set(id, numberById.size + 1)
          const base = safeId(id)
          let output = base
          let suffix = 2
          while (occupiedIds.has(output)) output = `${base}-${suffix++}`
          occupiedIds.add(output)
          outputIdById.set(id, output)
        }
        referenceCountById.set(id, (referenceCountById.get(id) ?? 0) + 1)
      } else if (current.type === 'footnoteDefinition') {
        definitions.push(current as FootnoteDefinition)
      }

      for (const child of childrenOf(current)) visit(child)
    }

    visit(root as unknown as MdastNode)
    usedDefinitions = definitions
      .filter((definition) => numberById.has(normalized(definition.identifier)))
      .sort(
        (left, right) =>
          (numberById.get(normalized(left.identifier)) ?? 0) -
          (numberById.get(normalized(right.identifier)) ?? 0),
      )
    appendAnchor = [...childrenOf(root as unknown as MdastNode)]
      .reverse()
      .find((child) => child.type !== 'footnoteDefinition')
  }

  function backlinks(id: string, number: number, outputId: string): Html {
    const count = referenceCountById.get(id) ?? 1
    return {
      type: 'html',
      value: Array.from({ length: count }, (_, index) => {
        const occurrence = index + 1
        const referenceId = `user-content-fnref-${outputId}${occurrence > 1 ? `-${occurrence}` : ''}`
        const label = `Back to reference ${number}${occurrence > 1 ? `-${occurrence}` : ''}`
        return `<a href="#${escapeAttribute(referenceId)}" data-footnote-backref="" aria-label="${escapeAttribute(label)}" class="data-footnote-backref">↩</a>`
      }).join(' '),
    }
  }

  function footnoteSection(): MdastNode {
    const items = usedDefinitions.map((definition) => {
      const id = normalized(definition.identifier)
      const number = numberById.get(id)!
      const outputId = outputIdById.get(id)!
      return {
        type: 'containerDirective',
        name: 'generated-footnote',
        attributes: {},
        children: [...definition.children, backlinks(id, number, outputId)],
        data: {
          hName: 'li',
          hProperties: {
            id: `user-content-fn-${outputId}`,
            value: number,
          },
        },
      }
    })

    return {
      type: 'containerDirective',
      name: 'generated-footnotes',
      attributes: {},
      children: [
        {
          type: 'html',
          value: '<h2 class="sr-only" id="footnote-label">Footnotes</h2>',
        },
        {
          type: 'containerDirective',
          name: 'generated-footnote-list',
          attributes: {},
          children: items,
          data: { hName: 'ol' },
        },
      ],
      data: {
        hName: 'section',
        hProperties: {
          dataFootnotes: '',
          className: ['footnotes'],
        },
      },
    } as MdastNode
  }

  return defineMdastPlugin({
    name: 'directive-safe-footnotes',
    footnoteReference(node, ctx) {
      indexDocument(node as MdastNode, ctx as never)
      const id = normalized(node.identifier)
      const number = numberById.get(id)
      const outputId = outputIdById.get(id)
      if (!number || !outputId) return

      const occurrence = (referenceVisitById.get(id) ?? 0) + 1
      referenceVisitById.set(id, occurrence)
      const referenceId = `user-content-fnref-${outputId}${occurrence > 1 ? `-${occurrence}` : ''}`
      const html: Html = {
        type: 'html',
        value: `<sup><a href="#user-content-fn-${escapeAttribute(outputId)}" id="${escapeAttribute(referenceId)}" data-footnote-ref aria-describedby="footnote-label">${number}</a></sup>`,
      }
      ctx.replaceNode(node, html)
    },
    footnoteDefinition(node, ctx) {
      indexDocument(node as MdastNode, ctx as never)
      let replaced = false
      if (!sectionEmitted && usedDefinitions.length > 0) {
        sectionEmitted = true
        if (appendAnchor) ctx.insertAfter(appendAnchor, footnoteSection())
        else {
          ctx.replaceNode(node, footnoteSection())
          replaced = true
        }
      }
      if (!replaced) ctx.removeNode(node)
    },
  })
}
