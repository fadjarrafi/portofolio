import { defineCollection, z } from 'astro:content';

const postType = z.enum(['essay', 'tutorial', 'note', 'reflection', 'review']).optional();
const lang = z.enum(['en', 'id']).optional();

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    lang,
    translationSlug: z.string().optional(),
    topics: z.array(z.string()).optional(),
    type: postType,
    updated: z.string().optional(),
  }),
});

const thoughts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string().optional(),
    image: z.string().optional(),
    lang,
    translationSlug: z.string().optional(),
    topics: z.array(z.string()).optional(),
    type: postType,
    updated: z.string().optional(),
    status: z.enum(['seed', 'sapling', 'tree']).optional(),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    topics: z.array(z.string()).optional(),
    client: z.string().optional(),
    role: z.string().optional(),
    duration: z.string().optional(),
  }),
});

export const collections = { blog, thoughts, 'case-studies': caseStudies };
