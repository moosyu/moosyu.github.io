import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const guides = defineCollection ({
    loader: glob({ pattern: '*.{md,mdx}', base: "./src/content/guides" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date()
    })
});

const ramblings = defineCollection ({
    loader: glob({ pattern: '*.{md,mdx}', base: "./src/content/ramblings" }),
    schema: z.object({
        title: z.string().optional()
    })
});

const thoughts = defineCollection ({
    loader: glob({ pattern: '*.{md,mdx}', base: "./src/content/thoughts" }),
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