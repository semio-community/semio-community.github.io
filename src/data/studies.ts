import { type CollectionEntry, getCollection } from "astro:content";

/** Get all studies, sorted by featured status, citations, and year */
export async function getAllStudies(): Promise<CollectionEntry<"studies">[]> {
  const studies = await getCollection("studies");
  return studies.sort((a, b) => {
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

/** Get studies filtered by type */
export async function getStudiesByType(
  type: "paper" | "thesis" | "report" | "preprint" | "dataset" | "benchmark",
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter((study) => study.data.type === type);
}

/** Get only featured studies */
export async function getFeaturedStudies(): Promise<
  CollectionEntry<"studies">[]
> {
  const studies = await getAllStudies();
  return studies.filter((study) => study.data.featured);
}

/** Get studies by year */
export async function getStudiesByYear(
  year: number,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter((study) => study.data.year === year);
}

/** Get studies within a year range */
export async function getStudiesByYearRange(
  startYear: number,
  endYear: number,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter(
    (study) => study.data.year >= startYear && study.data.year <= endYear,
  );
}

/** Get studies by research area */
export async function getStudiesByResearchArea(
  area: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter((study) =>
    study.data.researchArea.some(
      (researchArea) => researchArea.toLowerCase() === area.toLowerCase(),
    ),
  );
}

/** Get studies by author name */
export async function getStudiesByAuthor(
  authorName: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter((study) =>
    study.data.authors.some((author) =>
      author.name.toLowerCase().includes(authorName.toLowerCase()),
    ),
  );
}

/** Get studies by affiliation */
export async function getStudiesByAffiliation(
  affiliation: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter((study) =>
    study.data.authors.some(
      (author) =>
        author.affiliation?.toLowerCase().includes(affiliation.toLowerCase()) ??
        false,
    ),
  );
}

/** Get studies by venue (conference or journal) */
export async function getStudiesByVenue(
  venue: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter(
    (study) =>
      study.data.venue?.toLowerCase().includes(venue.toLowerCase()) ?? false,
  );
}

/** Get studies by keyword */
export async function getStudiesByKeyword(
  keyword: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter((study) =>
    study.data.keywords.some((kw) =>
      kw.toLowerCase().includes(keyword.toLowerCase()),
    ),
  );
}

/** Get studies related to specific hardware */
export async function getStudiesByHardware(
  hardwareId: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter(
    (study) =>
      study.data.relatedHardware?.some(
        (hw) => hw.toLowerCase() === hardwareId.toLowerCase(),
      ) ?? false,
  );
}

/** Get studies related to specific software */
export async function getStudiesBySoftware(
  softwareId: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies.filter(
    (study) =>
      study.data.relatedSoftware?.some(
        (sw) => sw.toLowerCase() === softwareId.toLowerCase(),
      ) ?? false,
  );
}

/** Get most cited studies */
export async function getMostCitedStudies(
  limit: number = 10,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies
    .sort((a, b) => b.data.citations - a.data.citations)
    .slice(0, limit);
}

/** Get recent studies */
export async function getRecentStudies(
  limit: number = 10,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  return studies
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, limit);
}

/** Get all unique research areas */
export async function getUniqueResearchAreas(): Promise<string[]> {
  const studies = await getAllStudies();
  const areas = studies.flatMap((study) => study.data.researchArea);
  return [...new Set(areas)].sort();
}

/** Get all unique keywords */
export async function getUniqueKeywords(): Promise<string[]> {
  const studies = await getAllStudies();
  const keywords = studies.flatMap((study) => study.data.keywords);
  return [...new Set(keywords)].sort();
}

/** Get all unique venues */
export async function getUniqueVenues(): Promise<string[]> {
  const studies = await getAllStudies();
  const venues = studies
    .map((study) => study.data.venue)
    .filter((venue): venue is string => venue !== undefined);
  return [...new Set(venues)].sort();
}

/** Get all unique authors */
export async function getUniqueAuthors(): Promise<
  Array<{
    name: string;
    affiliation?: string;
    count: number;
  }>
> {
  const studies = await getAllStudies();
  const authorMap = new Map<string, { affiliation?: string; count: number }>();

  studies.forEach((study) => {
    study.data.authors.forEach((author) => {
      const existing = authorMap.get(author.name);
      if (existing) {
        existing.count++;
        // Update affiliation if not set
        if (!existing.affiliation && author.affiliation) {
          existing.affiliation = author.affiliation;
        }
      } else {
        authorMap.set(author.name, {
          ...(author.affiliation && { affiliation: author.affiliation }),
          count: 1,
        });
      }
    });
  });

  return Array.from(authorMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);
}

/** Get study count by type */
export async function getStudyCountByType(): Promise<Record<string, number>> {
  const studies = await getAllStudies();
  return studies.reduce(
    (acc, study) => {
      const type = study.data.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get study count by year */
export async function getStudyCountByYear(): Promise<Record<number, number>> {
  const studies = await getAllStudies();
  return studies.reduce(
    (acc, study) => {
      const year = study.data.year;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );
}

/** Get study count by research area */
export async function getStudyCountByResearchArea(): Promise<
  Record<string, number>
> {
  const studies = await getAllStudies();
  const counts: Record<string, number> = {};

  studies.forEach((study) => {
    study.data.researchArea.forEach((area) => {
      counts[area] = (counts[area] || 0) + 1;
    });
  });

  return counts;
}

/** Search studies by query string */
export async function searchStudies(
  query: string,
): Promise<CollectionEntry<"studies">[]> {
  const studies = await getAllStudies();
  const lowerQuery = query.toLowerCase();

  return studies.filter((study) => {
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
          author.name.toLowerCase().includes(lowerQuery) ||
          (author.affiliation?.toLowerCase().includes(lowerQuery) ?? false),
      ) ||
      (study.data.venue?.toLowerCase().includes(lowerQuery) ?? false)
    );
  });
}

/** Get related studies (by shared keywords, research areas, or authors) */
export async function getRelatedStudies(
  currentStudy: CollectionEntry<"studies">,
  limit: number = 5,
): Promise<CollectionEntry<"studies">[]> {
  const allStudies = await getAllStudies();

  // Filter out the current study
  const otherStudies = allStudies.filter(
    (study) => study.id !== currentStudy.id,
  );

  // Score each study based on shared attributes
  const scored = otherStudies.map((study) => {
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
        (currentAuthor) => currentAuthor.name === author.name,
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

    // Slight preference for studies from the same year or nearby years
    const yearDiff = Math.abs(study.data.year - currentStudy.data.year);
    if (yearDiff <= 1) {
      score += 1;
    }

    return { study, score };
  });

  // Sort by score and return top studies
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ study }) => study);
}

/** Group studies by year for timeline view */
export function groupStudiesByYear(
  studies: CollectionEntry<"studies">[],
): Record<number, CollectionEntry<"studies">[]> {
  const grouped: Record<number, CollectionEntry<"studies">[]> = {};

  studies.forEach((study) => {
    const year = study.data.year;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(study);
  });

  // Sort studies within each year by citations
  Object.keys(grouped).forEach((key) => {
    const yearGroup = grouped[Number(key)];
    if (yearGroup) {
      yearGroup.sort((a, b) => b.data.citations - a.data.citations);
    }
  });

  return grouped;
}

/** Group studies by type */
export function groupStudiesByType(
  studies: CollectionEntry<"studies">[],
): Record<string, CollectionEntry<"studies">[]> {
  const grouped: Record<string, CollectionEntry<"studies">[]> = {};

  studies.forEach((study) => {
    const type = study.data.type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(study);
  });

  return grouped;
}

/** Filter studies by multiple criteria */
export async function filterStudies(criteria: {
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
}): Promise<CollectionEntry<"studies">[]> {
  let studies = await getAllStudies();

  if (criteria.type) {
    studies = studies.filter((study) => study.data.type === criteria.type);
  }

  if (criteria.yearFrom) {
    studies = studies.filter((study) => study.data.year >= criteria.yearFrom!);
  }

  if (criteria.yearTo) {
    studies = studies.filter((study) => study.data.year <= criteria.yearTo!);
  }

  if (criteria.researchAreas && criteria.researchAreas.length > 0) {
    studies = studies.filter((study) =>
      criteria.researchAreas!.some((area) =>
        study.data.researchArea.some((studyArea) =>
          studyArea.toLowerCase().includes(area.toLowerCase()),
        ),
      ),
    );
  }

  if (criteria.keywords && criteria.keywords.length > 0) {
    studies = studies.filter((study) =>
      criteria.keywords!.some((keyword) =>
        study.data.keywords.some((studyKeyword) =>
          studyKeyword.toLowerCase().includes(keyword.toLowerCase()),
        ),
      ),
    );
  }

  if (criteria.authors && criteria.authors.length > 0) {
    studies = studies.filter((study) =>
      criteria.authors!.some((author) =>
        study.data.authors.some((studyAuthor) =>
          studyAuthor.name.toLowerCase().includes(author.toLowerCase()),
        ),
      ),
    );
  }

  if (criteria.venues && criteria.venues.length > 0) {
    studies = studies.filter((study) =>
      criteria.venues!.some(
        (venue) =>
          study.data.venue?.toLowerCase().includes(venue.toLowerCase()) ??
          false,
      ),
    );
  }

  if (criteria.minCitations !== undefined) {
    studies = studies.filter(
      (study) => study.data.citations >= criteria.minCitations!,
    );
  }

  if (criteria.relatedHardware && criteria.relatedHardware.length > 0) {
    studies = studies.filter((study) =>
      criteria.relatedHardware!.some(
        (hw) => study.data.relatedHardware?.includes(hw) ?? false,
      ),
    );
  }

  if (criteria.relatedSoftware && criteria.relatedSoftware.length > 0) {
    studies = studies.filter((study) =>
      criteria.relatedSoftware!.some(
        (sw) => study.data.relatedSoftware?.includes(sw) ?? false,
      ),
    );
  }

  return studies;
}

/** Get study statistics */
export async function getStudyStatistics(): Promise<{
  total: number;
  byType: Record<string, number>;
  byYear: Record<number, number>;
  averageCitations: number;
  totalCitations: number;
  mostCitedStudy?: CollectionEntry<"studies">;
  mostRecentStudy?: CollectionEntry<"studies">;
  uniqueAuthorsCount: number;
  uniqueVenuesCount: number;
}> {
  const studies = await getAllStudies();
  const totalCitations = studies.reduce(
    (sum, study) => sum + study.data.citations,
    0,
  );
  const averageCitations =
    studies.length > 0 ? totalCitations / studies.length : 0;

  const sortedByCitations = [...studies].sort(
    (a, b) => b.data.citations - a.data.citations,
  );
  const sortedByDate = [...studies].sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  const authors = await getUniqueAuthors();
  const venues = await getUniqueVenues();

  return {
    total: studies.length,
    byType: await getStudyCountByType(),
    byYear: await getStudyCountByYear(),
    averageCitations: Math.round(averageCitations),
    totalCitations,
    ...(sortedByCitations[0] && { mostCitedStudy: sortedByCitations[0] }),
    ...(sortedByDate[0] && { mostRecentStudy: sortedByDate[0] }),
    uniqueAuthorsCount: authors.length,
    uniqueVenuesCount: venues.length,
  };
}

/** Get co-authorship network data */
export async function getCoAuthorshipNetwork(): Promise<{
  nodes: Array<{
    id: string;
    name: string;
    affiliation?: string;
    count: number;
  }>;
  edges: Array<{ source: string; target: string; weight: number }>;
}> {
  const studies = await getAllStudies();
  const nodes = await getUniqueAuthors();
  const edges: Map<string, number> = new Map();

  // Build co-authorship edges
  studies.forEach((study) => {
    const authors = study.data.authors;
    for (let i = 0; i < authors.length; i++) {
      for (let j = i + 1; j < authors.length; j++) {
        const author1 = authors[i];
        const author2 = authors[j];
        if (author1?.name && author2?.name) {
          const key = [author1.name, author2.name].sort().join("|||");
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
