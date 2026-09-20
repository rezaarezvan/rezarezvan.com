import { defineHastPlugin } from 'satteri'

type LinkKind =
  | 'arxiv'
  | 'doi'
  | 'github'
  | 'pdf'
  | 'twitter'
  | 'wikipedia'
  | 'youtube'

function getLinkKind(href: string): LinkKind | undefined {
  let url: URL

  try {
    url = new URL(href)
  } catch {
    return
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
  const pathname = url.pathname.toLowerCase()

  if (pathname.endsWith('.pdf')) return 'pdf'
  if (hostname === 'arxiv.org' || hostname.endsWith('.arxiv.org'))
    return 'arxiv'
  if (hostname === 'doi.org' || hostname.endsWith('.doi.org')) return 'doi'
  if (hostname === 'github.com' || hostname.endsWith('.github.com'))
    return 'github'
  if (hostname === 'twitter.com' || hostname === 'x.com') return 'twitter'
  if (hostname === 'youtu.be' || hostname.endsWith('.youtube.com'))
    return 'youtube'
  if (hostname === 'wikipedia.org' || hostname.endsWith('.wikipedia.org')) {
    return 'wikipedia'
  }
}

export const externalLinks = defineHastPlugin({
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties.href
      if (typeof href !== 'string' || !/^https?:\/\//.test(href)) return

      ctx.setProperty(node, 'target', '_blank')
      ctx.setProperty(node, 'rel', 'noreferrer noopener')

      const linkKind = getLinkKind(href)
      if (linkKind) ctx.setProperty(node, 'dataLinkKind', linkKind)
    },
  },
})
