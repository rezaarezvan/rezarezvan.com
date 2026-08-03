import type { Heading } from 'mdast'
import GithubSlugger from 'github-slugger'
import { defineMdastPlugin } from 'satteri'

type NodeData = Record<string, unknown> & {
  hProperties?: Record<string, unknown>
}

// Astro collects its table-of-contents metadata after our math plugin has
// rendered inline math to raw KaTeX HTML. Assigning heading ids while the
// semantic MDAST is still intact keeps the rendered heading and Astro's
// metadata on the same human-readable slug.
export function headingIds() {
  const slugger = new GithubSlugger()

  return defineMdastPlugin({
    name: 'heading-ids',
    heading(node: Heading, ctx) {
      const data = (node.data ?? {}) as NodeData
      const hProperties = data.hProperties ?? {}
      const existing = hProperties.id

      if (typeof existing === 'string' && existing) {
        // Reserve explicit ids so later generated headings cannot duplicate
        // them, while leaving the author's chosen id untouched.
        slugger.slug(existing)
        return
      }

      const id = slugger.slug(
        ctx.textContent(node, { includeHtml: false }).trim(),
      )
      if (!id) return

      ctx.setProperty(node, 'data', {
        ...data,
        hProperties: { ...hProperties, id },
      })
    },
  })
}
