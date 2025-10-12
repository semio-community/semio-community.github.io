import type { FC } from "react";

export interface LinkItem {
  label: string;
  value?: string;
  link: string;
  icon?: string;
  external?: boolean;
}

export interface LinkItemCardProps {
  title: string;
  items: LinkItem[];
  icon?: string;
  className?: string;
}

export const LinkItemCard: FC<LinkItemCardProps> = ({
  title,
  items,
  icon = "solar:link-minimalistic-2-line-duotone",
  className = "",
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`bg-gradient-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <span
            data-icon={icon}
            className="icon text-accent-base text-xl"
            aria-hidden="true"
          />
        )}
        <h3 className="text-xs font-semibold text-accent-base uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="flex items-start gap-3 group hover:bg-accent-one/5 p-2 -m-2 rounded-lg transition-colors"
          >
            <span
              data-icon={getLinkIcon(item.label, item.icon)}
              className="icon text-accent-two mt-0.5 text-lg flex-shrink-0 group-hover:text-accent-base transition-colors"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-color-600 dark:text-color-400 mb-0.5">
                {item.label}
              </div>
              <div className="text-sm text-color-800 dark:text-color-200 group-hover:text-accent-base transition-colors truncate">
                {item.value || item.link}
              </div>
            </div>
            {item.external && (
              <span
                data-icon="solar:arrow-right-up-line-duotone"
                className="icon text-color-500 text-sm mt-0.5 group-hover:text-accent-base transition-colors"
                aria-hidden="true"
              />
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

// Helper function to determine the appropriate icon based on the link label
function getLinkIcon(label: string, customIcon?: string): string {
  if (customIcon) return customIcon;

  const labelLower = label.toLowerCase();

  // Academic/Research
  if (labelLower.includes("orcid")) return "simple-icons:orcid";
  if (labelLower.includes("google scholar") || labelLower.includes("scholar"))
    return "solar:graduation-cap-line-duotone";
  if (labelLower.includes("researchgate")) return "simple-icons:researchgate";
  if (labelLower.includes("arxiv")) return "simple-icons:arxiv";
  if (labelLower.includes("pubmed")) return "simple-icons:pubmed";

  // Social Media
  if (labelLower.includes("twitter") || labelLower.includes("x.com"))
    return "simple-icons:x";
  if (labelLower.includes("bluesky")) return "simple-icons:bluesky";
  if (labelLower.includes("mastodon")) return "simple-icons:mastodon";
  if (labelLower.includes("linkedin")) return "simple-icons:linkedin";
  if (labelLower.includes("facebook")) return "simple-icons:facebook";
  if (labelLower.includes("instagram")) return "simple-icons:instagram";
  if (labelLower.includes("youtube")) return "simple-icons:youtube";
  if (labelLower.includes("threads")) return "simple-icons:threads";

  // Development
  if (labelLower.includes("github")) return "simple-icons:github";
  if (labelLower.includes("gitlab")) return "simple-icons:gitlab";
  if (labelLower.includes("bitbucket")) return "simple-icons:bitbucket";
  if (labelLower.includes("npm")) return "simple-icons:npm";
  if (labelLower.includes("pypi")) return "simple-icons:pypi";

  // Documentation & Resources
  if (labelLower.includes("documentation") || labelLower.includes("docs"))
    return "solar:document-text-line-duotone";
  if (labelLower.includes("demo")) return "solar:play-circle-line-duotone";
  if (labelLower.includes("tutorial")) return "solar:book-2-line-duotone";
  if (labelLower.includes("api")) return "solar:code-square-line-duotone";

  // Commerce
  if (labelLower.includes("purchase") || labelLower.includes("buy"))
    return "solar:cart-3-line-duotone";
  if (labelLower.includes("rental") || labelLower.includes("rent"))
    return "solar:calendar-mark-line-duotone";
  if (labelLower.includes("pricing")) return "solar:tag-price-line-duotone";

  // Communication
  if (labelLower.includes("email") || labelLower.includes("mail"))
    return "solar:letter-line-duotone";
  if (labelLower.includes("phone") || labelLower.includes("tel"))
    return "solar:phone-calling-line-duotone";
  if (labelLower.includes("discord")) return "simple-icons:discord";
  if (labelLower.includes("slack")) return "simple-icons:slack";
  if (labelLower.includes("telegram")) return "simple-icons:telegram";

  // Location
  if (labelLower.includes("address") || labelLower.includes("location"))
    return "solar:map-point-line-duotone";
  if (labelLower.includes("map")) return "solar:map-line-duotone";

  // Organization
  if (labelLower.includes("website") || labelLower.includes("homepage"))
    return "solar:global-line-duotone";
  if (labelLower.includes("blog"))
    return "solar:notebook-minimalistic-line-duotone";
  if (labelLower.includes("wiki"))
    return "solar:book-bookmark-minimalistic-line-duotone";
  if (labelLower.includes("forum")) return "solar:chat-round-dots-line-duotone";

  // Default
  return "solar:link-round-angle-line-duotone";
}
