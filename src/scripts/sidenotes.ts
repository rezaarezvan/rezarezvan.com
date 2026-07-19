const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const toggle = entry.target as HTMLElement
      const noteId = toggle.getAttribute('for')
      const sidenote = document.getElementById(`${noteId}-note`)
      toggle.classList.toggle('active', entry.isIntersecting)
      sidenote?.classList.toggle('active', entry.isIntersecting)
    }
  },
  { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
)

for (const toggle of document.querySelectorAll('.sidenote-toggle')) {
  observer.observe(toggle)
}
