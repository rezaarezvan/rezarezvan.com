type PreviewKind = 'footnote' | 'citation'

type PreviewRecord = {
  trigger: HTMLAnchorElement
  preview: HTMLElement
  kind: PreviewKind
  openedFromFocus: boolean
}

type FootnotePair = {
  article: HTMLElement
  marker: HTMLAnchorElement
  note: HTMLElement
  body: HTMLElement
  more: HTMLButtonElement
}

const floatingPreview = matchMedia(
  '(min-width: 48rem) and (hover: hover) and (pointer: fine)',
)
const wideSidenotes = matchMedia('(min-width: 80rem)')
let keyboardNavigation = false

addEventListener(
  'keydown',
  (event) => {
    if (event.key === 'Tab' || event.key.startsWith('Arrow')) {
      keyboardNavigation = true
    }
  },
  { capture: true },
)
addEventListener(
  'pointerdown',
  () => {
    keyboardNavigation = false
  },
  { capture: true },
)

function targetFromHash(link: HTMLAnchorElement): HTMLElement | null {
  if (!link.hash) return null
  try {
    return document.getElementById(decodeURIComponent(link.hash.slice(1)))
  } catch {
    return null
  }
}

function clonedBody(target: HTMLElement, className: string): HTMLElement {
  const body = document.createElement('div')
  body.className = className

  for (const child of Array.from(target.childNodes)) {
    body.append(child.cloneNode(true))
  }

  body
    .querySelectorAll<HTMLElement>(
      '[data-footnote-backref], .data-footnote-backref',
    )
    .forEach((backlink) => backlink.remove())

  for (const element of body.querySelectorAll<HTMLElement>('*')) {
    element.removeAttribute('id')
    element.removeAttribute('aria-controls')
    element.removeAttribute('aria-describedby')
    element.removeAttribute('aria-labelledby')
  }

  return body
}

function makePreview(
  trigger: HTMLAnchorElement,
  target: HTMLElement,
  kind: PreviewKind,
  index: number,
): HTMLElement {
  const preview = document.createElement('aside')
  preview.id = `annotation-preview-${index + 1}`
  preview.className = 'annotation-preview'
  preview.dataset.annotationPreview = kind
  preview.setAttribute('role', 'note')
  preview.hidden = true
  preview.append(clonedBody(target, 'annotation-preview-body'))

  const jump = document.createElement('a')
  jump.className = 'annotation-preview-jump'
  jump.href = trigger.hash
  jump.textContent =
    kind === 'footnote' ? 'View footnote ↓' : 'View reference ↓'
  preview.append(jump)

  trigger.setAttribute('aria-controls', preview.id)
  trigger.setAttribute('aria-expanded', 'false')
  document.body.append(preview)
  return preview
}

const previewRecords: PreviewRecord[] = []
const previewTriggers = Array.from(
  document.querySelectorAll<HTMLAnchorElement>(
    '.prose a[data-footnote-ref], .prose a[data-citation-ref]',
  ),
)

for (const [index, trigger] of previewTriggers.entries()) {
  const target = targetFromHash(trigger)
  if (!target) continue
  const kind: PreviewKind = trigger.hasAttribute('data-citation-ref')
    ? 'citation'
    : 'footnote'
  previewRecords.push({
    trigger,
    kind,
    preview: makePreview(trigger, target, kind, index),
    openedFromFocus: false,
  })
}

let activePreview: PreviewRecord | null = null
let closeTimer: number | undefined
let previewFrame = 0

function previewEnabled(record: PreviewRecord): boolean {
  return record.kind === 'citation' || !wideSidenotes.matches
}

function cancelClose(): void {
  if (closeTimer === undefined) return
  clearTimeout(closeTimer)
  closeTimer = undefined
}

function placeFloatingPreview(record: PreviewRecord): void {
  if (record.preview.hidden) return

  const gap = 10
  const edge = 16
  const marker = record.trigger.getBoundingClientRect()
  const box = record.preview.getBoundingClientRect()
  const left = Math.min(
    innerWidth - box.width - edge,
    Math.max(edge, marker.left + marker.width / 2 - box.width / 2),
  )
  const below = marker.bottom + gap
  const above = marker.top - box.height - gap
  const top =
    below + box.height <= innerHeight - edge ? below : Math.max(edge, above)

  record.preview.style.setProperty('--annotation-left', `${left}px`)
  record.preview.style.setProperty('--annotation-top', `${top}px`)
}

function inlineContainer(trigger: HTMLElement): HTMLElement {
  return (
    trigger.closest<HTMLElement>('p, blockquote, li') ??
    trigger.parentElement ??
    document.body
  )
}

function placeInlinePreview(record: PreviewRecord): void {
  const container = inlineContainer(record.trigger)
  if (container.matches('li')) container.append(record.preview)
  else container.insertAdjacentElement('afterend', record.preview)
}

