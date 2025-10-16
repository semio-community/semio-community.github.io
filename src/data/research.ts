import { type CollectionEntry, getCollection } from "astro:content";

/** Get all research entries, sorted by featured status, citations, and year */
export async function getAllResearch(): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getCollection("research", ({ data }) => {
    // In production, exclude drafts. In development, show all.
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return researchEntries.sort((a, b) => {
    // Sort by featured first
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    // Then by year (most recent first)
    if (a.data.year !== b.data.year) {
      return b.data.year - a.data.year;
    }

    // Then by citations (highest first)
    if (a.data.citations !== b.data.citations) {
      return b.data.citations - a.data.citations;
    }

    // Finally by title
    return a.data.title.localeCompare(b.data.title);
  });
}

/** Get research entries filtered by type */
export async function getResearchByType(
  type: "paper" | "thesis" | "report" | "preprint" | "dataset" | "benchmark",
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter((study) => study.data.type === type);
}

/** Get featured research entries */
export async function getFeaturedResearch(): Promise<
  CollectionEntry<"research">[]
> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter((study) => study.data.featured);
}

/** Get research entries by year */
export async function getResearchByYear(
  year: number,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter((study) => study.data.year === year);
}

/** Get research entries within a year range */
export async function getResearchByYearRange(
  startYear: number,
  endYear: number,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter(
    (study) => study.data.year >= startYear && study.data.year <= endYear,
  );
}

/** Get research entries by research area */
export async function getResearchByResearchArea(
  area: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter((study) =>
    study.data.researchArea.some(
      (researchArea) => researchArea.toLowerCase() === area.toLowerCase(),
    ),
  );
}

/** Get research entries by author */
export async function getResearchByAuthor(
  authorName: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter((study) =>
    study.data.authors.some((author) =>
      author.personId.toLowerCase().includes(authorName.toLowerCase()),
    ),
  );
}

/** Get research entries by affiliation */
export async function getResearchByAffiliation(
  affiliation: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter((study) =>
    study.data.authors.some(
      (author) =>
        author.affiliationSnapshot
          ?.toLowerCase()
          .includes(affiliation.toLowerCase()) ?? false,
    ),
  );
}

/** Get research entries by venue (conference or journal) */
export async function getResearchByVenue(
  venue: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter(
    (study) =>
      study.data.venue?.toLowerCase().includes(venue.toLowerCase()) ?? false,
  );
}

/** Get research entries by keyword */
export async function getResearchByKeyword(
  keyword: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter((study) =>
    study.data.keywords.some((kw) =>
      kw.toLowerCase().includes(keyword.toLowerCase()),
    ),
  );
}

/** Get research entries related to specific hardware */
export async function getResearchByHardware(
  hardwareId: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter(
    (study) =>
      study.data.relatedHardware?.some(
        (hw) => hw.toLowerCase() === hardwareId.toLowerCase(),
      ) ?? false,
  );
}

/** Get research entries related to specific software */
export async function getResearchBySoftware(
  softwareId: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries.filter(
    (study) =>
      study.data.relatedSoftware?.some(
        (sw) => sw.toLowerCase() === softwareId.toLowerCase(),
      ) ?? false,
  );
}

/** Get most cited researchEntries */
export async function getMostCitedResearch(
  limit: number = 10,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries
    .sort((a, b) => b.data.citations - a.data.citations)
    .slice(0, limit);
}

/** Get recent researchEntries */
export async function getRecentResearch(
  limit: number = 10,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  return researchEntries
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, limit);
}

/** Get all unique research areas */
export async function getUniqueResearchAreas(): Promise<string[]> {
  const researchEntries = await getAllResearch();
  const areas = researchEntries.flatMap((study) => study.data.researchArea);
  return [...new Set(areas)].sort();
}

/** Get all unique keywords */
export async function getUniqueResearchKeywords(): Promise<string[]> {
  const researchEntries = await getAllResearch();
  const keywords = researchEntries.flatMap((study) => study.data.keywords);
  return [...new Set(keywords)].sort();
}

