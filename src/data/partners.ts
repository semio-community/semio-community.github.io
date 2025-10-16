import { type CollectionEntry, getCollection } from "astro:content";

/** Get all partners, sorted by featured status, order, and name */
export async function getAllPartners(): Promise<CollectionEntry<"organizations">[]> {
  const organizations = await getCollection("organizations", ({ data }) => {
    // In production, exclude drafts. In development, show all.
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  const partners = organizations.filter((org) => org.data.isPartner);

  return partners.sort((a, b) => {
    // Sort by featured first
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    // Then by active status
    if (a.data.collaboration.active !== b.data.collaboration.active) {
      return a.data.collaboration.active ? -1 : 1;
    }

    // Then by order number
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }

    // Finally by name
    return a.data.name.localeCompare(b.data.name);
  });
}

/** Get partners filtered by type */
export async function getPartnersByType(
  type: "academic" | "industry" | "nonprofit" | "government" | "community",
): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getAllPartners();
  return partners.filter((partner) => partner.data.type === type);
}

/** Get partners filtered by category */
export async function getPartnersByCategory(
  category:
    | "research"
    | "development"
    | "funding"
    | "infrastructure"
    | "outreach",
): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getAllPartners();
  return partners.filter((partner) => partner.data.category === category);
}

/** Get only featured partners */
export async function getFeaturedPartners(): Promise<
  CollectionEntry<"organizations">[]
> {
  const partners = await getAllPartners();
  return partners.filter((partner) => partner.data.featured);
}

/** Get only active partners */
export async function getActivePartners(): Promise<
  CollectionEntry<"organizations">[]
> {
  const partners = await getAllPartners();
  return partners.filter((partner) => partner.data.collaboration.active);
}

/** Get inactive partners */
export async function getInactivePartners(): Promise<
  CollectionEntry<"organizations">[]
> {
  const partners = await getAllPartners();
  return partners.filter((partner) => !partner.data.collaboration.active);
}

/** Get partners by collaboration area */
export async function getPartnersByCollaborationArea(
  area: string,
): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getAllPartners();
  return partners.filter((partner) =>
    partner.data.collaboration.areas.some(
      (collab) => collab.toLowerCase() === area.toLowerCase(),
    ),
  );
}

/** Get partners by location (city or country) */
export async function getPartnersByLocation(location: {
  city?: string;
  country?: string;
}): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getAllPartners();

  return partners.filter((partner) => {
    if (location.city && location.country) {
      return (
        partner.data.location.city.toLowerCase() ===
          location.city.toLowerCase() &&
        partner.data.location.country.toLowerCase() ===
          location.country.toLowerCase()
      );
    } else if (location.city) {
      return (
        partner.data.location.city.toLowerCase() === location.city.toLowerCase()
      );
    } else if (location.country) {
      return (
        partner.data.location.country.toLowerCase() ===
        location.country.toLowerCase()
      );
    }
    return false;
  });
}

/** Get partners involved in a specific project */
export async function getPartnersByProject(
  projectName: string,
): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getAllPartners();
  return partners.filter(
    (partner) =>
      partner.data.collaboration.projects?.some((project) =>
        project.toLowerCase().includes(projectName.toLowerCase()),
      ) ?? false,
  );
}

/** Get all unique partner types */
export async function getUniquePartnerTypes(): Promise<string[]> {
  const partners = await getAllPartners();
  const types = partners.map((partner) => partner.data.type);
  return [...new Set(types)];
}

/** Get all unique partner categories */
export async function getUniquePartnerCategories(): Promise<string[]> {
  const partners = await getAllPartners();
  const categories = partners.map((partner) => partner.data.category);
  return [...new Set(categories)];
}

/** Get all unique collaboration areas */
export async function getUniqueCollaborationAreas(): Promise<string[]> {
  const partners = await getAllPartners();
  const areas = partners.flatMap((partner) => partner.data.collaboration.areas);
  return [...new Set(areas)].sort();
}

