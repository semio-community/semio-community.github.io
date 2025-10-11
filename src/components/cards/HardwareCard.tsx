import React from "react";
import { ItemCard } from "@/components/ItemCard";

export interface HardwareCardProps {
  hardwareId: string;
  data: {
    name?: string;
    description?: string;
    shortDescription?: string;
    category?: string;
    status?: string;
    images?: {
      logo?: any;
      hero?: any;
    };
    links?: {
      github?: string;
      documentation?: string;
      website?: string;
      demo?: string;
    };
    featured?: boolean;
  };
  className?: string;
}

export const HardwareCard: React.FC<HardwareCardProps> = ({
  hardwareId,
  data,
  className,
}) => {
  // Build category label
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
      imageAlt={data.images?.hero?.alt || data.name}
      logo={data.images?.logo}
      status={data.status}
      category={categoryLabel}
      featured={data.featured}
      links={{
        github: data.links?.github,
        docs: data.links?.documentation,
        website: data.links?.website,
        demo: data.links?.demo,
      }}
    />
  );
};
