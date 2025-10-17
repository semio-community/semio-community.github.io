import React from "react";
import type { CollectionEntry } from "astro:content";
import { ItemCard } from "@/components/cards/ItemCard";

export interface SoftwareCardProps {
  softwareId: string;
  data: CollectionEntry<"software">["data"];
  className?: string;
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  softwareId,
  data,
  className: _className,
}) => {
  const categoryLabel = data.category
    ? data.category.charAt(0).toUpperCase() + data.category.slice(1)
    : "";

  return (
    <ItemCard
      title={data.name || softwareId}
      description={data.shortDescription || data.description}
      href={`/software/${softwareId}`}
      type="software"
      image={data.images?.hero}
      imageAlt={data.name}
      logo={data.images?.logo}
      status={data.status}
      category={categoryLabel}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: data.links?.website,
        github: data.links?.github || data.links?.code,
        docs: data.links?.documentation,
        demo: data.links?.demo,
        pypi: data.links?.pypi,
        npm: data.links?.npm,
      }}
    />
  );
};
