import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import { markdownToMdast } from 'satteri'

const NUMBERED_ENVIRONMENT = /\\begin\{(equation|align|gather|multline)\}/
const LABEL = /\\label\{([^}]*)\}/g
const VALID_EQUATION_LABEL = /^eq:[A-Za-z0-9][A-Za-z0-9_-]*$/

function walk(node, visit) {
  visit(node)
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return
  for (const child of node.children) walk(child, visit)
}

function lineFor(node) {
  return node?.position?.start?.line ?? 1
}

function equationLabels(value) {
  return [...value.matchAll(LABEL)].map((match) => match[1].trim())
}

function hasReference(source, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`@${escaped}(?![A-Za-z0-9_-])`).test(source)
}

export function auditMarkdown(source, filename = '<markdown>') {
  const failures = []
  const root = markdownToMdast(source, {
    features: { directive: true, math: true },
  })

  walk(root, (node) => {
    if (
      !['inlineMath', 'math'].includes(node?.type) ||
      typeof node.value !== 'string'
    )
      return

    const location = `${filename}:${lineFor(node)}`
    try {
      katex.renderToString(node.value.replace(LABEL, ''), {
        displayMode: node.type === 'math',
        strict: 'ignore',
        throwOnError: true,
        trust: (context) => context.command === '\\htmlClass',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failures.push(`${location}: invalid KaTeX: ${message}`)
      return
    }

    if (node.type !== 'math') return
    if (!NUMBERED_ENVIRONMENT.test(node.value)) return

    const labels = equationLabels(node.value)

    if (labels.length === 0) {
      failures.push(
        `${location}: numbered equation has no label; use plain $$...$$ or a starred environment`,
      )
      return
    }

    if (labels.length > 1) {
      failures.push(
        `${location}: numbered equation has ${labels.length} labels; use exactly one`,
      )
      return
    }

    const [label] = labels
    if (!VALID_EQUATION_LABEL.test(label)) {
      failures.push(
        `${location}: invalid equation label "${label}"; expected eq:name-with-hyphens`,
      )
      return
    }

    if (!hasReference(source, label)) {
      failures.push(
        `${location}: ${label} is never referenced; remove its numbering and label`,
      )
    }
  })

  return failures
}

function markdownFiles(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name)
    if (entry.isDirectory()) return markdownFiles(path)
    return extname(path) === '.md' ? [path] : []
  })
}

function main() {
  const root = process.argv[2] ?? 'src/content'
  const failures = markdownFiles(root).flatMap((file) =>
    auditMarkdown(readFileSync(file, 'utf8'), relative(process.cwd(), file)),
  )

  if (failures.length > 0) {
    console.error('Equation reference checks failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }

  console.log(
    `Equation reference checks passed for ${markdownFiles(root).length} files.`,
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
