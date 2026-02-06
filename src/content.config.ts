import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const guides = defineCollection ({
  schema: z.object({
    title: z.string(),
    pubDate: z.date()
  })
});

const ramblings = defineCollection ({
  schema: z.object({
    title: z.string().optional()
  })
});

const thoughts = defineCollection ({
  schema: z.object({
    title: z.string(),
    alt: z.string().optional(),
    type: z.string(),
    score: z.number(),
    image: z.string().optional(),
    imageB: z.string().optional(),
    dateModified: z.date().optional(),
    noRSS: z.boolean().optional(),
  })
});

export const collections = { guides, ramblings, thoughts };