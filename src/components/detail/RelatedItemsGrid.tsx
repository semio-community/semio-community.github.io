import React from "react";
import { ItemCard } from "../ItemCard";

export interface RelatedItem {
  id: string;
  data: {
    name?: string;
    title?: string;
    displayName?: string;
    shortDescription?: string;
    description?: string;
    abstract?: string;
    status?: string;
    type?: string;
    category?: string;
    featured?: boolean;
    images?: {
      hero?: { src: string };
    };
    avatar?: { src: string };
    logo?: { src: string };
    thumbnail?: { src: string };
    banner?: { src: string };
    links?: {
      github?: string;
      documentation?: string;
      demo?: string;
    };
  };
}

export interface RelatedItemsGridProps {
  title?: string;
  subtitle?: string;
  items: RelatedItem[];
  itemType?:
    | "hardware"
    | "software"
    | "people"
    | "partners"
    | "studies"
    | "events";
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const RelatedItemsGrid: React.FC<RelatedItemsGridProps> = ({
  title = "Related Items",
  subtitle,
  items,
  itemType = "hardware",
  columns = 3,
  className = "",
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const getItemTitle = (item: RelatedItem) => {
    return (
      item.data.name || item.data.title || item.data.displayName || item.id
    );
  };

  const getItemDescription = (item: RelatedItem) => {
    return (
      item.data.shortDescription ||
      item.data.description ||
      item.data.abstract ||
      ""
    );
  };

  const getItemImage = (item: RelatedItem) => {
    const data = item.data;
    if (data.images?.hero?.src) return data.images.hero.src;
    if (data.avatar?.src) return data.avatar.src;
    if (data.logo?.src) return data.logo.src;
    if (data.thumbnail?.src) return data.thumbnail.src;
    if (data.banner?.src) return data.banner.src;
    return null;
  };

  const getItemUrl = (item: RelatedItem) => {
    return `/${itemType}/${item.id}`;
  };

  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={`mt-12 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && (
          <p className="text-color-600 dark:text-color-400">{subtitle}</p>
        )}
      </div>

      <div className={`grid ${gridColumns[columns]} gap-6`}>
        {items.map((item) => {
          const imageUrl = getItemImage(item);
          const itemTitle = getItemTitle(item);
          const description = getItemDescription(item);
          const url = getItemUrl(item);

          return (
            <ItemCard
              key={item.id}
              title={itemTitle}
              description={description || ""}
              href={url}
              imageUrl={imageUrl || undefined}
              status={item.data.status}
              category={item.data.category}
              featured={item.data.featured}
              type={itemType}
              links={{
                github: item.data.links?.github,
                docs: item.data.links?.documentation,
                demo: item.data.links?.demo,
              }}
            />
          );
        })}
      </div>
    </section>
  );
};
