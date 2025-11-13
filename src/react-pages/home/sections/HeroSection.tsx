import React from "react";
import { clsx } from "clsx";
import HeroReact from "@/components/HeroReact";
import { CallToActionButton } from "@/components/ui/CallToActionButton";

/**
 * Indicator chip shown to the right of CTA text.
 * Mirrors the visual system used across Astro CTA wrappers.
 */
function Indicator({
  variant,
  children,
}: {
  variant: "default" | "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
}) {
  const indicatorClassLookup: Record<
    "default" | "primary" | "secondary" | "tertiary",
    string
  > = {
    default:
      "transition-colors px-2 bg-accent-base rounded-sm text-surface group-hover/button:bg-surface/75 group-hover/button:text-accent-base",
    primary:
      "transition-colors px-2 bg-accent-two rounded-sm text-surface group-hover/button:bg-surface/75 group-hover/button:text-accent-two",
    secondary:
      "transition-colors px-2 bg-accent-one rounded-sm text-surface group-hover/button:bg-surface/75 group-hover/button:text-accent-one",
    tertiary:
      "transition-colors px-2 bg-accent-three rounded-sm text-surface group-hover/button:bg-surface/75 group-hover/button:text-accent-three",
  };

  return <span className={indicatorClassLookup[variant]}>{children}</span>;
}

export interface HeroSectionProps {
  /**
   * Total count of active projects (hardware + software + research).
   */
  projectCount: number;
  /**
   * Count of upcoming/featured events to display.
   */
  upcomingEventCount: number;
  /**
   * Count of available services. Defaults to the current site constant.
   */
  servicesCount?: number;
  /**
   * Optional wrapper className for additional spacing or responsive tweaks.
   */
  className?: string;
  /**
   * If provided, overrides the default heading level (h1).
   */
  as?: React.ElementType;
}

/**
 * HeroSection
 *
 * A reusable composition for the homepage hero that renders:
 * - Brand headline with accent word styling
 * - Supporting intro copy
 * - CTA row with indicator chips
 *
 * This uses the shared HeroReact container (which renders the glyph field and overlays content).
 * The full-bleed outer wrapper (100vw wide) should be applied by the page layout if needed.
 */
export default function HeroSection({
  projectCount,
  upcomingEventCount,
  servicesCount = 18,
  className,
  as: HeadingTag = "h1",
}: HeroSectionProps) {
  return (
    <HeroReact className={className}>
      {/* Brand headline */}
      {React.createElement(
        HeadingTag as React.ElementType,
        {
          className:
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-3 sm:mb-4 md:mb-6",
        },
        <>
          <span className="text-accent-three font-semibold uppercase tracking-wide">
            Reproducible
          </span>{" "}
          <span className="text-accent-one font-semibold uppercase tracking-wide">
            Robot
          </span>{" "}
          <span className="text-accent-two font-semibold uppercase tracking-wide">
            Science
          </span>
        </>,
      )}

      {/* Intro copy */}
      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-color-600 dark:text-color-400 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
        A nonprofit supporting the{" "}
        <span className="font-medium text-foreground">science and systems</span>{" "}
        of
        <br className="hidden md:flex" />
        <span className="font-medium text-foreground">
          human-centered robotics
        </span>{" "}
        and{" "}
        <span className="font-medium text-foreground">
          artificial intelligence
        </span>
      </p>

      {/* CTA row */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <CallToActionButton
          href="/projects"
          size="large"
          variant="primary"
          ariaLabel="View active projects"
          className={clsx(projectCount ? "gap-4" : undefined)}
        >
          Active Projects
          {!!projectCount && (
            <Indicator variant="primary">{projectCount}</Indicator>
          )}
        </CallToActionButton>

        <CallToActionButton
          href="/services"
          size="large"
          variant="secondary"
          ariaLabel="View available services"
          className={clsx(servicesCount ? "gap-4" : undefined)}
        >
          Available Services
          {!!servicesCount && (
            <Indicator variant="secondary">{servicesCount}</Indicator>
          )}
        </CallToActionButton>

        <CallToActionButton
          href="/events"
          size="large"
          variant="tertiary"
          ariaLabel="View upcoming events"
          className={clsx(upcomingEventCount ? "gap-4" : undefined)}
        >
          Upcoming Events
          {!!upcomingEventCount && (
            <Indicator variant="tertiary">{upcomingEventCount}</Indicator>
          )}
        </CallToActionButton>
      </div>
    </HeroReact>
  );
}
