import React from "react";
import { ItemCard } from "@/components/ItemCard";

export interface SoftwareCardProps {
  softwareId: string;
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
      pypi?: string;
      npm?: string;
    };
    featured?: boolean;
  };
  className?: string;
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  softwareId,
  data,
  className,
}) => {
  // Build category label
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
        pypi: data.links?.pypi,
        npm: data.links?.npm,
      }}
    />
  );
};
