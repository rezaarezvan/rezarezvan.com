import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import path from 'node:path'
import { close as closePagefind, createIndex } from 'pagefind'

const checkOnly = process.argv.includes('--check')
const stagingRoot = path.resolve('.tmp')
mkdirSync(stagingRoot, { recursive: true })
const outputDir = checkOnly
  ? mkdtempSync(path.join(stagingRoot, 'rezvan-site-check-'))
  : path.resolve('dist')

if (!checkOnly) rmSync(outputDir, { force: true, recursive: true })

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' })
}

try {
  run('node', ['scripts/check-equation-references.mjs'])
  run('npx', ['astro', 'build', '--outDir', outputDir])

  run('node', ['scripts/check-rendered-markdown.mjs', outputDir])

  const pagefindDir = path.join(outputDir, 'pagefind')
  rmSync(pagefindDir, { force: true, recursive: true })

  const { index, errors } = await createIndex()
  if (errors.length > 0) {
    throw new Error(`Pagefind initialization failed:\n${errors.join('\n')}`)
  }

  const indexed = await index.addDirectory({ path: outputDir })
  if (indexed.errors.length > 0) {
    throw new Error(`Pagefind indexing failed:\n${indexed.errors.join('\n')}`)
  }

  const written = await index.writeFiles({ outputPath: pagefindDir })
  if (written.errors.length > 0) {
    throw new Error(`Pagefind write failed:\n${written.errors.join('\n')}`)
  }

  console.log(`Pagefind index written to ${written.outputPath}`)
  console.log(checkOnly ? 'Checks complete' : `Build complete: ${outputDir}`)
} finally {
  await closePagefind()
  if (checkOnly) rmSync(outputDir, { force: true, recursive: true })
}
