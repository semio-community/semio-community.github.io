import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
  title: z.string().max(200),
});

const post = defineCollection({
  loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    baseSchema.extend({
      abstract: z.string(),
      authors: z.array(
        z.object({
          name: z.string(),
          affiliationIndices: z.array(z.number()),
        }),
      ),
      affiliations: z.array(z.string()),
      pdfUrl: z.string().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      // Optional fields for backward compatibility
      description: z.string().optional(),
      coverImage: z
        .object({
          alt: z.string(),
          src: image(),
        })
        .optional(),
      ogImage: z.string().optional(),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      seriesId: z.string().optional(),
      orderInSeries: z.number().optional(),
    }),
});

// Series
const series = defineCollection({
  loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    featured: z.boolean().default(false), // Пометка для популярных серий
  }),
});
// End

// Series
export const collections = { post, series };
