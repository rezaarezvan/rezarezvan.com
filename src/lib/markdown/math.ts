import { defineMdastPlugin } from 'satteri'
import katex from 'katex'

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function katexMath() {
  return defineMdastPlugin({
    name: 'katex-math',
    inlineMath(node, ctx) {
      try {
        return {
          type: 'html',
          value: katex.renderToString(node.value, {
            strict: 'ignore',
            throwOnError: false,
            trust: (context) => context.command === '\\htmlClass',
          }),
        }
      } catch (error) {
        ctx.report({
          message: `katex-math: failed on \`${node.value}\`: ${errorMessage(error)}`,
          node,
          severity: 'warning',
        })
      }
    },
    math(node, ctx) {
      try {
        return {
          type: 'html',
          value: katex.renderToString(node.value, {
            displayMode: true,
            strict: 'ignore',
            throwOnError: false,
            trust: (context) => context.command === '\\htmlClass',
          }),
        }
      } catch (error) {
        ctx.report({
          message: `katex-math: failed on \`${node.value}\`: ${errorMessage(error)}`,
          node,
          severity: 'warning',
        })
      }
    },
  })
}
