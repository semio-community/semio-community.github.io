import React from "react";
import { Avatar } from "@/components/ui/Avatar";

interface OrganizationChipProps {
  partnerId: string;
  partnerName?: string;
  logo?: any; // Can be string, ImageMetadata, or any image object from Astro
  role?: string;
  href?: string | null;
  className?: string;
}

export function OrganizationChip({
  partnerId,
  partnerName,
  logo,
  role,
  href,
  className = "",
}: OrganizationChipProps) {
  const displayName = partnerName || partnerId;
  const linkHref = href === null ? null : href || `/partners/${partnerId}`;

  const content = (
    <>
      <Avatar
        src={logo}
        alt={displayName}
        name={displayName}
        type="organization"
        size="xs"
      />
      <span className="text-sm font-medium text-accent-base">
        {displayName}
      </span>
      {role && <span className="text-xs text-accent-base">• {role}</span>}
    </>
  );

  if (linkHref === null) {
    // No link version
    return (
      <span
        className={`inline-flex items-center gap-2 pl-2 pr-3 py-1.5 bg-surface-lighter rounded-full border-2 border-accent-two/40 ${className}`}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={linkHref}
      className={`inline-flex items-center gap-2 pl-2 pr-3 py-1.5 bg-surface-lighter rounded-full border-2 border-accent-two/40 hover:border-accent-two transition-all no-underline ${className}`}
    >
      {content}
    </a>
  );
}
