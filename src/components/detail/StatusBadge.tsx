import React from "react";
import { getStatusColor, getStatusLabel } from "@/config/statusConfig";

export interface StatusBadgeProps {
  text: string;
  status?: string;
  color?:
    | "green"
    | "blue"
    | "orange"
    | "red"
    | "yellow"
    | "gray"
    | "accent-one"
    | "accent-two"
    | "accent-three"
    | "special";
  variant?: "solid" | "outline" | "soft";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  text,
  status,
  color,
  variant = "soft",
  size = "medium",
  icon,
  className = "",
}) => {
  // Size classes
  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base",
  };

  // Determine the color to use from status or explicit color
  const badgeColor =
    color || (status ? getStatusColor(status, "chip") : "gray") || "gray";

  // Color classes for different variants
  const getColorClasses = () => {
    if (variant === "solid") {
      const solidColors: Record<string, string> = {
        green: "bg-green-500 text-white",
        blue: "bg-blue-500 text-white",
        orange: "bg-orange-500 text-white",
        red: "bg-red-500 text-white",
        yellow: "bg-yellow-500 text-white",
        gray: "bg-neutral-500 text-white",
        "accent-one": "bg-accent-one text-white",
        "accent-two": "bg-accent-two text-white",
        "accent-three": "bg-accent-three text-white",
        special: "bg-special text-white",
      };
      return solidColors[badgeColor] || solidColors.gray;
    }

    if (variant === "outline") {
      const outlineColors: Record<string, string> = {
        green: "border-2 border-green-500 text-green-600 dark:text-green-400",
        blue: "border-2 border-blue-500 text-blue-600 dark:text-blue-400",
        orange:
          "border-2 border-orange-500 text-orange-600 dark:text-orange-400",
        red: "border-2 border-red-500 text-red-600 dark:text-red-400",
        yellow:
          "border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400",
        gray: "border-2 border-neutral-500 text-neutral-600 dark:text-neutral-400",
        "accent-one": "border-2 border-accent-one text-accent-one",
        "accent-two": "border-2 border-accent-two text-accent-two",
        "accent-three": "border-2 border-accent-three text-accent-three",
        special: "border-2 border-special text-special",
      };
      return outlineColors[badgeColor] || outlineColors.gray;
    }

    // Soft variant (default)
    const softColors: Record<string, string> = {
      green: "bg-green-500/10 text-green-600 dark:text-green-400",
      blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      red: "bg-red-500/10 text-red-600 dark:text-red-400",
      yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      gray: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400",
      "accent-one": "bg-accent-one/10 text-accent-one",
      "accent-two": "bg-accent-two/10 text-accent-two",
      "accent-three": "bg-accent-three/10 text-accent-three",
      special: "bg-special/10 text-special",
    };
    return softColors[badgeColor] || softColors.gray;
  };

  const baseClasses =
    "inline-flex items-center gap-1.5 rounded-full font-medium";
  const colorClasses = getColorClasses();
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${colorClasses} ${className}`;

  return (
    <span className={combinedClasses}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{text}</span>
    </span>
  );
};
