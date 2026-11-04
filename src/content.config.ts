import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase kebab-case');

const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: ['**/*.{md,mdx}', '!**/*.zh.md', '!**/*.zh.mdx'],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: slug,
    tags: z.array(slug).default([]),
    draft: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

const articleZh = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: ['**/*.zh.md', '**/*.zh.mdx'],
    // github-slugger drops the dot in `name.zh`, which collides the lookup key.
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { articles, articleZh };
