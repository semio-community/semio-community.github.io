import React from "react";
import { getStatusColor, getStatusLabel } from "@/config/statusConfig";
import {
  AltArrowRight,
  Document2,
  Gallery,
  Route,
  Star,
} from "@solar-icons/react-perf/LineDuotone";
import { Avatar, type AvatarType } from "@/components/ui/Avatar";

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
  featured?: boolean;
  type?: "hardware" | "software" | "people" | "partners" | "studies" | "events";
  links?: {
    github?: string;
    docs?: string;
    demo?: string;
    website?: string;
    pypi?: string;
    npm?: string;
    registration?: string;
  };
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
  featured,
  type = "hardware",
  links,
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
    studies: "study",
    events: "event",
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
          {featured && (
            <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
          )}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-color-600 dark:text-color-400 mb-3 line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>
        )}

        {/* Footer section */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-3">
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
            {links && (
              <div className="flex gap-2">
                {links.github && (
                  <button
                    type="button"
                    className="text-color-600 hover:text-accent-one transition-colors p-0 bg-transparent border-0"
                    title="GitHub"
                    onClick={(e) => handleLinkClick(e, links.github!)}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                  </button>
                )}
                {links.docs && (
                  <button
                    type="button"
                    className="text-color-600 hover:text-accent-one transition-colors p-0 bg-transparent border-0"
                    title="Documentation"
                    onClick={(e) => handleLinkClick(e, links.docs!)}
                  >
                    <Document2 className="w-4 h-4" />
                    {/*<svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="14" x2="8" y2="14"></line>
                      <line x1="16" y1="18" x2="8" y2="18"></line>
                      <line x1="10" y1="10" x2="8" y2="10"></line>
                    </svg>*/}
                  </button>
                )}
                {links.demo && (
                  <button
                    type="button"
                    className="text-color-600 hover:text-accent-one transition-colors p-0 bg-transparent border-0"
                    title="Demo"
                    onClick={(e) => handleLinkClick(e, links.demo!)}
                  >
                    <Gallery className="w-4 h-4" />
                    {/*<svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>*/}
                  </button>
                )}
                {links.website && (
                  <button
                    type="button"
                    className="text-color-600 hover:text-accent-one transition-colors p-0 bg-transparent border-0"
                    title="Website"
                    onClick={(e) => handleLinkClick(e, links.website!)}
                  >
                    <Route className="w-4 h-4" />
                    {/*<svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>*/}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Arrow icon */}
          <AltArrowRight className="w-5 h-5 text-accent-one group-hover:text-accent-two transition-colors" />
          {/*<svg
            className="w-5 h-5 text-accent-one group-hover:text-accent-two transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>*/}
        </div>
      </div>
    </a>
  );
};
