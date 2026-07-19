import type { SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'rezarezvan.com',
  description: 'Personal website and course notes repository',
  href: 'https://rezarezvan.com',
  locale: 'en',
  featuredPostCount: 1,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/essays/',
    label: 'Essays',
  },
  {
    href: '/notes/',
    label: 'Lecture Notes',
  },
  {
    href: '/research/',
    label: 'Research',
  },
]

export const ACADEMIC_LINKS: SocialLink[] = [
  {
    href: 'https://scholar.google.com/citations?user=NVeQSXcAAAAJ',
    label: 'Google Scholar',
  },
  {
    href: 'https://orcid.org/0009-0007-9151-622X',
    label: 'ORCID',
  },
  {
    href: 'https://github.com/rezaarezvan',
    label: 'GitHub',
  },
  {
    href: '/cv.pdf',
    label: 'CV',
  },
]
