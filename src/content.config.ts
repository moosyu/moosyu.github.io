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
})

export const collections = { guides, ramblings };