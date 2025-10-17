import React from "react";
import type { CollectionEntry } from "astro:content";
import { ItemCard } from "@/components/cards/ItemCard";

export interface HardwareCardProps {
  hardwareId: string;
  data: CollectionEntry<"hardware">["data"];
  className?: string;
}

export const HardwareCard: React.FC<HardwareCardProps> = ({
  hardwareId,
  data,
  className: _className,
}) => {
  const categoryLabel = data.category
    ? data.category.charAt(0).toUpperCase() + data.category.slice(1)
    : "";

  return (
    <ItemCard
      title={data.name || hardwareId}
      description={data.shortDescription || data.description}
      href={`/hardware/${hardwareId}`}
      type="hardware"
      image={data.images?.hero}
      imageAlt={data.name}
      status={data.status}
      category={categoryLabel}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: data.links?.website,
        github: data.links?.github || data.links?.code,
        docs: data.links?.documentation,
        demo: data.links?.demo,
      }}
    />
  );
};
