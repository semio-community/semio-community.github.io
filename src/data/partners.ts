import { type CollectionEntry, getCollection } from "astro:content";

type PartnerEntry = CollectionEntry<"organizations">;

async function loadPartnerEntries(): Promise<PartnerEntry[]> {
  const organizations = await getCollection("organizations", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );

  const partners = organizations.filter((org) => org.data.isPartner);

  return partners.sort((a, b) => {
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }

    return a.data.name.localeCompare(b.data.name);
  });
}

/** Get all partner organizations */
export async function getAllPartners(): Promise<PartnerEntry[]> {
  return loadPartnerEntries();
}

/** Get partners filtered by organization type */
export async function getPartnersByType(
  type: PartnerEntry["data"]["type"],
): Promise<PartnerEntry[]> {
  const partners = await loadPartnerEntries();
  return partners.filter((partner) => partner.data.type === type);
}

/** Get partners filtered by category */
export async function getPartnersByCategory(
  category: PartnerEntry["data"]["category"],
): Promise<PartnerEntry[]> {
  const partners = await loadPartnerEntries();
  return partners.filter((partner) => partner.data.category === category);
}

/** Get featured partners */
export async function getFeaturedPartners(): Promise<PartnerEntry[]> {
  const partners = await loadPartnerEntries();
  return partners.filter((partner) => partner.data.featured);
}

/** Get partners by location */
export async function getPartnersByLocation(location: {
  city?: string;
  country?: string;
}): Promise<PartnerEntry[]> {
  const partners = await loadPartnerEntries();

  return partners.filter((partner) => {
    const partnerCity = partner.data.location.city.toLowerCase();
    const partnerCountry = partner.data.location.country.toLowerCase();

    if (location.city && location.country) {
      return (
        partnerCity === location.city.toLowerCase() &&
        partnerCountry === location.country.toLowerCase()
      );
    }

    if (location.city) {
      return partnerCity === location.city.toLowerCase();
    }

    if (location.country) {
      return partnerCountry === location.country.toLowerCase();
    }

    return false;
  });
}

/** Get unique partner types */
export async function getUniquePartnerTypes(): Promise<string[]> {
  const partners = await loadPartnerEntries();
  const types = partners.map((partner) => partner.data.type);
  return [...new Set(types)];
}

/** Get unique partner categories */
export async function getUniquePartnerCategories(): Promise<string[]> {
  const partners = await loadPartnerEntries();
  const categories = partners.map((partner) => partner.data.category);
  return [...new Set(categories)];
}

/** Get unique partner locations */
export async function getUniqueLocations(): Promise<
  Array<{ city: string; country: string }>
> {
  const partners = await loadPartnerEntries();
  const locationStrings = partners.map(
    (partner) => `${partner.data.location.city}|${partner.data.location.country}`,
  );

  const unique = [...new Set(locationStrings)]
    .map((value) => {
      const [city, country] = value.split("|");
      return { city, country };
    })
    .filter(({ city, country }) => city && country);

  const normalized = unique.map(({ city, country }) => ({
    city: city!,
    country: country!,
  }));

  return normalized.sort((a, b) =>
    a.country.localeCompare(b.country, undefined, { sensitivity: "base" }),
  );
}

/** Count partners by type */
export async function getPartnerCountByType(): Promise<Record<string, number>> {
  const partners = await loadPartnerEntries();
  return partners.reduce((acc, partner) => {
    acc[partner.data.type] = (acc[partner.data.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/** Count partners by category */
export async function getPartnerCountByCategory(): Promise<
  Record<string, number>
> {
  const partners = await loadPartnerEntries();
  return partners.reduce((acc, partner) => {
    acc[partner.data.category] = (acc[partner.data.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/** Count partners by country */
export async function getPartnerCountByCountry(): Promise<
  Record<string, number>
> {
  const partners = await loadPartnerEntries();
  return partners.reduce((acc, partner) => {
    const country = partner.data.location.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/** Search partners by query */
export async function searchPartners(
  query: string,
): Promise<PartnerEntry[]> {
  const partners = await loadPartnerEntries();
  const lowerQuery = query.toLowerCase();

  return partners.filter((partner) => {
    const summary = partner.data.collaborationSummary?.toLowerCase() ?? "";
    const website = partner.data.links?.website?.toLowerCase() ?? "";

    return (
      partner.data.name.toLowerCase().includes(lowerQuery) ||
      partner.data.description.toLowerCase().includes(lowerQuery) ||
      summary.includes(lowerQuery) ||
      website.includes(lowerQuery) ||
      partner.data.location.city.toLowerCase().includes(lowerQuery) ||
      partner.data.location.country.toLowerCase().includes(lowerQuery)
    );
  });
}

/** Group partners by type */
export function groupPartnersByType(
  partners: PartnerEntry[],
): Record<string, PartnerEntry[]> {
  return partners.reduce((acc, partner) => {
    if (!acc[partner.data.type]) {
      acc[partner.data.type] = [];
    }
    acc[partner.data.type]!.push(partner);
    return acc;
  }, {} as Record<string, PartnerEntry[]>);
}

/** Group partners by country */
export function groupPartnersByCountry(
  partners: PartnerEntry[],
): Record<string, PartnerEntry[]> {
  return partners.reduce((acc, partner) => {
    const country = partner.data.location.country;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country]!.push(partner);
    return acc;
  }, {} as Record<string, PartnerEntry[]>);
}

/** Filter partners by multiple criteria */
export async function filterPartners(criteria: {
  type?: string;
  category?: string;
  location?: { city?: string; country?: string };
  featuredOnly?: boolean;
}): Promise<PartnerEntry[]> {
  let partners = await loadPartnerEntries();

  if (criteria.type) {
    partners = partners.filter((partner) => partner.data.type === criteria.type);
  }

  if (criteria.category) {
    partners = partners.filter(
      (partner) => partner.data.category === criteria.category,
    );
  }

  if (criteria.location) {
    partners = await getPartnersByLocation(criteria.location);
  }

  if (criteria.featuredOnly) {
    partners = partners.filter((partner) => partner.data.featured);
  }

  return partners;
}

/** Aggregate partner statistics */
export async function getPartnershipStatistics(): Promise<{
  total: number;
  featured: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byCountry: Record<string, number>;
}> {
  const partners = await loadPartnerEntries();
  const [byType, byCategory, byCountry] = await Promise.all([
    getPartnerCountByType(),
    getPartnerCountByCategory(),
    getPartnerCountByCountry(),
  ]);

  return {
    total: partners.length,
    featured: partners.filter((partner) => partner.data.featured).length,
    byType,
    byCategory,
    byCountry,
  };
}
