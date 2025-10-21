import React from "react";
import type { CollectionEntry } from "astro:content";
import { ItemListElement } from "@/components/cards/ItemListElement";

export interface PersonListElementProps {
  personId: string;
  data: CollectionEntry<"people">["data"];
  affiliationLabel?: string;
  className?: string;
}

export const PersonListElement: React.FC<PersonListElementProps> = ({
  personId,
  data,
  affiliationLabel,
  className,
}) => {
  const fullName =
    (data.honorific ? `${data.honorific} ${data.name}` : data.name) || personId;

  // Prefer explicitly marked primary affiliation, then any current (no endDate).
  const currentAffiliation =
    data.affiliations?.find((aff) => aff.isPrimary) ??
    data.affiliations?.find((aff) => !aff.endDate);

  // Human-readable affiliation label (prefer prop; fallback to id)
  const affiliation = affiliationLabel || currentAffiliation?.organizationId;

  // Compose secondary line as "{affiliation} · {title}" when available (no separator if one is missing)
  const description = (() => {
    const parts = [affiliation, data.title].filter(Boolean) as string[];
    return parts.length ? parts.join(" · ") : undefined;
  })();

  return (
    <ItemListElement
      title={fullName}
      description={description}
      href={`/people/${personId}`}
      type="people"
      logo={data.images?.avatar}
      imageAlt={fullName}
      featuredState={data.featured ? "featured" : "not-featured"}
      className={className}
    />
  );
};

export default PersonListElement;
