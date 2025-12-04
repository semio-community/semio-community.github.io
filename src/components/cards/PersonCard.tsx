import type { FC } from "react";
import type { CollectionEntry } from "astro:content";
import { ItemCard } from "@/components/cards/ItemCard";

export interface PersonCardProps {
  personId: string;
  data: CollectionEntry<"people">["data"];
  className?: string;
}

export const PersonCard: FC<PersonCardProps> = ({
  personId,
  data,
  className: _className,
}) => {
  const fullName = data.name || personId;

  const description =
    data.bio ||
    (data.expertise && data.expertise.length > 0
      ? `Expertise: ${data.expertise.slice(0, 3).join(", ")}`
      : undefined);

  const websiteLink = data.links?.website;
  const githubLink = data.links?.github
    ? `https://github.com/${data.links.github}`
    : undefined;

  return (
    <ItemCard
      title={fullName}
      description={description}
      href={`/people/${personId}`}
      type="people"
      logo={data.images?.avatar}
      image={data.images?.hero}
      category={data.title}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: websiteLink,
        github: githubLink,
      }}
    />
  );
};
