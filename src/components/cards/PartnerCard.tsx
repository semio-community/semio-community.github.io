import React from "react";
import type { CollectionEntry } from "astro:content";
import { ItemCard } from "@/components/cards/ItemCard";

export interface PartnerCardProps {
  partnerId: string;
  data: CollectionEntry<"organizations">["data"];
  className?: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partnerId,
  data,
  className: _className,
}) => {
  const typeLabel = data.type
    ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
    : "";

  const showLogo = !data.images?.hero;

  return (
    <ItemCard
      title={data.shortName || data.name || partnerId}
      description={data.description}
      href={`/organizations/${partnerId}`}
      type="organizations"
      image={data.images?.hero}
      imageAlt={data.name}
      logo={showLogo ? data.images?.logo : undefined}
      category={typeLabel}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: data.links?.website,
        docs: data.links?.documentation,
      }}
    />
  );
};
