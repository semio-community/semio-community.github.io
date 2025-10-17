import React from "react";
import { clsx } from "clsx";
import Tooltip from "@/components/ui/Tooltip";
import { Star } from "@solar-icons/react-perf/Bold";
import { Star as StarOutline } from "@solar-icons/react-perf/LineDuotone";

export type FeaturedState = "featured" | "previously-featured" | "not-featured";

export type FeaturedStarSize = "sm" | "md" | "lg";

export interface FeaturedStarProps {
  // Primary way to set the state
  state?: FeaturedState;
  size?: FeaturedStarSize;
  className?: string;
  tooltipDisabled?: boolean;
  hideWhenNotFeatured?: boolean;
  glow?: boolean; // adds a subtle drop-shadow glow (used in DetailHero)
  titleOverride?: string; // override tooltip/aria label text
}

/**
 * FeaturedStar
 * Unified star icon with tooltip supporting three states:
 * - "featured": solid star, yellow
 * - "previously-featured": outline star, yellow
 * - "not-featured": outline star, neutral
 *
 * Notes:
 * - In list/card contexts, show all three states.
 * - In detail hero contexts, pass hideWhenNotFeatured to hide icon when not featured.
 */
export const FeaturedStar: React.FC<FeaturedStarProps> = ({
  state,

  size = "md",
  className,
  tooltipDisabled = false,
  hideWhenNotFeatured = false,
  glow = false,
  titleOverride,
}) => {
  const derivedState: FeaturedState = state ?? "not-featured";

  if (hideWhenNotFeatured && derivedState === "not-featured") {
    return null;
  }

  const sizeClasses: Record<FeaturedStarSize, string> = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const colorClass =
    derivedState === "featured"
      ? "text-yellow-500 dark:text-yellow-400"
      : derivedState === "previously-featured"
        ? "text-yellow-500 dark:text-yellow-400"
        : "text-neutral-500/50";

  const iconClass = clsx(sizeClasses[size], colorClass, {
    "[filter:_drop-shadow(0_2px_4px_rgb(0_0_0_/_40%))]": glow,
    "flex-shrink-0": true,
  });

  const label =
    titleOverride ??
    (derivedState === "featured"
      ? "Featured"
      : derivedState === "previously-featured"
        ? "Previously Featured"
        : "Not Featured");

  const IconComponent = derivedState === "featured" ? Star : StarOutline;

  const iconEl = <IconComponent className={iconClass} aria-hidden />;

  return (
    <Tooltip content={label} disabled={tooltipDisabled}>
      <span
        role="img"
        aria-label={label}
        className={clsx("inline-flex items-center", className)}
        data-featured-state={derivedState}
      >
        {iconEl}
      </span>
    </Tooltip>
  );
};

export default FeaturedStar;

// Small helper if needed by consumers
