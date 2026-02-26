import React from "react";
import {
  DetailLinkSection as CoreLinkSection,
  type DetailLinkSectionProps as CoreLinkSectionProps,
  type BuildLinksArgs,
} from "@semio-community/ecosystem-site-core";
import {
  IconButton,
  type IconButtonSize,
  type LinkType,
} from "@/components/ui/IconButton";
import { linkPriority, normalizeLinkHref } from "@/data/links";

export interface LinkSectionProps {
  links?: Partial<Record<LinkType, string>>;
  allowed?: LinkType[];
  max?: number;
  size?: IconButtonSize;
  className?: string;
  as?: "button" | "link";
  stopPropagation?: boolean;
  external?: boolean;
}

function buildPrioritizedLinks({
  links,
  allowed,
  max,
}: BuildLinksArgs) {
  if (!links) return [];

  const seen = new Set<string>();
  const items: Array<{ type: string; href: string }> = [];

  const pushIfValid = (type: string, raw?: string) => {
    if (!raw) return;
    if (allowed && !allowed.includes(type)) return;

    const href = normalizeLinkHref(type as LinkType, raw);
    const key = `${type}:${href}`;
    if (seen.has(key)) return;

    seen.add(key);
    items.push({ type, href });
  };

  linkPriority.forEach((t) => {
    pushIfValid(t, (links as Record<string, string>)[t]);
  });

  Object.entries(links).forEach(([rawType, raw]) => {
    if (linkPriority.includes(rawType as LinkType)) return;
    pushIfValid(rawType, raw || undefined);
  });

  const ordered = items.reverse();
  return typeof max === "number" && max > 0 ? ordered.slice(0, max) : ordered;
}

export const LinkSection: React.FC<LinkSectionProps> = ({
  links,
  allowed,
  max,
  size = "md",
  className,
  as,
  stopPropagation,
  external,
}) => {
  const normalizedLinks = links as unknown as Record<string, string> | undefined;

  const props: CoreLinkSectionProps = {
    links: normalizedLinks,
    allowed: allowed as string[] | undefined,
    max,
    size,
    className,
    as,
    stopPropagation,
    external,
    buildLinks: buildPrioritizedLinks,
    renderButton: ({ type, href, size: btnSize, as: btnAs, external: btnExternal, stopPropagation: btnStop }) => (
      <IconButton
        type={type as LinkType}
        href={href}
        size={(btnSize as IconButtonSize) || size}
        as={(btnAs as "button" | "link") || as}
        external={btnExternal}
        stopPropagation={btnStop}
      />
    ),
  };

  return <CoreLinkSection {...props} />;
};

export default LinkSection;
