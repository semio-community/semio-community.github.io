import { getCollection, getEntry } from "astro:content";
import type { CollectionEntry } from "astro:content";

/** Get all people entries */
export async function getAllPeople(): Promise<CollectionEntry<"people">[]> {
  return await getCollection("people", ({ data }) => {
    // In production, exclude drafts and only show public people. In development, show all.
    if (import.meta.env.PROD) {
      return data.draft !== true && data.visibility === "public";
    }
    return true;
  });
}

/** Get a single person by ID */
export async function getPerson(
  id: string,
): Promise<CollectionEntry<"people"> | undefined> {
  const person = await getEntry("people", id);
  // In production, return undefined if the person is a draft or not public
  if (person && import.meta.env.PROD) {
    if (person.data.draft === true || person.data.visibility !== "public") {
      return undefined;
    }
  }
  return person;
}

/** Get people by organization */
export async function getPeopleByOrganization(
  partnerId: string,
): Promise<CollectionEntry<"people">[]> {
  const allPeople = await getAllPeople();
  return allPeople.filter((person) =>
    person.data.affiliations?.some(
      (aff) => aff.partnerId === partnerId && aff.current,
    ),
  );
}

/** Get person with expanded affiliations */
export async function getPersonWithAffiliations(personId: string) {
  const person = await getPerson(personId);
  if (!person) return null;

  const affiliations = await Promise.all(
    (person.data.affiliations || []).map(async (aff) => ({
      ...aff,
      organization: await getEntry("partners", aff.partnerId),
    })),
  );

  return {
    ...person,
    affiliations,
  };
}

/** Get featured people */
export async function getFeaturedPeople(): Promise<
  CollectionEntry<"people">[]
> {
  const allPeople = await getAllPeople();
  return allPeople.filter((person) => person.data.featured);
}

/** Get people by expertise area */
export async function getPeopleByExpertise(
  expertise: string,
): Promise<CollectionEntry<"people">[]> {
  const allPeople = await getAllPeople();
  return allPeople.filter((person) =>
    person.data.expertise?.some((exp) =>
      exp.toLowerCase().includes(expertise.toLowerCase()),
    ),
  );
}

/** Get all unique expertise areas */
export async function getUniqueExpertiseAreas(): Promise<string[]> {
  const allPeople = await getAllPeople();
  const expertiseAreas = allPeople.flatMap(
    (person) => person.data.expertise || [],
  );
  return [...new Set(expertiseAreas)].sort();
}

/** Get people count by organization */
export async function getPeopleCountByOrganization(): Promise<
  Record<string, number>
> {
  const allPeople = await getAllPeople();
  const counts: Record<string, number> = {};

  allPeople.forEach((person) => {
    person.data.affiliations?.forEach((aff) => {
      if (aff.current) {
        counts[aff.partnerId] = (counts[aff.partnerId] || 0) + 1;
      }
    });
  });

  return counts;
}

/** Search people by query */
export async function searchPeople(
  query: string,
): Promise<CollectionEntry<"people">[]> {
  const allPeople = await getAllPeople();
  const lowerQuery = query.toLowerCase();

  return allPeople.filter((person) => {
    return (
      person.data.name.toLowerCase().includes(lowerQuery) ||
      (person.data.displayName &&
        person.data.displayName.toLowerCase().includes(lowerQuery)) ||
      (person.data.bio && person.data.bio.toLowerCase().includes(lowerQuery)) ||
      (person.data.title &&
        person.data.title.toLowerCase().includes(lowerQuery)) ||
      (person.data.expertise &&
        person.data.expertise.some((exp) =>
          exp.toLowerCase().includes(lowerQuery),
        ))
    );
  });
}

/** Get author names for a study */
export async function getAuthorNamesForStudy(
  authors: Array<{ personId: string; order: number }>,
): Promise<string[]> {
  // Sort authors by order first
  const sortedAuthors = [...authors].sort((a, b) => a.order - b.order);

  // Fetch person data for each author
  const authorNames = await Promise.all(
    sortedAuthors.map(async (author) => {
      const person = await getPerson(author.personId);
      return person?.data.displayName || person?.data.name || "Unknown Author";
    }),
  );

  return authorNames;
}

/** Get formatted author string for display */
export async function getFormattedAuthors(
  authors: Array<{ personId: string; order: number }>,
  maxDisplay: number = 3,
): Promise<string> {
  const authorNames = await getAuthorNamesForStudy(authors);

  if (authorNames.length === 0) return "Unknown Authors";
  if (authorNames.length === 1) return authorNames[0] || "Unknown Author";
  if (authorNames.length === 2)
    return `${authorNames[0]} and ${authorNames[1]}`;
  if (authorNames.length <= maxDisplay) {
    const last = authorNames.pop();
    return last
      ? `${authorNames.join(", ")}, and ${last}`
      : authorNames.join(", ");
  }

  return `${authorNames.slice(0, maxDisplay).join(", ")} et al.`;
}

/** Get people statistics */
export async function getPeopleStatistics() {
  const allPeople = await getAllPeople();
  const expertiseAreas = await getUniqueExpertiseAreas();
  const orgCounts = await getPeopleCountByOrganization();

  return {
    total: allPeople.length,
    featured: allPeople.filter((p) => p.data.featured).length,
    withOrcid: allPeople.filter((p) => p.data.orcid).length,
    withGoogleScholar: allPeople.filter((p) => p.data.googleScholar).length,
    uniqueExpertiseCount: expertiseAreas.length,
    uniqueOrganizationCount: Object.keys(orgCounts).length,
  };
}

/** Get related people based on expertise and affiliations */
export async function getRelatedPeople(
  currentPerson: CollectionEntry<"people">,
  limit: number = 3,
): Promise<CollectionEntry<"people">[]> {
  const allPeople = await getAllPeople();

  // Filter out the current person
  const otherPeople = allPeople.filter((p) => p.id !== currentPerson.id);

  // Score each person based on similarity
  const scoredPeople = otherPeople.map((person) => {
    let score = 0;

    // Score for shared expertise areas
    if (currentPerson.data.expertise && person.data.expertise) {
      const currentExpertise = new Set(
        currentPerson.data.expertise.map((e) => e.toLowerCase()),
      );
      const sharedExpertise = person.data.expertise.filter((e) =>
        currentExpertise.has(e.toLowerCase()),
      );
      score += sharedExpertise.length * 3;
    }

    // Score for shared current affiliations
    if (currentPerson.data.affiliations && person.data.affiliations) {
      const currentOrgs = new Set(
        currentPerson.data.affiliations
          .filter((a) => a.current)
          .map((a) => a.partnerId),
      );
      const sharedOrgs = person.data.affiliations.filter(
        (a) => a.current && currentOrgs.has(a.partnerId),
      );
      score += sharedOrgs.length * 2;
    }

    // Bonus for featured people
    if (person.data.featured) {
      score += 0.5;
    }

    return { person, score };
  });

  // Sort by score and return top matches
  return scoredPeople
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ person }) => person);
}
