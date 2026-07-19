# rezarezvan.com

Personal academic website, essays, and lecture notes — [rezarezvan.com](https://rezarezvan.com).

Built with [Astro](https://astro.build/) on the [astro-erudite](https://github.com/jktrn/astro-erudite)
foundation. The site keeps that project’s small, native-CSS approach while adding the machinery its
academic content needs: citations, numbered equations and figures, cross-references, margin notes,
and a large collection of lecture notes.

## Stack

- [Sätteri](https://github.com/satteri) with local Markdown plugins in `src/lib/markdown/`
- server-rendered [KaTeX](https://katex.org/) on pages containing math
- [Expressive Code](https://expressive-code.com/) for code blocks and inline highlighting
- [Pagefind](https://pagefind.app/) for static full-text search
- native CSS and self-hosted fonts; no UI or client-framework dependency
- Biome for formatting

## Content

- `src/content/essays/` — essays and the continuously revised “Wandering Thoughts” page
- `src/content/notes/` — bachelor, master, and exchange lecture notes
- `src/content/research/` — research pages and publications
- `src/content/news/` — homepage news items

## Development

```bash
npm install
npm run dev          # development server on http://localhost:1234
npm run check        # formatting, unit tests, validators, and a disposable production build
npm run build        # validated production build and Pagefind index in ./dist
npm run preview      # preview ./dist
npm run deploy       # redeploy the current remote main branch
npm run format       # format the repository with Biome
```

Search gracefully reports that it is unavailable under `npm run dev`: Pagefind is generated only by
`npm run check` and `npm run build`. The production pipeline also checks equations, rendered internal
links and fragments, metadata, and cross-references.

Pushes to `main` are built and deployed to GitHub Pages by GitHub Actions. The generated site is an
ephemeral Pages artifact; build output is never committed to the repository. `npm run deploy`
manually reruns that workflow for the already-pushed `main` branch and requires an authenticated
[GitHub CLI](https://cli.github.com/).

## Credits

Foundation: [astro-erudite](https://github.com/jktrn/astro-erudite) by
[@jktrn](https://github.com/jktrn).