/** Get all unique venues */
export async function getUniqueResearchVenues(): Promise<string[]> {
  const researchEntries = await getAllResearch();
  const venues = researchEntries
    .map((study) => study.data.venue)
    .filter((venue): venue is string => venue !== undefined);
  return [...new Set(venues)].sort();
}

/** Get all unique authors */
export async function getUniqueResearchAuthors(): Promise<
  Array<{
    name: string;
    affiliation?: string;
    count: number;
  }>
> {
  const researchEntries = await getAllResearch();
  const authorMap = new Map<string, { affiliation?: string; count: number }>();

  researchEntries.forEach((study) => {
    study.data.authors.forEach((author) => {
      const existing = authorMap.get(author.personId);
      if (existing) {
        existing.count++;
        if (!existing.affiliation && author.affiliationSnapshot) {
          existing.affiliation = author.affiliationSnapshot;
        }
      } else {
        authorMap.set(author.personId, {
          ...(author.affiliationSnapshot && {
            affiliation: author.affiliationSnapshot,
          }),
          count: 1,
        });
      }
    });
  });

  return Array.from(authorMap.entries())
    .map(([personId, data]) => ({ name: personId, ...data }))
    .sort((a, b) => b.count - a.count);
}

/** Get study count by type */
export async function getResearchCountByType(): Promise<Record<string, number>> {
  const researchEntries = await getAllResearch();
  return researchEntries.reduce(
    (acc, study) => {
      const type = study.data.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get study count by year */
export async function getResearchCountByYear(): Promise<Record<number, number>> {
  const researchEntries = await getAllResearch();
  return researchEntries.reduce(
    (acc, study) => {
      const year = study.data.year;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );
}

/** Get study count by research area */
export async function getResearchCountByResearchArea(): Promise<
  Record<string, number>
> {
  const researchEntries = await getAllResearch();
  const counts: Record<string, number> = {};

  researchEntries.forEach((study) => {
    study.data.researchArea.forEach((area) => {
      counts[area] = (counts[area] || 0) + 1;
    });
  });

  return counts;
}

/** Search researchEntries by query string */
export async function searchResearch(
  query: string,
): Promise<CollectionEntry<"research">[]> {
  const researchEntries = await getAllResearch();
  const lowerQuery = query.toLowerCase();

  return researchEntries.filter((study) => {
    return (
      study.data.title.toLowerCase().includes(lowerQuery) ||
      study.data.abstract.toLowerCase().includes(lowerQuery) ||
      study.data.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowerQuery),
      ) ||
      study.data.researchArea.some((area) =>
        area.toLowerCase().includes(lowerQuery),
      ) ||
      study.data.authors.some(
        (author) =>
          author.personId.toLowerCase().includes(lowerQuery) ||
          (author.affiliationSnapshot?.toLowerCase().includes(lowerQuery) ??
            false),
      ) ||
      (study.data.venue?.toLowerCase().includes(lowerQuery) ?? false)
    );
  });
}

/** Get related researchEntries (by shared keywords, research areas, or authors) */
export async function getRelatedResearch(
  currentStudy: CollectionEntry<"research">,
  limit: number = 5,
): Promise<CollectionEntry<"research">[]> {
  const allEntries = await getAllResearch();

  // Filter out the current study
  const otherEntries = allEntries.filter(
    (study) => study.id !== currentStudy.id,
  );

  // Score each study based on shared attributes
  const scored = otherEntries.map((study) => {
    let score = 0;

    // Score for shared keywords
    const sharedKeywords = study.data.keywords.filter((keyword) =>
      currentStudy.data.keywords.includes(keyword),
    );
    score += sharedKeywords.length * 3;

    // Score for shared research areas
    const sharedAreas = study.data.researchArea.filter((area) =>
      currentStudy.data.researchArea.includes(area),
    );
    score += sharedAreas.length * 4;

    // Score for shared authors
    const sharedAuthors = study.data.authors.filter((author) =>
      currentStudy.data.authors.some(
        (currentAuthor) => currentAuthor.personId === author.personId,
      ),
    );
    score += sharedAuthors.length * 5;

    // Score for same type
    if (study.data.type === currentStudy.data.type) {
      score += 1;
    }

    // Score for same venue
    if (
      study.data.venue &&
      currentStudy.data.venue &&
      study.data.venue === currentStudy.data.venue
    ) {
      score += 2;
    }

    // Score for related hardware
    if (currentStudy.data.relatedHardware && study.data.relatedHardware) {
      const sharedHardware = study.data.relatedHardware.filter((hw) =>
        currentStudy.data.relatedHardware!.includes(hw),
      );
      score += sharedHardware.length * 2;
    }

    // Score for related software
    if (currentStudy.data.relatedSoftware && study.data.relatedSoftware) {
      const sharedSoftware = study.data.relatedSoftware.filter((sw) =>
        currentStudy.data.relatedSoftware!.includes(sw),
      );
      score += sharedSoftware.length * 2;
    }

    // Slight preference for researchEntries from the same year or nearby years
    const yearDiff = Math.abs(study.data.year - currentStudy.data.year);
    if (yearDiff <= 1) {
      score += 1;
    }

    return { study, score };
  });

  // Sort by score and return top researchEntries
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ study }) => study);
}

