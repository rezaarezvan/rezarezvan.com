import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      image: image().optional(),
      draft: z.boolean().optional(),
    }),
})

const bachelor = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/notes/bachelor',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      school: z.array(z.string()), // Subject name, e.g. ["Linear Algebra"]
      image: image().optional(),
      draft: z.boolean().optional(),
    }),
})

const master = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/notes/master',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      school: z.array(z.string()), // Subject name, e.g. ["Linear Algebra"]
      image: image().optional(),
      draft: z.boolean().optional(),
    }),
})

const exchange = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/notes/exchange',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      school: z.array(z.string()), // Subject name, e.g. ["Data Science"]
      image: image().optional(),
      draft: z.boolean().optional(),
    }),
})

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    date: z.coerce.date(),
    draft: z.boolean().optional(),
  }),
})

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      authors: z.array(z.string()),
      authorNotes: z.record(z.string(), z.string()).optional(),
      myName: z.string().default('Reza Rezvan'),
      venue: z.string().optional(),
      venueShort: z.string().optional(),
      paperUrl: z.string().url().optional(),
      codeUrl: z.string().url().optional(),
      datasetUrl: z.string().url().optional(),
      doiUrl: z.string().url().optional(),
      image: image().optional(),
      draft: z.boolean().optional(),
    }),
})

export const collections = {
  essays,
  bachelor,
  master,
  exchange,
  news,
  research,
}
