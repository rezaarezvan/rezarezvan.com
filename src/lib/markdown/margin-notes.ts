import type {
  Delete,
  Emphasis,
  Html,
  InlineCode,
  Link,
  Paragraph,
  PhrasingContent,
  Strong,
  Text,
} from 'mdast'
import { defineMdastPlugin } from 'satteri'
import katex from 'katex'

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

function textNode(value: string): Text {
  return { type: 'text', value }
}

function htmlNode(value: string): Html {
  return { type: 'html', value }
}

function cloneInlineNode(node: PhrasingContent): PhrasingContent {
  const maybeValueNode = node as PhrasingContent & { value?: unknown }

  if (node.type === 'inlineMath' && typeof maybeValueNode.value === 'string') {
    return htmlNode(
      katex.renderToString(maybeValueNode.value, {
        strict: 'ignore',
        throwOnError: false,
      }),
    )
  }

  switch (node.type) {
    case 'text':
      return textNode(node.value)
    case 'html':
      return htmlNode(node.value)
    case 'inlineCode':
      return { type: 'inlineCode', value: (node as InlineCode).value }
    case 'emphasis':
      return {
        type: 'emphasis',
        children: (node as Emphasis).children.map(cloneInlineNode),
      }
    case 'strong':
      return {
        type: 'strong',
        children: (node as Strong).children.map(cloneInlineNode),
      }
    case 'delete':
      return {
        type: 'delete',
        children: (node as Delete).children.map(cloneInlineNode),
      }
    case 'link': {
      const link = node as Link
      return {
        type: 'link',
        url: link.url,
        title: link.title,
        children: link.children.map(cloneInlineNode),
      }
    }
    case 'break':
      return { type: 'break' }
    default:
      return node
  }
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
      const title = link.title ? ` title="${escapeAttr(link.title)}"` : ''
      return `<a href="${escapeAttr(link.url)}"${title}>${renderInline(link.children)}</a>`
    }
    case 'break':
      return '<br />'
    default:
      return escapeHtml(
        typeof maybeValueNode.value === 'undefined'
          ? ''
          : String(maybeValueNode.value),
      )
  }
}

function createSidenote(counter: number, content: PhrasingContent[]): Html {
  const id = `sn-${counter}`
  const body = renderInline(content).trim()

  return htmlNode(
    [
      `<label for="${id}" class="sidenote-toggle sidenote-number" aria-describedby="${id}-note">${counter}</label>`,
      `<input type="checkbox" id="${id}" class="sidenote-checkbox" aria-label="Toggle sidenote ${counter}" />`,
      `<span class="sidenote" role="note" id="${id}-note">`,
      `<span class="sidenote-number-inline">${counter}</span>`,
      body,
      '</span>',
    ].join(''),
  )
}

function processInlineChildren(
  children: PhrasingContent[],
  nextCounter: () => number,
): PhrasingContent[] {
  const output: PhrasingContent[] = []
  let index = 0

  while (index < children.length) {
    const child = children[index]

    if (child.type !== 'text') {
      output.push(cloneInlineNode(child))
      index += 1
      continue
    }

    const start = child.value.indexOf('::margin[')
    if (start === -1) {
      output.push(cloneInlineNode(child))
      index += 1
      continue
    }

    if (start > 0) output.push(textNode(child.value.slice(0, start)))

    const parts: PhrasingContent[] = []
    let depth = 1
    let cursor = start + '::margin['.length
    let endIndex = -1

    while (cursor < child.value.length) {
      const character = child.value[cursor]
      if (character === '[') depth += 1
      if (character === ']') depth -= 1
      if (depth === 0) {
        endIndex = cursor
        break
      }
      cursor += 1
    }

    if (endIndex !== -1) {
      parts.push(
        textNode(child.value.slice(start + '::margin['.length, endIndex)),
      )
      output.push(createSidenote(nextCounter(), parts))
      const after = child.value.slice(endIndex + 1)
      const remainingChildren: PhrasingContent[] = []
      if (after) remainingChildren.push(textNode(after))
      remainingChildren.push(...children.slice(index + 1))
      output.push(...processInlineChildren(remainingChildren, nextCounter))
      return output
    }

    const initial = child.value.slice(start + '::margin['.length)
    if (initial) parts.push(textNode(initial))

    let scanIndex = index + 1
    let found = false

    while (scanIndex < children.length && !found) {
      const candidate = children[scanIndex]

      if (candidate.type !== 'text') {
        parts.push(cloneInlineNode(candidate))
        scanIndex += 1
        continue
      }

      let textCursor = 0
      while (textCursor < candidate.value.length) {
        const character = candidate.value[textCursor]
        if (character === '[') depth += 1
        if (character === ']') depth -= 1
        if (depth === 0) {
          found = true
          break
        }
        textCursor += 1
      }

      if (found) {
        if (textCursor > 0) {
          parts.push(textNode(candidate.value.slice(0, textCursor)))
        }
        output.push(createSidenote(nextCounter(), parts))
        const after = candidate.value.slice(textCursor + 1)
        const remainingChildren: PhrasingContent[] = []
        if (after) remainingChildren.push(textNode(after))
        remainingChildren.push(...children.slice(scanIndex + 1))
        output.push(...processInlineChildren(remainingChildren, nextCounter))
        return output
      } else {
        parts.push(cloneInlineNode(candidate))
        scanIndex += 1
      }
    }

    if (!found) {
      output.push(child)
      index += 1
    }
  }

  return output
}

export function marginNotes() {
  let counter = 0
  const nextCounter = () => {
    counter += 1
    return counter
  }

  return defineMdastPlugin({
    name: 'margin-notes',
    paragraph(node) {
      if (
        !Array.isArray(node.children) ||
        !node.children.some(
          (child) => child.type === 'text' && child.value.includes('::margin['),
        )
      ) {
        return
      }

      return {
        type: 'paragraph',
        children: processInlineChildren(node.children, nextCounter),
      } satisfies Paragraph
    },
  })
}
