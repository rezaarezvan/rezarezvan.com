import { defineMdastPlugin } from 'satteri'
import katex from 'katex'
import {
  equationId,
  extractEquationLabels,
  isNumberedEquation,
  stripEquationLabels,
} from './references'

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

// KaTeX numbers `\begin{equation}`/`align`/… itself, sequencing across the page
// via a CSS counter (`body { counter-reset: katexEqnNo }`). So we leave the
// numbering to KaTeX and only intercept *labeled* equations: KaTeX can't parse
// `\label{}`, so we strip it, render, and wrap the result in an anchorable
// `<div class="equation" id="eq:label">` so `@eq:label` references can link to
// it. The displayed number stays KaTeX's; references.ts re-derives the same
// number from document order. Unlabeled equations fall through to katexMath
// (this plugin must run before it).
export function equationNumbering() {
  return defineMdastPlugin({
    name: 'equation-numbering',
    math(node, ctx) {
      const value = node.value
      if (typeof value !== 'string' || !isNumberedEquation(value)) return

      const labels = extractEquationLabels(value)
      if (labels.length === 0) return

      const id = equationId(labels[0])

      try {
        const rendered = katex.renderToString(stripEquationLabels(value), {
          displayMode: true,
          strict: 'ignore',
          throwOnError: false,
          trust: (context) => context.command === '\\htmlClass',
        })

        return {
          type: 'html',
          value: `<div class="equation" id="${escapeAttr(id)}">${rendered}</div>`,
        }
      } catch (error) {
        ctx.report({
          message: `equation-numbering: failed on \`${value}\`: ${errorMessage(error)}`,
          node,
          severity: 'warning',
        })
      }
    },
  })
}
