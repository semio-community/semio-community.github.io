import React from "react";
import type { ImageMetadata } from "astro";
import { getStatusColor, type ChipColor } from "@/config/statusConfig";
import { Star } from "@solar-icons/react-perf/LineDuotone";

export interface DetailHeroBadge {
  text: string;
  color?:
    | "green"
    | "blue"
    | "orange"
    | "red"
    | "yellow"
    | "gray"
    | "accent"
    | "special";
  variant?: "solid" | "outline";
}

export interface DetailHeroProps {
  image?: ImageMetadata | { src: string; alt?: string };
  title: string;
  subtitle?: string;
  badges?: DetailHeroBadge[];
  featured?: boolean;
  overlayGradient?: boolean;
  className?: string;
}

export const DetailHero: React.FC<DetailHeroProps> = ({
  image,
  title,
  subtitle,
  badges = [],
  featured = false,
  overlayGradient = true,
  className = "",
}) => {
  const getBadgeClasses = (badge: DetailHeroBadge) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm";

    const colorClasses = {
      green: "bg-green-500/80 text-white",
      blue: "bg-blue-500/80 text-white",
      orange: "bg-orange-500/80 text-white",
      red: "bg-red-500/80 text-white",
      yellow: "bg-yellow-500/80 text-white",
      gray: "bg-neutral-500/80 text-white",
      accent: "bg-accent-two/80 text-white",
      special: "bg-special/80 text-white",
    };

    if (badge.variant === "outline") {
      const outlineColors = {
        green:
          "border-2 border-green-500 text-green-600 dark:text-green-400 bg-white/10 dark:bg-black/10",
        blue: "border-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white/10 dark:bg-black/10",
        orange:
          "border-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-white/10 dark:bg-black/10",
        red: "border-2 border-red-500 text-red-600 dark:text-red-400 bg-white/10 dark:bg-black/10",
        yellow:
          "border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-white/10 dark:bg-black/10",
        gray: "border-2 border-neutral-500 text-neutral-600 dark:text-neutral-400 bg-white/10 dark:bg-black/10",
        accent:
          "border-2 border-accent-two text-accent-two bg-white/10 dark:bg-black/10",
        special:
          "border-2 border-special text-special bg-white/10 dark:bg-black/10",
      };
      return `${baseClasses} ${outlineColors[badge.color || "accent"]}`;
    }

    return `${baseClasses} ${colorClasses[badge.color || "accent"]}`;
  };

  const imageSrc = typeof image === "object" && "src" in image ? image.src : "";
  const imageAlt =
    typeof image === "object" && "alt" in image ? image.alt : title;

  return (
    <div
      className={`relative mb-8 -mx-4 md:-mx-8 lg:-mx-12 rounded-none md:rounded-xl overflow-hidden ${className}`}
    >
      <div className="aspect-[21/9] overflow-hidden relative">
        {image ? (
          <>
            {/* Image background */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />

            {/* Overlay gradient for images */}
            {overlayGradient && (
              <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/20 to-transparent" />
            )}
          </>
        ) : (
          <>
            {/* Gradient fallback background */}
            <div className="absolute inset-0 bg-gradient-to-br from-special-lighter via-special-light to-special" />

            {/* Subtle overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/95 via-surface/50 to-surface/30" />
          </>
        )}

        {/* Title, subtitle and badges overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg flex items-center gap-3">
              {title}
              {featured && (
                <Star className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 dark:text-yellow-400 flex-shrink-0 drop-shadow-lg" />
              )}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-4 max-w-3xl drop-shadow">
                {subtitle}
              </p>
            )}

            {badges.length > 0 && (
              <div className="flex gap-2 flex-wrap items-center">
                {badges.map((badge, index) => (
                  <span key={index} className={getBadgeClasses(badge)}>
                    {badge.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
