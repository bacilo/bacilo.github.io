import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// CMS saves empty strings for optional fields; treat them as undefined
const optionalUrl = z.preprocess(v => v === '' ? undefined : v, z.string().url().optional());
const optionalStr = z.preprocess(v => v === '' ? undefined : v, z.string().optional());

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    collection: z.literal('publications'),
    permalink: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    citation: z.string(),
    paperurl: z.string().optional(),
    excerpt: z.string().optional(),
  })
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    collection: z.literal('talks'),
    type: z.string(),
    permalink: z.string(),
    venue: z.string(),
    date: z.coerce.date(),
    location: z.string(),
  })
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    permalink: z.string().optional(),
  })
});

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    excerpt: optionalStr,
    collection: z.literal('portfolio').optional(),
    repoUrl: optionalUrl,
    demoUrl: optionalUrl,
    description: optionalStr,
    playgroundUrl: optionalUrl,
  })
});

export const collections = { publications, talks, posts, portfolio };
