import React, { useMemo, type ReactNode } from "react";
import { getStatusColor, getStatusLabel } from "@/config/statusConfig";
import { SettingsMinimalistic } from "@solar-icons/react-perf/LineDuotone";
import { FeaturedStar, type FeaturedState } from "@/components/ui/FeaturedStar";
import { Avatar, type AvatarType } from "@/components/ui/Avatar";
import { IconButton, type LinkType } from "@/components/ui/IconButton";
import { linkPriority } from "@/data/links";

export interface ItemCardProps {
  title: string;
  description?: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
  image?: {
    src: string;
    width?: number;
    height?: number;
    format?: string;
  };
  logo?: {
    src: string;
    width?: number;
    height?: number;
    format?: string;
  };
  status?: string;
  statusLabel?: string;
  category?: string;
  featuredState?: FeaturedState;
  type?:
    | "hardware"
    | "software"
    | "people"
    | "partners"
    | "research"
    | "events";
  listItems?: { icon?: ReactNode; text: string }[];
  links?: Partial<Record<LinkType, string>>;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  description,
  href,
  imageUrl,
  imageAlt,
  image,
  logo,
  status,
  statusLabel,
  category,
  featuredState = "not-featured",
  type = "hardware",
  links,
  listItems = [],
}) => {
  // Use centralized status configuration
  const displayStatus = statusLabel || getStatusLabel(status);
  const statusColor = getStatusColor(status, "text");

  // Get the image source from various formats (never use logo as main image)
  const getImageSource = () => {
    if (imageUrl) return imageUrl;
    if (image?.src) return image.src;
    return null;
  };

  const imageSrc = getImageSource();

  // Map item type to avatar type
  const typeToAvatarType: Record<string, AvatarType> = {
    hardware: "hardware",
    software: "software",
    people: "person",
    partners: "organization",
    research: "research",
    events: "event",
  };

  const linkButtons: Array<{ type: LinkType; href: string }> = useMemo(() => {
    const cardLinks: Array<{ type: LinkType; href: string }> = [];

    linkPriority.forEach((linkType) => {
      if (cardLinks.length < 5 && links?.[linkType]) {
        cardLinks.push({ type: linkType, href: links?.[linkType]! });
      }
    });
    return cardLinks.reverse();
  }, [links]);

  const showDescription = listItems.length === 0 && description;
  const showListItems = listItems.length > 0;

  return (
    <a
      href={href}
      className="group flex flex-col bg-special-lighter rounded-lg hover:shadow-lg transition-all hover:scale-105 no-underline h-full overflow-hidden"
    >
      {/* Image section */}
      {imageSrc ? (
        <div className="mb-4">
          <div className="aspect-video overflow-hidden bg-gradient-to-br from-special-lighter to-special relative">
            <img
              src={imageSrc}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Show logo/avatar overlay when both hero and logo are present */}
            {logo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar
                  src={logo}
                  name={type === "people" ? title : undefined}
                  type={typeToAvatarType[type] || "organization"}
                  size="xl"
                  className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Avatar fallback when no image */
        <div className="mb-4">
          <div className="aspect-video overflow-hidden bg-gradient-to-br from-special-lighter to-special flex items-center justify-center relative">
            <Avatar
              src={logo}
              name={type === "people" ? title : undefined}
              type={typeToAvatarType[type] || "organization"}
              size="xl"
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      )}

      {/* Content section */}
      <div className="flex flex-col flex-1 p-6 pt-0 min-h-0">
        {/* Title */}
        <h3 className="font-semibold mb-2 text-accent-base group-hover:text-accent-two transition-colors flex items-center justify-between gap-2">
          <span className="truncate">{title}</span>
          <FeaturedStar state={featuredState} size="md" />
        </h3>

        {/* Description */}
        {showDescription && (
          <p className="text-sm text-color-600 dark:text-color-400 mb-3 line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>
        )}

        {/* ListItems */}
        {showListItems && (
          <div className="text-sm text-color-600 dark:text-color-400 mb-3 min-h-[2.5rem]">
            {listItems.slice(0, 2).map((listItem) => (
              <div key={listItem.text} className="flex items-start gap-2">
                {listItem.icon ?? (
                  <SettingsMinimalistic className="text-accent-two mt-0.5 w-4 h-4 flex-shrink-0" />
                )}
                <span className="text-sm text-accent-base">
                  {listItem.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer section */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-centerb justify-between gap-3 w-full">
            {/* Status */}
            {displayStatus && (
              <span className={`text-sm ${statusColor}`}>{displayStatus}</span>
            )}

            {/* Category */}
            {category && !displayStatus && (
              <span className="text-sm text-color-600 dark:text-color-400 truncate max-w-[200px]">
                {category}
              </span>
            )}

            {/* External links */}
            {linkButtons.length > 0 && (
              <div className="flex gap-1">
                {linkButtons.map(({ type, href }) => (
                  <IconButton
                    key={`${type}-${href}`}
                    type={type}
                    href={href}
                    size="sm"
                    as="button"
                    external
                    stopPropagation
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};
