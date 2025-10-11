import React from "react";
import { ItemCard } from "@/components/ItemCard";

export interface PersonCardProps {
  personId: string;
  data: {
    firstName?: string;
    lastName?: string;
    name?: string;
    bio?: string;
    shortBio?: string;
    role?: string;
    expertise?: string[];
    images?: {
      avatar?: any;
      hero?: any;
    };
    affiliations?: Array<{
      partnerId: string;
      role?: string;
      department?: string;
      startDate?: Date | string;
      endDate?: Date | string;
    }>;
    socialMedia?: {
      website?: string;
      github?: string;
      twitter?: string;
      linkedin?: string;
      googleScholar?: string;
      orcid?: string;
    };
    featured?: boolean;
  };
  className?: string;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  personId,
  data,
  className,
}) => {
  // Build full name
  const fullName =
    data.name ||
    [data.firstName, data.lastName].filter(Boolean).join(" ") ||
    personId;

  // Build category from role and current affiliation
  const currentAffiliation = data.affiliations?.find((aff) => !aff.endDate);
  let category = data.role || "Researcher";
  if (currentAffiliation) {
    category = `${currentAffiliation.role || data.role} • ${currentAffiliation.partnerId}`;
  }

  // Build description
  const description =
    data.bio ||
    data.shortBio ||
    (data.expertise
      ? `Expertise: ${data.expertise.slice(0, 3).join(", ")}`
      : "");

  return (
    <ItemCard
      title={fullName}
      description={description}
      href={`/people/${personId}`}
      type="people"
      logo={data.images?.avatar}
      image={data.images?.hero}
      category={currentAffiliation?.role}
      featured={data.featured}
      links={{
        website: data.socialMedia?.website,
        github: data.socialMedia?.github
          ? `https://github.com/${data.socialMedia.github}`
          : undefined,
      }}
    />
  );
};
