import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

// Helper function to parse dates consistently without timezone shifts
function parseDate(val: string | Date): Date {
  if (typeof val === "string") {
    // Parse YYYY-MM-DD format as local date to avoid timezone shifts
    const parts = val.split("-").map(Number);
    if (parts.length === 3 && parts.every((p) => !isNaN(p))) {
      // We've verified length is 3, so these are definitely defined
      return new Date(parts[0]!, parts[1]! - 1, parts[2]!);
    }
    // Fallback to standard parsing for other formats
    return new Date(val);
  }
  return new Date(val);
}

// Enhanced People Collection
const people = defineCollection({
  loader: glob({ base: "./src/content/people", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      // Core identification
      id: z.string(), // e.g., "john-doe"
      name: z.string(),
      displayName: z.string().optional(), // For preferred name display
      pronouns: z.string().optional(),

      // Professional information
      title: z.string().optional(),
      bio: z.string().optional(),
      expertise: z.array(z.string()).optional(),

      // Current and past affiliations
      affiliations: z
        .array(
          z.object({
            partnerId: z.string(), // Reference to partners collection
            role: z.string(),
            department: z.string().optional(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
            current: z.boolean().default(true),
          }),
        )
        .optional(),

      // Academic identifiers
      orcid: z.string().optional(),
      googleScholar: z.string().optional(),

      // Contact and social
      email: z.string().email().optional(),

      links: z
        .object({
          website: z.string().optional(),
          github: z.string().optional(),
          linkedin: z.string().optional(),
          twitter: z.string().optional(),
          bluesky: z.string().optional(),
          mastodon: z.string().optional(),
          scheduling: z.string().optional(),
        })
        .optional(),

      // Media

      images: z
        .object({
          avatar: image().optional(),
          hero: image().optional(),
        })
        .optional(),

      // Metadata
      visibility: z.enum(["public", "members", "private"]).default("public"),
      featured: z.boolean().default(false),

      draft: z.boolean().optional(),

      lastUpdated: z.date(),
    }),
});

// Organizations Collection (includes partners)
const organizations = defineCollection({
  loader: glob({
    base: "./src/content/organizations",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      // Core identification
      id: z.string(), // e.g., "george-mason-university"
      name: z.string(),
      shortName: z.string().optional(), // e.g., "GMU"
      description: z.string(),

      // Organization details
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
      isPartner: z.boolean().default(false),

      // Contact information (no individual names)
      contact: z
        .object({
          email: z.string().email().optional(),
          phone: z.string().optional(),
          department: z.string().optional(),
        })
        .optional(),

      // Key contacts (references to people collection)
      keyContacts: z
        .array(
          z.object({
            personId: z.string(), // Reference to people collection
            role: z.string(), // e.g., "Primary Contact", "Technical Lead"
          }),
        )
        .optional(),

      // Collaboration details
      collaboration: z.object({
        areas: z.array(z.string()),
        projects: z.array(z.string()).optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        active: z.boolean().default(true),
      }),

      // Additional properties
      website: z.string(),

      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          gallery: z.array(image()).optional(),
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
      draft: z.boolean().optional(),
      order: z.number().default(999),
    }),
});

// Updated Hardware Collection
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
      status: z.enum(["available", "in-progress", "coming-soon", "deprecated"]),
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
          logo: image().optional(),
          hero: image().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),

      // New reference-based fields
      contributors: z
        .array(
          z.object({
            type: z.enum(["person", "organization"]),
            id: z.string(), // Reference to people or partners collection
            role: z.string().optional(), // e.g., "Lead Developer", "Maintainer"
            startDate: z.date().optional(),
            endDate: z.date().optional(),
            current: z.boolean().default(true),
          }),
        )
        .optional(),

      // Primary affiliations
      leadOrganization: z.string().optional(), // Partner ID
      supportingOrganizations: z.array(z.string()).optional(), // Partner IDs

      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      publishDate: z
        .string()
        .or(z.date())
        .transform(parseDate)
        .default(() => new Date()),
    }),
});

// Updated Software Collection
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
      status: z.enum(["stable", "beta", "alpha", "in-progress", "deprecated"]),
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
      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),

      // New reference-based fields
      contributors: z
        .array(
          z.object({
            type: z.enum(["person", "organization"]),
            id: z.string(), // Reference to people or partners collection
            role: z.string().optional(), // e.g., "Lead Developer", "Maintainer"
            startDate: z.date().optional(),
            endDate: z.date().optional(),
            current: z.boolean().default(true),
          }),
        )
        .optional(),

      // Primary affiliations
      leadOrganization: z.string().optional(), // Partner ID
      supportingOrganizations: z.array(z.string()).optional(), // Partner IDs

      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      lastUpdate: z.string().or(z.date()).transform(parseDate),
      publishDate: z
        .string()
        .or(z.date())
        .transform(parseDate)
        .default(() => new Date()),
    }),
});

// Updated Studies/Research Collection
const studies = defineCollection({
  loader: glob({ base: "./src/content/studies", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      abstract: z.string(),

      // Replace embedded authors with references
      authors: z.array(
        z.object({
          personId: z.string(), // Reference to people collection
          order: z.number(), // Author order in publication
          corresponding: z.boolean().default(false),
          equalContribution: z.boolean().default(false),
          // Affiliation at time of publication (snapshot)
          affiliationSnapshot: z.string().optional(),
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

      // Institutional associations
      affiliatedOrganizations: z.array(z.string()).optional(), // Partner IDs
      fundingOrganizations: z.array(z.string()).optional(), // Partner IDs

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
      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      citations: z.number().default(0),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      publishDate: z.string().or(z.date()).transform(parseDate).optional(),
    }),
});

// Updated Events Collection
const events = defineCollection({
  loader: glob({ base: "./src/content/events", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      displayName: z.string().optional(),
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
      startDate: z.string().or(z.date()).transform(parseDate),
      endDate: z.string().or(z.date()).transform(parseDate),
      registrationDeadline: z
        .string()
        .or(z.date())
        .transform(parseDate)
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

      roles: z
        .array(
          z.enum([
            "attendee",
            "organizer",
            "sponsor",
            "exhibitor",
            "speaker",
            "panelist",
            "host",
            "winner",
            "competitor",
          ]),
        )
        .default([])
        .transform((values) => [...new Set(values)]),

      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          gallery: z.array(image()).optional(),
        })
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
      capacity: z.number().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    }),
});

// Export all collections
export const collections = {
  people,
  hardware,
  software,
  studies,
  events,
  organizations,
};
