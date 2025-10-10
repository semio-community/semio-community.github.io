import React from "react";

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
  };
}

export interface RelatedItemsGridProps {
  title?: string;
  subtitle?: string;
  items: RelatedItem[];
  itemType?: 'hardware' | 'software' | 'people' | 'partners' | 'studies' | 'events';
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const RelatedItemsGrid: React.FC<RelatedItemsGridProps> = ({
  title = "Related Items",
  subtitle,
  items,
  itemType = 'hardware',
  columns = 3,
  className = "",
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const getItemTitle = (item: RelatedItem) => {
    return item.data.name || item.data.title || item.data.displayName || item.id;
  };

  const getItemDescription = (item: RelatedItem) => {
    return item.data.shortDescription || item.data.description || item.data.abstract || "";
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

  const getStatusColor = (status?: string) => {
    const statusColors: Record<string, string> = {
      // Hardware
      'available': 'text-green-600 dark:text-green-400',
      'in-progress': 'text-yellow-600 dark:text-yellow-400',
      'coming-soon': 'text-blue-600 dark:text-blue-400',
      'deprecated': 'text-red-600 dark:text-red-400',
      // Software
      'stable': 'text-green-600 dark:text-green-400',
      'beta': 'text-blue-600 dark:text-blue-400',
      'alpha': 'text-yellow-600 dark:text-yellow-400',
      // Events
      'upcoming': 'text-blue-600 dark:text-blue-400',
      'ongoing': 'text-green-600 dark:text-green-400',
      'past': 'text-gray-600 dark:text-gray-400',
    };
    return status ? statusColors[status] || 'text-color-600 dark:text-color-400' : '';
  };

  const getStatusLabel = (status?: string) => {
    const statusLabels: Record<string, string> = {
      // Hardware
      'available': 'Available',
      'in-progress': 'In Progress',
      'coming-soon': 'Coming Soon',
      'deprecated': 'Deprecated',
      // Software
      'stable': 'Stable',
      'beta': 'Beta',
      'alpha': 'Alpha',
      // Events
      'upcoming': 'Upcoming',
      'ongoing': 'Happening Now',
      'past': 'Past Event',
    };
    return status ? statusLabels[status] || status : '';
  };

  const getItemUrl = (item: RelatedItem) => {
    return `/${itemType}/${item.id}`;
  };

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
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
          const image = getItemImage(item);
          const title = getItemTitle(item);
          const description = getItemDescription(item);
          const status = item.data.status;
          const statusColor = getStatusColor(status);
          const statusLabel = getStatusLabel(status);

          return (
            <a
              key={item.id}
              href={getItemUrl(item)}
              className="group p-6 bg-special-lighter rounded-lg hover:shadow-lg transition-all hover:scale-105 no-underline"
            >
              {/* Image if available */}
              {image && (
                <div className="mb-4 -mx-6 -mt-6">
                  <div className="aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-special-lighter to-special">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <h4 className="font-semibold mb-2 text-accent-base group-hover:text-accent-two transition-colors">
                  {title}
                </h4>

                {description && (
                  <p className="text-sm text-color-600 dark:text-color-400 mb-3 line-clamp-2">
                    {description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  {status && statusLabel && (
                    <span className={`text-sm ${statusColor}`}>
                      {statusLabel}
                    </span>
                  )}

                  <svg
                    className="w-5 h-5 text-accent-one group-hover:text-accent-two transition-colors ml-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
