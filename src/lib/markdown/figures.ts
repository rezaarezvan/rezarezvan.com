import type { Element, ElementContent } from 'hast'
import { h } from 'hastscript'
import katex from 'katex'
import { defineHastPlugin, defineMdastPlugin } from 'satteri'

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

// The parser drops inline math from `alt`; keep the raw source for captions.
export function figureCaptions() {
  return defineMdastPlugin({
    name: 'figure-captions',
    options: { position: true },
    image(node, ctx) {
      const { start, end } = node.position ?? {}
      if (start?.offset == null || end?.offset == null) return
      const raw = ctx.source
        ?.slice(start.offset, end.offset)
        .match(/^!\[([\s\S]*)\]\(/)?.[1]
      if (!raw?.includes('$')) return
      ctx.setProperty(node, 'alt', raw)
    },
  })
}

function captionChildren(caption: string): ElementContent[] {
  return caption.split(/(\$[^$]+\$)/).map((part) =>
    part.startsWith('$') && part.endsWith('$') && part.length > 2
      ? ({
          type: 'raw',
          value: katex.renderToString(part.slice(1, -1), {
            strict: 'ignore',
            throwOnError: false,
          }),
        } as never)
      : text(part),
  )
}

// Wraps a standalone image (a paragraph containing only an `<img>`) in a
// `<figure>` with a `<figcaption>`. When the image title is a `fig:` label the
// figure gets that id so `@fig:` cross-references (see references.ts) can link
// to it. Numbers follow document order, matching references.ts.
export function figures() {
  let count = 0

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
        figureImage.properties.alt = alt.replace(/\$/g, '')

        if (label) {
          delete figureImage.properties.title
        }

        const children: ElementContent[] = [figureImage]
        count += 1

        if (caption) {
          children.push(
            h('figcaption', [
              h('span', { class: 'figure-number' }, `Figure ${count}:`),
              text(' '),
              ...captionChildren(caption),
            ]) as Element,
          )
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