function closeActivePreview(): void {
  cancelClose()
  if (!activePreview) return
  activePreview.preview.hidden = true
  activePreview.preview.removeAttribute('data-preview-mode')
  activePreview.trigger.removeAttribute('data-annotation-active')
  activePreview.trigger.setAttribute('aria-expanded', 'false')
  activePreview.openedFromFocus = false
  activePreview = null
}

function openPreview(record: PreviewRecord, fromFocus = false): void {
  if (!previewEnabled(record)) return
  cancelClose()
  if (activePreview && activePreview !== record) closeActivePreview()
  activePreview = record
  record.openedFromFocus = fromFocus

  if (floatingPreview.matches) {
    document.body.append(record.preview)
    record.preview.dataset.previewMode = 'floating'
  } else {
    placeInlinePreview(record)
    record.preview.dataset.previewMode = 'inline'
  }

  record.preview.hidden = false
  record.trigger.dataset.annotationActive = ''
  record.trigger.setAttribute('aria-expanded', 'true')
  if (floatingPreview.matches) placeFloatingPreview(record)
}

function schedulePreviewClose(record: PreviewRecord): void {
  cancelClose()
  closeTimer = window.setTimeout(() => {
    closeTimer = undefined
    const focus = document.activeElement
    if (
      record.trigger.matches(':hover, :focus') ||
      record.preview.matches(':hover') ||
      (focus instanceof Node && record.preview.contains(focus))
    ) {
      return
    }
    if (activePreview === record) closeActivePreview()
  }, 140)
}

for (const record of previewRecords) {
  const { trigger, preview } = record

  trigger.addEventListener('pointerenter', () => {
    if (floatingPreview.matches && previewEnabled(record)) openPreview(record)
  })
  trigger.addEventListener('pointerleave', () => schedulePreviewClose(record))
  trigger.addEventListener('focus', () => {
    if (
      previewEnabled(record) &&
      (floatingPreview.matches || keyboardNavigation)
    ) {
      openPreview(record, keyboardNavigation)
    }
  })
  trigger.addEventListener('blur', () => schedulePreviewClose(record))
  trigger.addEventListener('click', (event) => {
    if (!previewEnabled(record)) return
    if (floatingPreview.matches || record.openedFromFocus) {
      closeActivePreview()
      return
    }

    event.preventDefault()
    if (activePreview === record && !preview.hidden) closeActivePreview()
    else openPreview(record)
  })

  preview.addEventListener('pointerenter', cancelClose)
  preview.addEventListener('pointerleave', () => schedulePreviewClose(record))
  preview.addEventListener('focusin', cancelClose)
  preview.addEventListener('focusout', () => schedulePreviewClose(record))
  preview
    .querySelector<HTMLAnchorElement>('.annotation-preview-jump')
    ?.addEventListener('click', closeActivePreview)
}

document.addEventListener('click', (event) => {
  if (!activePreview || floatingPreview.matches) return
  const target = event.target
  if (!(target instanceof Node)) return
  if (
    activePreview.trigger.contains(target) ||
    activePreview.preview.contains(target)
  ) {
    return
  }
  closeActivePreview()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeActivePreview()
})

function scheduleFloatingPreview(): void {
  if (previewFrame || !activePreview || !floatingPreview.matches) return
  previewFrame = requestAnimationFrame(() => {
    previewFrame = 0
    if (activePreview) placeFloatingPreview(activePreview)
  })
}

addEventListener('scroll', scheduleFloatingPreview, { passive: true })
addEventListener('resize', scheduleFloatingPreview, { passive: true })
floatingPreview.addEventListener('change', closeActivePreview)

// On wide screens the canonical footnotes are mirrored into the right margin.
// The endnotes remain untouched, so links, print, and no-script use all retain
// their ordinary Markdown behavior.
const footnotePairs: FootnotePair[] = []
const footnoteMarkers = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.prose a[data-footnote-ref]'),
)

for (const [index, marker] of footnoteMarkers.entries()) {
  const article = marker.closest<HTMLElement>('.prose')
  const target = targetFromHash(marker)
  if (!article || !target) continue

  const note = document.createElement('aside')
  note.className = 'footnote-sidenote'
  note.setAttribute('role', 'note')

  const number = document.createElement('span')
  number.className = 'footnote-sidenote-number'
  number.setAttribute('aria-hidden', 'true')
  number.textContent = `[${marker.textContent?.trim() || index + 1}]`

  const body = clonedBody(target, 'footnote-sidenote-body')
  body.id = `footnote-sidenote-body-${index + 1}`

  const more = document.createElement('button')
  more.type = 'button'
  more.className = 'footnote-sidenote-more'
  more.textContent = 'More'
  more.setAttribute('aria-controls', body.id)
  more.setAttribute('aria-expanded', 'false')
  more.hidden = true

  note.append(number, body, more)
  article.append(note)
  footnotePairs.push({ article, marker, note, body, more })
}

