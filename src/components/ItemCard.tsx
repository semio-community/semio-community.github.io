import React, { type ReactNode } from "react";
import { getStatusColor, getStatusLabel } from "@/config/statusConfig";

export interface ItemCardProps {
  title: string;
  description?: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
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
  };
}

export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  description,
  href,
  imageUrl,
  imageAlt,
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

  // Type icons as fallback when no image
  const typeIcons: Record<string, ReactNode> = {
    hardware: (
      <svg
        className="w-20 h-20 text-accent-one/30 group-hover:scale-110 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12" y2="18"></line>
      </svg>
    ),
    software: (
      <svg
        className="w-20 h-20 text-accent-one/30 group-hover:scale-110 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    people: (
      <svg
        className="w-20 h-20 text-accent-one/30 group-hover:scale-110 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    partners: (
      <svg
        className="w-20 h-20 text-accent-one/30 group-hover:scale-110 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    studies: (
      <svg
        className="w-20 h-20 text-accent-one/30 group-hover:scale-110 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    ),
    events: (
      <svg
        className="w-20 h-20 text-accent-one/30 group-hover:scale-110 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
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
      {imageUrl ? (
        <div className="mb-4">
          <div className="aspect-video overflow-hidden bg-gradient-to-br from-special-lighter to-special relative">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      ) : (
        /* Icon fallback when no image */
        <div className="mb-4">
          <div className="aspect-video overflow-hidden bg-gradient-to-br from-special-lighter to-special flex items-center justify-center relative">
            {typeIcons[type]}
          </div>
        </div>
      )}

      {/* Content section */}
      <div className="flex flex-col flex-1 p-6 pt-0">
        {/* Title */}
        <h3 className="font-semibold mb-2 text-accent-base group-hover:text-accent-two transition-colors flex items-center gap-2">
          {title}
          {featured && (
            <svg
              className="w-5 h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
              />
              <path
                fill="currentColor"
                fillOpacity="0.25"
                d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
              />
            </svg>
          )}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-color-600 dark:text-color-400 mb-3 line-clamp-2 flex-1">
            {description}
          </p>
        )}

        {/* Footer section */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {/* Status */}
            {displayStatus && (
              <span className={`text-sm ${statusColor}`}>{displayStatus}</span>
            )}

            {/* Category */}
            {category && !displayStatus && (
              <span className="text-sm text-color-600 dark:text-color-400">
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
                    <svg
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
                    </svg>
                  </button>
                )}
                {links.demo && (
                  <button
                    type="button"
                    className="text-color-600 hover:text-accent-one transition-colors p-0 bg-transparent border-0"
                    title="Demo"
                    onClick={(e) => handleLinkClick(e, links.demo!)}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                  </button>
                )}
                {links.website && (
                  <button
                    type="button"
                    className="text-color-600 hover:text-accent-one transition-colors p-0 bg-transparent border-0"
                    title="Website"
                    onClick={(e) => handleLinkClick(e, links.website!)}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Arrow icon */}
          <svg
            className="w-5 h-5 text-accent-one group-hover:text-accent-two transition-colors"
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
};