/** Group researchEntries by year for timeline view */
export function groupResearchByYear(
  researchEntries: CollectionEntry<"research">[],
): Record<number, CollectionEntry<"research">[]> {
  const grouped: Record<number, CollectionEntry<"research">[]> = {};

  researchEntries.forEach((study) => {
    const year = study.data.year;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(study);
  });

  // Sort researchEntries within each year by citations
  Object.keys(grouped).forEach((key) => {
    const yearGroup = grouped[Number(key)];
    if (yearGroup) {
      yearGroup.sort((a, b) => b.data.citations - a.data.citations);
    }
  });

  return grouped;
}

/** Group researchEntries by type */
export function groupResearchByType(
  researchEntries: CollectionEntry<"research">[],
): Record<string, CollectionEntry<"research">[]> {
  const grouped: Record<string, CollectionEntry<"research">[]> = {};

  researchEntries.forEach((study) => {
    const type = study.data.type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(study);
  });

  return grouped;
}

/** Filter researchEntries by multiple criteria */
export async function filterResearch(criteria: {
  type?: string;
  yearFrom?: number;
  yearTo?: number;
  researchAreas?: string[];
  keywords?: string[];
  authors?: string[];
  venues?: string[];
  minCitations?: number;
  relatedHardware?: string[];
  relatedSoftware?: string[];
}): Promise<CollectionEntry<"research">[]> {
  let researchEntries = await getAllResearch();

  if (criteria.type) {
    researchEntries = researchEntries.filter((study) => study.data.type === criteria.type);
  }

  if (criteria.yearFrom) {
    researchEntries = researchEntries.filter((study) => study.data.year >= criteria.yearFrom!);
  }

  if (criteria.yearTo) {
    researchEntries = researchEntries.filter((study) => study.data.year <= criteria.yearTo!);
  }

  if (criteria.researchAreas && criteria.researchAreas.length > 0) {
    researchEntries = researchEntries.filter((study) =>
      criteria.researchAreas!.some((area) =>
        study.data.researchArea.some((studyArea) =>
          studyArea.toLowerCase().includes(area.toLowerCase()),
        ),
      ),
    );
  }

  if (criteria.keywords && criteria.keywords.length > 0) {
    researchEntries = researchEntries.filter((study) =>
      criteria.keywords!.some((keyword) =>
        study.data.keywords.some((studyKeyword) =>
          studyKeyword.toLowerCase().includes(keyword.toLowerCase()),
        ),
      ),
    );
  }

  if (criteria.authors && criteria.authors.length > 0) {
    researchEntries = researchEntries.filter((study) =>
      criteria.authors!.some((author) =>
        study.data.authors.some((studyAuthor) =>
          studyAuthor.personId.toLowerCase().includes(author.toLowerCase()),
        ),
      ),
    );
  }

  if (criteria.venues && criteria.venues.length > 0) {
    researchEntries = researchEntries.filter((study) =>
      criteria.venues!.some(
        (venue) =>
          study.data.venue?.toLowerCase().includes(venue.toLowerCase()) ??
          false,
      ),
    );
  }

  if (criteria.minCitations !== undefined) {
    researchEntries = researchEntries.filter(
      (study) => study.data.citations >= criteria.minCitations!,
    );
  }

  if (criteria.relatedHardware && criteria.relatedHardware.length > 0) {
    researchEntries = researchEntries.filter((study) =>
      criteria.relatedHardware!.some(
        (hw) => study.data.relatedHardware?.includes(hw) ?? false,
      ),
    );
  }

  if (criteria.relatedSoftware && criteria.relatedSoftware.length > 0) {
    researchEntries = researchEntries.filter((study) =>
      criteria.relatedSoftware!.some(
        (sw) => study.data.relatedSoftware?.includes(sw) ?? false,
      ),
    );
  }

  return researchEntries;
}

