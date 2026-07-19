import type { Element, ElementContent } from 'hast'
import { h } from 'hastscript'
import { defineHastPlugin } from 'satteri'

const FIGURE_LABEL = /^fig:[A-Za-z0-9][\w:.-]*$/

function text(value: string) {
  return { type: 'text' as const, value }
}

function figureLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const label = value.trim()
  return FIGURE_LABEL.test(label) ? label : null
}

function cloneElement(node: Readonly<Element>): Element {
  return {
    type: 'element',
    tagName: node.tagName,
    properties: { ...node.properties },
    children: Array.isArray(node.children)
      ? (node.children as ElementContent[])
      : [],
  }
}

// Wraps a standalone image (a paragraph containing only an `<img>`) in a
// `<figure>` with a `<figcaption>`. When the image title is a `fig:` label the
// figure gets that id so `@fig:` cross-references (see references.ts) can link
// to it; the visible "Figure N:" prefix is added via CSS counters
// (src/styles/sidenotes.css).
export function figures() {
  return defineHastPlugin({
    name: 'figures',
    element: {
      filter: ['p'],
      visit(node) {
        if (!Array.isArray(node.children) || node.children.length !== 1) return

        const image = node.children[0]
        if (image.type !== 'element' || image.tagName !== 'img') return

        const alt =
          typeof image.properties.alt === 'string'
            ? image.properties.alt.trim()
            : ''
        const title =
          typeof image.properties.title === 'string'
            ? image.properties.title.trim()
            : ''
        const label = figureLabel(title)
        const caption = label ? alt : title || alt
        const figureImage = cloneElement(image)

        if (label) {
          delete figureImage.properties.title
        }

        const children: ElementContent[] = [figureImage]

        if (caption) {
          children.push(h('figcaption', [text(caption)]) as Element)
        }

        return h(
          'figure',
          { class: 'astro-figure', id: label ?? undefined },
          children,
        ) as Element
      },
    },
  })
}
