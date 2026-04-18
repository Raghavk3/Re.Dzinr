import { defineCollection, z } from "astro:content";

const authors = defineCollection({
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    socials: z
      .object({
        linkedin: z.string().url().optional(),
        instagram: z.string().url().optional(),
        twitter: z.string().url().optional(),
      })
      .optional(),
  }),
});

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
      pubDate: z.date(),
      author: z.object({
        name: z.string(),
        link: z.string().optional(),
      }),
      title: z.string(),
      description: z.string(),
      link: z.string().url().optional(),
      image: z.object({
        source: image(),
        alt: z.string(),
      }),
    }),
});

const blog = defineCollection({
  schema: ({ image }) =>
    z.object({
      pubDate: z.date(),
      author: z.object({
        name: z.string(),
        link: z.string().optional(),
      }),
      title: z.string(),
      description: z.string(),
      image: z.object({
        source: image(),   // ← same fix as projects
        alt: z.string(),
      }),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  authors,
  projects,
  blog,
};