/** Get all unique locations */
export async function getUniqueLocations(): Promise<
  { city: string; country: string }[]
> {
  const partners = await getAllPartners();
  const locationStrings = partners.map(
    (partner) =>
      `${partner.data.location.city}|${partner.data.location.country}`,
  );

  const uniqueLocations = [...new Set(locationStrings)].map((loc) => {
    const [city, country] = loc.split("|");
    return { city: city || "", country: country || "" };
  });

  return uniqueLocations.sort((a, b) => a.country.localeCompare(b.country));
}

/** Get partner count by type */
export async function getPartnerCountByType(): Promise<Record<string, number>> {
  const partners = await getAllPartners();
  return partners.reduce(
    (acc, partner) => {
      const type = partner.data.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get partner count by category */
export async function getPartnerCountByCategory(): Promise<
  Record<string, number>
> {
  const partners = await getAllPartners();
  return partners.reduce(
    (acc, partner) => {
      const category = partner.data.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get partner count by country */
export async function getPartnerCountByCountry(): Promise<
  Record<string, number>
> {
  const partners = await getAllPartners();
  return partners.reduce(
    (acc, partner) => {
      const country = partner.data.location.country;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Search partners by query string */
export async function searchPartners(
  query: string,
): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getAllPartners();
  const lowerQuery = query.toLowerCase();

  return partners.filter((partner) => {
    return (
      partner.data.name.toLowerCase().includes(lowerQuery) ||
      partner.data.description.toLowerCase().includes(lowerQuery) ||
      partner.data.collaboration.areas.some((area) =>
        area.toLowerCase().includes(lowerQuery),
      ) ||
      (partner.data.collaboration.projects?.some((project) =>
        project.toLowerCase().includes(lowerQuery),
      ) ??
        false) ||
      partner.data.location.city.toLowerCase().includes(lowerQuery) ||
      partner.data.location.country.toLowerCase().includes(lowerQuery)
    );
  });
}

/** Get related partners (by shared collaboration areas or location) */
export async function getRelatedPartners(
  currentPartner: CollectionEntry<"organizations">,
  limit: number = 3,
): Promise<CollectionEntry<"organizations">[]> {
  const allPartners = await getActivePartners();

  // Filter out the current partner
  const otherPartners = allPartners.filter(
    (partner) => partner.id !== currentPartner.id,
  );

  // Score each partner based on shared attributes
  const scored = otherPartners.map((partner) => {
    let score = 0;

    // Score for shared collaboration areas
    const sharedAreas = partner.data.collaboration.areas.filter((area) =>
      currentPartner.data.collaboration.areas.includes(area),
    );
    score += sharedAreas.length * 3;

    // Score for shared projects
    if (
      currentPartner.data.collaboration.projects &&
      partner.data.collaboration.projects
    ) {
      const sharedProjects = partner.data.collaboration.projects.filter(
        (project) =>
          currentPartner.data.collaboration.projects!.includes(project),
      );
      score += sharedProjects.length * 4;
    }

    // Score for same type
    if (partner.data.type === currentPartner.data.type) {
      score += 2;
    }

    // Score for same category
    if (partner.data.category === currentPartner.data.category) {
      score += 2;
    }

    // Score for same location
    if (
      partner.data.location.city === currentPartner.data.location.city &&
      partner.data.location.country === currentPartner.data.location.country
    ) {
      score += 1;
    } else if (
      partner.data.location.country === currentPartner.data.location.country
    ) {
      score += 0.5;
    }

    return { partner, score };
  });

  // Sort by score and return top partners
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ partner }) => partner);
}

/** Group partners by type for display */
export function groupPartnersByType(
  partners: CollectionEntry<"organizations">[],
): Record<string, CollectionEntry<"organizations">[]> {
  const grouped: Record<string, CollectionEntry<"organizations">[]> = {};

  partners.forEach((partner) => {
    const type = partner.data.type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(partner);
  });

  // Sort partners within each type
  Object.keys(grouped).forEach((key) => {
    grouped[key]?.sort((a, b) => {
      if (a.data.order !== b.data.order) {
        return a.data.order - b.data.order;
      }
      return a.data.name.localeCompare(b.data.name);
    });
  });

  return grouped;
}

/** Group partners by country for geographic view */
export function groupPartnersByCountry(
  partners: CollectionEntry<"organizations">[],
): Record<string, CollectionEntry<"organizations">[]> {
  const grouped: Record<string, CollectionEntry<"organizations">[]> = {};

  partners.forEach((partner) => {
    const country = partner.data.location.country;
    if (!grouped[country]) {
      grouped[country] = [];
    }
    grouped[country].push(partner);
  });

  // Sort partners within each country
  Object.keys(grouped).forEach((key) => {
    grouped[key]?.sort((a, b) => a.data.name.localeCompare(b.data.name));
  });

  return grouped;
}

/** Get partners that started collaboration within a date range */
export async function getPartnersByCollaborationDate(
  startDate: Date,
  endDate?: Date,
): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getAllPartners();

  return partners.filter((partner) => {
    const collabStart = partner.data.collaboration.startDate;
    if (endDate) {
      return collabStart >= startDate && collabStart <= endDate;
    }
    return collabStart >= startDate;
  });
}

/** Get newest partnerships */
export async function getNewestPartnerships(
  limit: number = 5,
): Promise<CollectionEntry<"organizations">[]> {
  const partners = await getActivePartners();
  return partners
    .sort(
      (a, b) =>
        b.data.collaboration.startDate.getTime() -
        a.data.collaboration.startDate.getTime(),
    )
    .slice(0, limit);
}

/** Filter partners by multiple criteria */
export async function filterPartners(criteria: {
  type?: string;
  category?: string;
  location?: { city?: string; country?: string };
  areas?: string[];
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<CollectionEntry<"organizations">[]> {
  let partners = await getAllPartners();

  if (criteria.type) {
    partners = partners.filter(
      (partner) => partner.data.type === criteria.type,
    );
  }

  if (criteria.category) {
    partners = partners.filter(
      (partner) => partner.data.category === criteria.category,
    );
  }

  if (criteria.location) {
    if (criteria.location.city) {
      partners = partners.filter(
        (partner) =>
          partner.data.location.city.toLowerCase() ===
          criteria.location!.city!.toLowerCase(),
      );
    }
    if (criteria.location.country) {
      partners = partners.filter(
        (partner) =>
          partner.data.location.country.toLowerCase() ===
          criteria.location!.country!.toLowerCase(),
      );
    }
  }

  if (criteria.areas && criteria.areas.length > 0) {
    partners = partners.filter((partner) =>
      criteria.areas!.some((area) =>
        partner.data.collaboration.areas.some((collab) =>
          collab.toLowerCase().includes(area.toLowerCase()),
        ),
      ),
    );
  }

  if (criteria.activeOnly) {
    partners = partners.filter((partner) => partner.data.collaboration.active);
  }

  if (criteria.featuredOnly) {
    partners = partners.filter((partner) => partner.data.featured);
  }

  return partners;
}

/** Get statistics about partnerships */
export async function getPartnershipStatistics(): Promise<{
  total: number;
  active: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byCountry: Record<string, number>;
  newestPartnership?: CollectionEntry<"organizations">;
  oldestPartnership?: CollectionEntry<"organizations">;
}> {
  const partners = await getAllPartners();
  const activePartners = partners.filter((p) => p.data.collaboration.active);

  const sorted = [...partners].sort(
    (a, b) =>
      a.data.collaboration.startDate.getTime() -
      b.data.collaboration.startDate.getTime(),
  );

  return {
    total: partners.length,
    active: activePartners.length,
    byType: await getPartnerCountByType(),
    byCategory: await getPartnerCountByCategory(),
    byCountry: await getPartnerCountByCountry(),
    newestPartnership: sorted[sorted.length - 1],
    oldestPartnership: sorted[0],
  };
}
