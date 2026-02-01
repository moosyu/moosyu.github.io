import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
 });

export const collections = { guides };