/** Get study statistics */
export async function getResearchStatistics(): Promise<{
  total: number;
  byType: Record<string, number>;
  byYear: Record<number, number>;
  averageCitations: number;
  totalCitations: number;
  mostCitedStudy?: CollectionEntry<"research">;
  mostRecentStudy?: CollectionEntry<"research">;
  uniqueAuthorsCount: number;
  uniqueVenuesCount: number;
}> {
  const researchEntries = await getAllResearch();
  const totalCitations = researchEntries.reduce(
    (sum, study) => sum + study.data.citations,
    0,
  );
  const averageCitations =
    researchEntries.length > 0 ? totalCitations / researchEntries.length : 0;

  const sortedByCitations = [...researchEntries].sort(
    (a, b) => b.data.citations - a.data.citations,
  );
  const sortedByDate = [...researchEntries].sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  const authors = await getUniqueResearchAuthors();
  const venues = await getUniqueResearchVenues();

  return {
    total: researchEntries.length,
    byType: await getResearchCountByType(),
    byYear: await getResearchCountByYear(),
    averageCitations: Math.round(averageCitations),
    totalCitations,
    ...(sortedByCitations[0] && { mostCitedStudy: sortedByCitations[0] }),
    ...(sortedByDate[0] && { mostRecentStudy: sortedByDate[0] }),
    uniqueAuthorsCount: authors.length,
    uniqueVenuesCount: venues.length,
  };
}

/** Get co-authorship network data */
export async function getResearchCoAuthorshipNetwork(): Promise<{
  nodes: Array<{
    id: string;
    name: string;
    affiliation?: string;
    count: number;
  }>;
  edges: Array<{ source: string; target: string; weight: number }>;
}> {
  const researchEntries = await getAllResearch();
  const nodes = await getUniqueResearchAuthors();
  const edges: Map<string, number> = new Map();

  // Build co-authorship edges
  researchEntries.forEach((study) => {
    const authors = study.data.authors;
    for (let i = 0; i < authors.length; i++) {
      for (let j = i + 1; j < authors.length; j++) {
        const author1 = authors[i];
        const author2 = authors[j];
        if (author1?.personId && author2?.personId) {
          const key = [author1.personId, author2.personId].sort().join("|||");
          edges.set(key, (edges.get(key) || 0) + 1);
        }
      }
    }
  });

  // Convert edges to array format
  const edgeArray = Array.from(edges.entries()).map(([key, weight]) => {
    const [source, target] = key.split("|||");
    return { source, target, weight };
  });

  return {
    nodes: nodes.map((author) => ({
      id: author.name,
      name: author.name,
      ...(author.affiliation && { affiliation: author.affiliation }),
      count: author.count,
    })),
    edges: edgeArray.filter((edge) => edge.source && edge.target) as Array<{
      source: string;
      target: string;
      weight: number;
    }>,
  };
}
