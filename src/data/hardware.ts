import { type CollectionEntry, getCollection } from "astro:content";

/** Get all hardware entries, sorted by featured status and name */
export async function getAllHardware(): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getCollection("hardware", ({ data }) => {
    // In production, exclude drafts. In development, show all.
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return hardware.sort((a, b) => {
    // Sort by featured first, then by status priority, then by name
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    // Status priority: available > in-progress > coming-soon > discontinued
    const statusPriority = {
      available: 0,
      "in-progress": 1,
      "coming-soon": 2,
      discontinued: 3,
    };

    const aPriority = statusPriority[a.data.status];
    const bPriority = statusPriority[b.data.status];

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return a.data.name.localeCompare(b.data.name);
  });
}

/** Get hardware filtered by category */
export async function getHardwareByCategory(
  category: "mobile" | "social" | "assistive" | "research" | "educational",
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) => item.data.category === category);
}

/** Get hardware filtered by status */
export async function getHardwareByStatus(
  status: "available" | "in-progress" | "coming-soon" | "discontinued",
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) => item.data.status === status);
}

/** Get only featured hardware */
export async function getFeaturedHardware(): Promise<
  CollectionEntry<"hardware">[]
> {
  const hardware = await getAllHardware();
  return hardware.filter((item) => item.data.featured);
}

/** Get hardware by research area */
export async function getHardwareByResearchArea(
  area: string,
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) =>
    item.data.researchAreas.some(
      (researchArea) => researchArea.toLowerCase() === area.toLowerCase(),
    ),
  );
}

/** Get hardware by institution */
export async function getHardwareByInstitution(
  institution: string,
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) =>
    item.data.institutions.some(
      (inst) => inst.toLowerCase() === institution.toLowerCase(),
    ),
  );
}

/** Get all unique tags from hardware entries */
export function getUniqueHardwareTags(
  hardware: CollectionEntry<"hardware">[],
): string[] {
  const tags = hardware.flatMap((item) => item.data.tags);
  return [...new Set(tags)].sort();
}

/** Get all unique categories */
export async function getUniqueCategories(): Promise<string[]> {
  const hardware = await getAllHardware();
  const categories = hardware.map((item) => item.data.category);
  return [...new Set(categories)];
}

/** Get all unique research areas */
export async function getUniqueResearchAreas(): Promise<string[]> {
  const hardware = await getAllHardware();
  const areas = hardware.flatMap((item) => item.data.researchAreas);
  return [...new Set(areas)].sort();
}

/** Get all unique institutions */
export async function getUniqueInstitutions(): Promise<string[]> {
  const hardware = await getAllHardware();
  const institutions = hardware.flatMap((item) => item.data.institutions);
  return [...new Set(institutions)].sort();
}

/** Get hardware count by category */
export async function getHardwareCountByCategory(): Promise<
  Record<string, number>
> {
  const hardware = await getAllHardware();
  return hardware.reduce(
    (acc, item) => {
      const category = item.data.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get hardware count by status */
export async function getHardwareCountByStatus(): Promise<
  Record<string, number>
> {
  const hardware = await getAllHardware();
  return hardware.reduce(
    (acc, item) => {
      const status = item.data.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Search hardware by query string */
export async function searchHardware(
  query: string,
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  const lowerQuery = query.toLowerCase();

  return hardware.filter((item) => {
    return (
      item.data.name.toLowerCase().includes(lowerQuery) ||
      item.data.description.toLowerCase().includes(lowerQuery) ||
      item.data.shortDescription.toLowerCase().includes(lowerQuery) ||
      item.data.tags.some((tag) => tag.includes(lowerQuery)) ||
      item.data.researchAreas.some((area) =>
        area.toLowerCase().includes(lowerQuery),
      ) ||
      item.data.institutions.some((inst) =>
        inst.toLowerCase().includes(lowerQuery),
      )
    );
  });
}

/** Get related hardware (by shared tags or research areas) */
export async function getRelatedHardware(
  currentItem: CollectionEntry<"hardware">,
  limit: number = 3,
): Promise<CollectionEntry<"hardware">[]> {
  const allHardware = await getAllHardware();

  // Filter out the current item
  const otherHardware = allHardware.filter(
    (item) => item.id !== currentItem.id,
  );

  // Score each item based on shared tags and research areas
  const scored = otherHardware.map((item) => {
    let score = 0;

    // Score for shared tags
    const sharedTags = item.data.tags.filter((tag) =>
      currentItem.data.tags.includes(tag),
    );
    score += sharedTags.length * 2;

    // Score for shared research areas
    const sharedAreas = item.data.researchAreas.filter((area) =>
      currentItem.data.researchAreas.includes(area),
    );
    score += sharedAreas.length * 3;

    // Score for same category
    if (item.data.category === currentItem.data.category) {
      score += 1;
    }

    return { item, score };
  });

  // Sort by score and return top items
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