function setPairState(
  pair: FootnotePair,
  state: 'active' | 'current',
  enabled: boolean,
): void {
  pair.marker.toggleAttribute(`data-sidenote-${state}`, enabled)
  pair.note.toggleAttribute(`data-${state}`, enabled)
}

for (const pair of footnotePairs) {
  const activate = () => setPairState(pair, 'active', true)
  const deactivate = () => setPairState(pair, 'active', false)

  pair.marker.addEventListener('pointerenter', activate)
  pair.marker.addEventListener('pointerleave', deactivate)
  pair.note.addEventListener('pointerenter', activate)
  pair.note.addEventListener('pointerleave', deactivate)
  pair.marker.addEventListener('focus', activate)
  pair.marker.addEventListener('blur', deactivate)
  pair.note.addEventListener('focusin', activate)
  pair.note.addEventListener('focusout', deactivate)

  pair.more.addEventListener('click', () => {
    const expanded = pair.more.getAttribute('aria-expanded') === 'true'
    pair.more.setAttribute('aria-expanded', String(!expanded))
    pair.more.textContent = expanded ? 'More' : 'Less'
    pair.body.toggleAttribute('data-expanded', !expanded)
    scheduleFootnotePositions()
  })
}

let footnotePositionFrame = 0
let footnoteReadingFrame = 0

function positionFootnotes(): void {
  footnotePositionFrame = 0
  const articles = new Set(footnotePairs.map(({ article }) => article))

  for (const article of articles) {
    article.removeAttribute('data-footnotes-ready')
    article.style.removeProperty('--footnote-overflow')
  }
  for (const pair of footnotePairs) {
    pair.note.style.removeProperty('--footnote-top')
    pair.body.removeAttribute('data-collapsed')
    pair.more.hidden = true
  }
  if (!wideSidenotes.matches) return

  for (const article of articles) {
    const pairs = footnotePairs.filter((pair) => pair.article === article)
    if (pairs.length === 0) continue

    article.dataset.footnotesReady = ''
    const articleRect = article.getBoundingClientRect()
    let previousBottom = 0

    for (const pair of pairs) {
      const expanded = pair.body.hasAttribute('data-expanded')
      if (!expanded) {
        pair.body.dataset.collapsed = ''
        pair.more.hidden = pair.body.scrollHeight <= pair.body.clientHeight + 2
        if (pair.more.hidden) pair.body.removeAttribute('data-collapsed')
      } else {
        pair.more.hidden = false
      }

      const desired = pair.marker.getBoundingClientRect().top - articleRect.top
      const top = Math.max(desired, previousBottom)
      pair.note.style.setProperty('--footnote-top', `${top}px`)
      previousBottom = top + pair.note.offsetHeight + 16
    }

    const overflow = Math.max(0, previousBottom - article.offsetHeight)
    article.style.setProperty('--footnote-overflow', `${overflow}px`)
  }
}

function scheduleFootnotePositions(): void {
  if (footnotePositionFrame) return
  footnotePositionFrame = requestAnimationFrame(positionFootnotes)
}

function updateReadingFootnote(): void {
  footnoteReadingFrame = 0
  for (const pair of footnotePairs) setPairState(pair, 'current', false)
  if (!wideSidenotes.matches || footnotePairs.length === 0) return

  const headerBottom =
    document.getElementById('site-header-shell')?.getBoundingClientRect()
      .bottom ?? 0
  const readingLine = headerBottom + (innerHeight - headerBottom) * 0.3
  let current: FootnotePair | undefined

  for (const pair of footnotePairs) {
    if (pair.marker.getBoundingClientRect().top > readingLine) break
    current = pair
  }
  if (current) setPairState(current, 'current', true)
}

function scheduleReadingFootnote(): void {
  if (footnoteReadingFrame) return
  footnoteReadingFrame = requestAnimationFrame(updateReadingFootnote)
}

if (footnotePairs.length > 0) {
  const observer = new ResizeObserver(scheduleFootnotePositions)
  for (const article of new Set(footnotePairs.map(({ article }) => article))) {
    observer.observe(article)
  }

  document.fonts?.ready.then(scheduleFootnotePositions)
  addEventListener('load', scheduleFootnotePositions, { once: true })
  addEventListener('resize', scheduleFootnotePositions, { passive: true })
  addEventListener('scroll', scheduleReadingFootnote, { passive: true })
  wideSidenotes.addEventListener('change', () => {
    closeActivePreview()
    scheduleFootnotePositions()
    scheduleReadingFootnote()
  })

  positionFootnotes()
  updateReadingFootnote()
}
