// src/content/ramblings.ts
import { defineCollection, z } from 'astro:content';

const ramblingsCollection = defineCollection({
  schema: z.object({
    title: z.string().optional(),
  }),
});

export const collections = {
  ramblings: ramblingsCollection,
};