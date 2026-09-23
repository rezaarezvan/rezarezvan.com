import { defineMdastPlugin } from 'satteri'
import { labelFromDirective } from './tables'

// `:::algorithm[Caption]{#alg:label}` -> numbered `<figure class="algorithm">`.
export function algorithmDirectives() {
  const counters = new Map<string, number>()

  return defineMdastPlugin({
    name: 'algorithm-directives',
    containerDirective(node, ctx) {
      if (node.name.toLowerCase() !== 'algorithm') return

      const source = ctx.source ?? ''
      const number = (counters.get(source) ?? 0) + 1
      counters.set(source, number)

      const id =
        typeof node.attributes?.id === 'string'
          ? node.attributes.id
          : `alg-${number}`
      const prefix = `<span class="algorithm-number">Algorithm ${number}:</span>`
      const label = labelFromDirective(node as never)

      if (label) {
        ctx.setProperty(label, 'data', { hName: 'figcaption' } as never)
        ctx.prependChild(label, { type: 'html', value: `${prefix} ` })
      } else {
        ctx.prependChild(node, {
          type: 'html',
          value: `<figcaption>${prefix}</figcaption>`,
        })
      }

      ctx.setProperty(node, 'data', {
        hName: 'figure',
        hProperties: { className: ['algorithm'], id },
      } as never)
    },
  })
}
