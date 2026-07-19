import assert from 'node:assert/strict'
import test from 'node:test'
import { auditMarkdown } from './check-equation-references.mjs'

test('accepts plain display math', () => {
  assert.deepEqual(auditMarkdown('$$\nx = 1\n$$'), [])
})

test('rejects malformed KaTeX with a source location', () => {
  const failures = auditMarkdown('Inline $\\notARealCommand{x}$.', 'post.md')
  assert.match(failures[0], /^post\.md:1: invalid KaTeX:/)
})

test('accepts a labeled and referenced equation', () => {
  const source = `See @eq:identity

$$
\\begin{equation}
\\label{eq:identity}
x = x
\\end{equation}
$$`
  assert.deepEqual(auditMarkdown(source), [])
})

test('accepts punctuation immediately after a reference', () => {
  const source = `See @eq:identity.

$$
\\begin{equation}
\\label{eq:identity}
x = x
\\end{equation}
$$`
  assert.deepEqual(auditMarkdown(source), [])
})

test('rejects an unlabeled numbered environment', () => {
  const failures = auditMarkdown(`$$
\\begin{align}
x &= x
\\end{align}
$$`)
  assert.match(failures[0], /has no label/)
})

test('rejects an unused equation label', () => {
  const failures = auditMarkdown(`$$
\\begin{equation}
\\label{eq:unused}
x = x
\\end{equation}
$$`)
  assert.match(failures[0], /never referenced/)
})

test('rejects multiple labels in one numbered block', () => {
  const failures = auditMarkdown(`See @eq:first and @eq:second.

$$
\\begin{equation}
\\label{eq:first}
\\label{eq:second}
x = x
\\end{equation}
$$`)
  assert.match(failures[0], /exactly one/)
})
