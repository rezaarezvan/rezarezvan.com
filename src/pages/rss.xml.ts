import { SITE } from '@/consts'
import { getAllEssays } from '@/lib/essay-utils'
import { plainInlineMath } from '@/lib/math-utils'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  try {
    const essays = await getAllEssays()

    return rss({
      title: SITE.title,
      description: SITE.description,
      site: context.site ?? SITE.href,
      items: essays.map((essay) => ({
        title: plainInlineMath(essay.data.title),
        description: essay.data.description,
        pubDate: essay.data.date,
        link: `/essays/${essay.id}/`,
      })),
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
