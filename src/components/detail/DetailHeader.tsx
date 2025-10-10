import React from "react";
import { getStatusColor } from "@/config/statusConfig";

export interface DetailHeaderBadge {
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

export interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  badges?: DetailHeaderBadge[];
  featured?: boolean;
  className?: string;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  subtitle,
  badges = [],
  featured = false,
  className = "",
}) => {
  const getBadgeClasses = (badge: DetailHeaderBadge) => {
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

  return (
    <div
      className={`relative mb-8 -mx-4 md:-mx-8 lg:-mx-12 rounded-none md:rounded-xl overflow-hidden ${className}`}
    >
      <div className="aspect-[21/9] overflow-hidden bg-gradient-to-br from-special-lighter via-special-light to-special relative">
        {/* Abstract pattern background - similar to GlyphField but static */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 1920 810"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="detail-header-pattern"
                x="0"
                y="0"
                width="120"
                height="120"
                patternUnits="userSpaceOnUse"
              >
                {/* Circuit-like pattern */}
                <circle
                  cx="10"
                  cy="10"
                  r="2"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="110"
                  cy="10"
                  r="2"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="10"
                  cy="110"
                  r="2"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="2"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="3"
                  fill="currentColor"
                  opacity="0.4"
                />

                <line
                  x1="10"
                  y1="10"
                  x2="60"
                  y2="60"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
                <line
                  x1="110"
                  y1="10"
                  x2="60"
                  y2="60"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
                <line
                  x1="10"
                  y1="110"
                  x2="60"
                  y2="60"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
                <line
                  x1="110"
                  y1="110"
                  x2="60"
                  y2="60"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.2"
                />

                <rect
                  x="25"
                  y="55"
                  width="10"
                  height="10"
                  fill="currentColor"
                  opacity="0.15"
                  transform="rotate(45 30 60)"
                />
                <rect
                  x="85"
                  y="55"
                  width="10"
                  height="10"
                  fill="currentColor"
                  opacity="0.15"
                  transform="rotate(45 90 60)"
                />

                <path
                  d="M 30,30 Q 60,20 90,30"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
                <path
                  d="M 30,90 Q 60,100 90,90"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              </pattern>

              {/* Gradient overlay for depth */}
              <linearGradient
                id="detail-header-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                <stop
                  offset="50%"
                  stopColor="currentColor"
                  stopOpacity="0.05"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.15"
                />
              </linearGradient>
            </defs>

            <rect
              width="100%"
              height="100%"
              fill="url(#detail-header-pattern)"
            />
            <rect
              width="100%"
              height="100%"
              fill="url(#detail-header-gradient)"
            />
          </svg>
        </div>

        {/* Animated floating elements for visual interest */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent-one/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-accent-two/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-special/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/95 via-surface/50 to-surface/30" />

        {/* Title, subtitle and badges overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg flex items-center gap-3">
              {title}
              {featured && (
                <svg
                  className="w-6 h-6 text-yellow-500 dark:text-yellow-400 flex-shrink-0 drop-shadow-lg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
                  />
                  <path
                    fill="currentColor"
                    fillOpacity="0.25"
                    d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
                  />
                </svg>
              )}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-4 max-w-3xl drop-shadow">
                {subtitle}
              </p>
            )}

            {badges.length > 0 && (
              <div className="flex gap-2 flex-wrap">
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
