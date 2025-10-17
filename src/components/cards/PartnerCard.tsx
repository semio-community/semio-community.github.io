import React from "react";
import { ItemCard } from "@/components/cards/ItemCard";

export interface PartnerCardProps {
  partnerId: string;
  data: {
    name: string;
    shortName?: string;
    description?: string;
    type?: string;
    category?: string;
    images?: {
      logo?: any;
      hero?: any;
    };
    website?: string;
    featured?: boolean;
  };
  className?: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partnerId,
  data,
  className,
}) => {
  // Build category label
  const typeLabel = data.type
    ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
    : "";
  const categoryLabel = data.category
    ? data.category.charAt(0).toUpperCase() + data.category.slice(1)
    : "";

  return (
    <ItemCard
      title={data.shortName || data.name || partnerId}
      description={data.description}
      href={`/partners/${partnerId}`}
      type="partners"
      // logo={data.images?.logo}
      image={data.images?.hero}
      imageAlt={data.images?.hero?.alt || data.name}
      category={typeLabel}
      featured={data.featured}
      links={{
        website: data.website,
      }}
    />
  );
};
