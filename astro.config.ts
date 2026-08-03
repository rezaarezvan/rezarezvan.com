import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'

import { satteri } from '@astrojs/markdown-satteri'
import { calloutDirectives } from './src/lib/markdown/callouts'
import { equationNumbering } from './src/lib/markdown/equations'
import { externalLinks } from './src/lib/markdown/external-links'
import { figures } from './src/lib/markdown/figures'
import { footnotes } from './src/lib/markdown/footnotes'
import { headingAnchors } from './src/lib/markdown/heading-anchors'
import { headingIds } from './src/lib/markdown/heading-ids'
import { katexMath } from './src/lib/markdown/math'
import { crossReferences } from './src/lib/markdown/references'
import { tableDirectives } from './src/lib/markdown/tables'
import {
  blockExpressiveCode,
  inlineExpressiveCode,
} from './src/lib/markdown/expressive-code'

export default defineConfig({
  integrations: [sitemap()],
  site: 'https://rezarezvan.com',
  server: {
    port: 1234,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  compressHTML: true,
  prefetch: { prefetchAll: true },
  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { directive: true, math: true },
      mdastPlugins: [
        headingIds,
        footnotes,
        calloutDirectives,
        tableDirectives,
        inlineExpressiveCode,
        equationNumbering,
        katexMath,
        crossReferences,
      ],
      hastPlugins: [
        externalLinks,
        blockExpressiveCode,
        headingAnchors,
        figures(),
      ],
    }),
  },
})
