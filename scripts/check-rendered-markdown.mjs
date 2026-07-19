import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? '.astro/build-test')
const textExtensions = new Set(['.html', '.css', '.js', '.xml'])
const htmlExtensions = new Set(['', '.html', '.htm'])
const siteOrigin = 'https://rezarezvan.com'

function walk(dir) {
  if (!existsSync(dir)) return []

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function excerpt(content, index) {
  const start = Math.max(0, index - 80)
  const end = Math.min(content.length, index + 120)
  return content.slice(start, end).replace(/\s+/g, ' ').trim()
}

function routeFor(file) {
  const path = relative(root, file).replaceAll('\\', '/')
  if (path === 'index.html') return '/'
  if (path.endsWith('/index.html')) return `/${path.slice(0, -10)}`
  return `/${path}`
}

function fileFor(pathname) {
  let decoded
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return null
  }

  const path = decoded.replace(/^\/+/, '')
  const candidates = extname(path)
    ? [join(root, path)]
    : [join(root, path, 'index.html'), join(root, `${path}.html`)]

  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

const files = walk(root).filter((file) => textExtensions.has(extname(file)))
const htmlFiles = files.filter((file) => extname(file) === '.html')
const failures = []
const aggregate = []
const idsByFile = new Map()

function fail(file, check, content = '', index = 0) {
  failures.push({
    file: relative(process.cwd(), file),
    check,
    excerpt: content ? excerpt(content, index) : '',
  })
}

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  aggregate.push(content)

  const checks = [
    {
      name: 'legacy callout marker leaked',
      pattern:
        /\[!(?:NOTE|TIP|WARNING|CAUTION|IMPORTANT|DEFINITION|AXIOM|NOTATION|THEOREM|LEMMA|COROLLARY|PROPOSITION|CONJECTURE|PROOF|REMARK|INTUITION|RECALL|EXAMPLE|EXPLANATION|EXERCISE|PROBLEM|ANSWER|SOLUTION|SUMMARY|ALGORITHM|DERIVATION)(?:[/\]])/g,
    },
    { name: 'margin note source leaked', pattern: /::margin\[/g },
    { name: 'KaTeX client rendering leaked', pattern: /renderMathInElement/gi },
    { name: 'KaTeX render error', pattern: /class="katex-error"/g },
    {
      name: 'empty math element emitted',
      pattern: /<math(?:\s[^>]*)?><\/math>/g,
    },
    {
      name: 'unresolved cross-reference leaked',
      pattern:
        /@(?:fig|eq|tbl|thm|def|lem|cor|prop|conj|ax|ex|exer|prob|rem|cite):[A-Za-z0-9][\w.-]*/g,
    },
  ]

  for (const check of checks) {
    for (const match of content.matchAll(check.pattern)) {
      fail(file, check.name, content, match.index ?? 0)
    }
  }

  if (extname(file) !== '.html') continue

  const ids = new Set()
  for (const match of content.matchAll(/\sid=(?:"([^"]+)"|'([^']+)')/g)) {
    const id = match[1] ?? match[2]
    if (ids.has(id))
      fail(file, `duplicate id: #${id}`, content, match.index ?? 0)
    ids.add(id)
  }
  idsByFile.set(file, ids)

  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(
    content,
  )
  const is404 = relative(root, file).replaceAll('\\', '/') === '404.html'
  if (noindex !== is404) {
    fail(file, is404 ? '404 page is missing noindex' : 'unexpected noindex')
  }

  if (!/<link[^>]+rel="canonical"[^>]+href="https?:\/\//i.test(content)) {
    fail(file, 'canonical URL is missing')
  }

  const hasMath = /class="[^"]*\bkatex\b/.test(content)
  const hasKatexCss = /<link[^>]+href="[^"]*katex\.min[^"?]*\.css/i.test(
    content,
  )
  if (hasMath !== hasKatexCss) {
    fail(
      file,
      hasMath
        ? 'KaTeX output is missing its stylesheet'
        : 'KaTeX stylesheet loaded on a page without math',
    )
  }
}

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf8')
  const route = routeFor(file)

  for (const match of content.matchAll(
    /<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>/gi,
  )) {
    const href = match[1] ?? match[2]
    if (!href || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue

    let url
    try {
      url = new URL(href, `${siteOrigin}${route}`)
    } catch {
      fail(file, `invalid link: ${href}`, content, match.index ?? 0)
      continue
    }

    if (url.origin !== siteOrigin) continue

    const targetFile = fileFor(url.pathname)
    if (!targetFile) {
      fail(file, `broken internal link: ${href}`, content, match.index ?? 0)
      continue
    }

    if (!url.hash || !htmlExtensions.has(extname(targetFile))) continue

    let fragment
    try {
      fragment = decodeURIComponent(url.hash.slice(1))
    } catch {
      fail(file, `invalid fragment: ${href}`, content, match.index ?? 0)
      continue
    }

    const targetIds = idsByFile.get(targetFile)
    if (targetIds && !targetIds.has(fragment)) {
      fail(file, `missing fragment target: ${href}`, content, match.index ?? 0)
    }
  }
}

const site = aggregate.join('\n')
const expectations = [
  {
    name: 'callout details were rendered',
    pattern: /<details[^>]+data-callout=/,
  },
  { name: 'KaTeX accessibility MathML was rendered', pattern: /<math(?:\s|>)/ },
  {
    name: 'external links were annotated',
    pattern:
      /<a [^>]*href="https?:\/\/[^\"]+"[^>]*target="_blank"[^>]*rel="noreferrer noopener"/,
  },
  {
    name: 'figure captions were rendered',
    pattern:
      /<figure class="astro-figure">[\s\S]*<figcaption>[^<]+<\/figcaption>[\s\S]*<\/figure>/,
  },
]

for (const expectation of expectations) {
  if (!expectation.pattern.test(site)) {
    failures.push({
      file: relative(process.cwd(), root),
      check: `missing expected output: ${expectation.name}`,
      excerpt: '',
    })
  }
}

if (failures.length > 0) {
  console.error(`Rendered site checks failed for ${root}:`)
  for (const failure of failures) {
    console.error(`\n- ${failure.check}`)
    console.error(`  ${failure.file}`)
    if (failure.excerpt) console.error(`  ${failure.excerpt}`)
  }
  process.exit(1)
}

const bytes = files.reduce((total, file) => total + statSync(file).size, 0)
console.log(
  `Rendered site checks passed for ${htmlFiles.length} pages and ${files.length} text files (${Math.round(bytes / 1024)} KiB).`,
)
