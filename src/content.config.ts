import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

// NEW: Hardware platforms collection
const hardware = defineCollection({
  loader: glob({ base: "./src/content/hardware", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      shortDescription: z.string().max(200),
      category: z.enum([
        "mobile",
        "social",
        "assistive",
        "research",
        "educational",
      ]),
      status: z.enum([
        "available",
        "experimental",
        "coming-soon",
        "discontinued",
      ]),
      specifications: z
        .object({
          height: z.string().optional(),
          weight: z.string().optional(),
          battery: z.string().optional(),
          sensors: z.array(z.string()).optional(),
          actuators: z.array(z.string()).optional(),
          computePlatform: z.string().optional(),
        })
        .optional(),
      features: z.array(z.string()),
      applications: z.array(z.string()),
      researchAreas: z.array(z.string()),
      pricing: z
        .object({
          purchase: z.number().optional(),
          rental: z
            .object({
              daily: z.number().optional(),
              weekly: z.number().optional(),
              monthly: z.number().optional(),
            })
            .optional(),
        })
        .optional(),
      links: z.object({
        documentation: z.string().optional(),
        github: z.string().optional(),
        website: z.string().optional(),
        paper: z.string().optional(),
        purchase: z.string().optional(),
        rental: z.string().optional(),
      }),
      images: z
        .object({
          hero: image(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      maintainers: z.array(z.string()),
      institutions: z.array(z.string()),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      featured: z.boolean().default(false),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val))
        .default(() => new Date()),
    }),
});

// NEW: Software platforms collection
const software = defineCollection({
  loader: glob({ base: "./src/content/software", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      shortDescription: z.string().max(200),
      category: z.enum([
        "framework",
        "library",
        "tool",
        "simulation",
        "dataset",
        "model",
      ]),
      status: z.enum(["stable", "beta", "alpha", "experimental", "deprecated"]),
      license: z.string(),
      language: z.array(z.string()), // Programming languages
      platform: z.array(z.string()), // OS/platforms supported
      requirements: z
        .object({
          runtime: z.array(z.string()).optional(),
          hardware: z.array(z.string()).optional(),
          dependencies: z.array(z.string()).optional(),
        })
        .optional(),
      features: z.array(z.string()),
      useCases: z.array(z.string()),
      links: z.object({
        documentation: z.string().optional(),
        github: z.string(),
        website: z.string().optional(),
        paper: z.string().optional(),
        demo: z.string().optional(),
        pypi: z.string().optional(),
        npm: z.string().optional(),
      }),
      logo: image().optional(),
      images: z
        .object({
          hero: image(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      maintainers: z.array(z.string()),
      institutions: z.array(z.string()),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      featured: z.boolean().default(false),
      lastUpdate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val))
        .default(() => new Date()),
    }),
});

// NEW: Studies/Research collection
const studies = defineCollection({
  loader: glob({ base: "./src/content/studies", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      abstract: z.string(),
      authors: z.array(
        z.object({
          name: z.string(),
          affiliation: z.string().optional(),
          orcid: z.string().optional(),
        }),
      ),
      type: z.enum([
        "paper",
        "thesis",
        "report",
        "preprint",
        "dataset",
        "benchmark",
      ]),
      venue: z.string().optional(), // Conference/Journal
      year: z.number(),
      keywords: z.array(z.string()),
      researchArea: z.array(z.string()),
      relatedHardware: z.array(z.string()).optional(), // References to hardware IDs
      relatedSoftware: z.array(z.string()).optional(), // References to software IDs
      links: z.object({
        pdf: z.string().optional(),
        doi: z.string().optional(),
        arxiv: z.string().optional(),
        website: z.string().optional(),
        code: z.string().optional(),
        data: z.string().optional(),
        video: z.string().optional(),
      }),
      thumbnail: image().optional(),
      citations: z.number().default(0),
      featured: z.boolean().default(false),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
    }),
});

// NEW: Events collection
const events = defineCollection({
  loader: glob({ base: "./src/content/events", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      type: z.enum([
        "conference",
        "workshop",
        "hackathon",
        "meetup",
        "webinar",
        "competition",
      ]),
      format: z.enum(["in-person", "virtual", "hybrid"]),
      startDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      endDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      registrationDeadline: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val))
        .optional(),
      location: z.object({
        venue: z.string().optional(),
        city: z.string(),
        country: z.string(),
        online: z.boolean().default(false),
        coordinates: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
      }),
      organizers: z.array(
        z.object({
          name: z.string(),
          role: z.string().optional(),
          affiliation: z.string().optional(),
        }),
      ),
      speakers: z
        .array(
          z.object({
            name: z.string(),
            title: z.string().optional(),
            affiliation: z.string().optional(),
            topic: z.string().optional(),
          }),
        )
        .optional(),
      tracks: z.array(z.string()).optional(),
      topics: z.array(z.string()),
      links: z.object({
        website: z.string(),
        registration: z.string().optional(),
        program: z.string().optional(),
        proceedings: z.string().optional(),
        recordings: z.string().optional(),
      }),
      pricing: z
        .object({
          student: z.number().optional(),
          academic: z.number().optional(),
          industry: z.number().optional(),
          virtual: z.number().optional(),
        })
        .optional(),
      capacity: z.number().optional(),
      banner: image().optional(),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    }),
});

// NEW: Partners collection
const partners = defineCollection({
  loader: glob({ base: "./src/content/partners", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      type: z.enum([
        "academic",
        "industry",
        "nonprofit",
        "government",
        "community",
      ]),
      category: z.enum([
        "research",
        "development",
        "funding",
        "infrastructure",
        "outreach",
      ]),
      website: z.string(),
      logo: image().optional(),
      collaboration: z.object({
        areas: z.array(z.string()),
        projects: z.array(z.string()).optional(),
        startDate: z
          .string()
          .or(z.date())
          .transform((val) => new Date(val)),
        active: z.boolean().default(true),
      }),
      contact: z
        .object({
          email: z.string().optional(),
          representative: z.string().optional(),
          department: z.string().optional(),
        })
        .optional(),
      socialMedia: z
        .object({
          twitter: z.string().optional(),
          linkedin: z.string().optional(),
          github: z.string().optional(),
        })
        .optional(),
      location: z.object({
        city: z.string(),
        country: z.string(),
      }),
      featured: z.boolean().default(false),
      order: z.number().default(999), // For manual sorting
    }),
});

// Export all collections
export const collections = {
  hardware,
  software,
  studies,
  events,
  partners,
};
