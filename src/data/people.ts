import { getCollection, getEntry } from "astro:content";
import type { CollectionEntry } from "astro:content";

/** Get all people entries */
export async function getAllPeople(): Promise<CollectionEntry<"people">[]> {
  return await getCollection("people", ({ data }) => {
    // In production, only show public people. In development, show all.
    return import.meta.env.PROD ? data.visibility === "public" : true;
  });
}

/** Get a single person by ID */
export async function getPerson(
  id: string,
): Promise<CollectionEntry<"people"> | undefined> {
  return await getEntry("people", id);
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
