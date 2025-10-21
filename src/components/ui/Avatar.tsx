import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import {
  User,
  Buildings,
  CpuBolt,
  CodeSquare,
  TestTube,
  CalendarMark,
  Document2,
} from "@solar-icons/react-perf/LineDuotone";
import type { ImageMetadata } from "astro";

export type AvatarType =
  | "person"
  | "organization"
  | "hardware"
  | "software"
  | "research"
  | "event"
  | "document";

export interface AvatarProps {
  src?: string | ImageMetadata | { src: string; alt?: string };
  alt?: string;
  name?: string;
  type?: AvatarType;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  fallbackClassName?: string;
  rounded?: "full" | "lg" | "xl";
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
  "2xl": "w-24 h-24",
};

const iconSizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-10 h-10",
  "2xl": "w-12 h-12",
};

const textSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
  "2xl": "text-3xl",
};

const roundedClasses = {
  full: "rounded-full",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

// Type-specific gradient backgrounds
const typeGradients: Record<AvatarType, string> = {
  person: "bg-gradient-to-br from-accent-one/20 to-accent-two/20",
  organization: "bg-gradient-to-br from-special-lighter to-special-light",
  hardware: "bg-gradient-to-br from-blue-500/20 to-blue-600/20",
  software: "bg-gradient-to-br from-green-500/20 to-green-600/20",
  research: "bg-gradient-to-br from-purple-500/20 to-purple-600/20",
  event: "bg-gradient-to-br from-orange-500/20 to-orange-600/20",
  document: "bg-gradient-to-br from-gray-500/20 to-gray-600/20",
};

// Icon components for different types
const TypeIcon: React.FC<{ type: AvatarType; className?: string }> = ({
  type,
  className,
}) => {
  const icons: Record<AvatarType, React.ReactNode> = {
    person: <User className={className} />,
    organization: <Buildings className={className} />,
    hardware: <CpuBolt className={className} />,
    software: <CodeSquare className={className} />,
    research: <TestTube className={className} />,
    event: <CalendarMark className={className} />,
    document: <Document2 className={className} />,
  };

  return <>{icons[type]}</>;
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  type = "person",
  size = "md",
  className = "",
  fallbackClassName = "",
  rounded = "full",
}) => {
  // Extract image URL from different input types
  const getImageSrc = (): string => {
    if (!src) return "";
    if (typeof src === "string") return src;
    // Handle Astro ImageMetadata objects and other objects with src property
    if (typeof src === "object" && src !== null && "src" in src) {
      // Type guard to safely access the src property
      const srcObj = src as { src: string };
      return srcObj.src;
    }
    return "";
  };

  // Generate initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0]?.substring(0, 2).toUpperCase() || "";
    }
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const imageSrc = getImageSrc();
  const imageAlt = alt || name || "Avatar";
  const baseClasses = `relative inline-flex align-middle ${sizeClasses[size]} ${roundedClasses[rounded]} overflow-hidden flex-shrink-0`;
  const fallbackBaseClasses = `w-full h-full flex items-center justify-center ${typeGradients[type]} ${roundedClasses[rounded]}`;

  return (
    <AvatarPrimitive.Root className={`${baseClasses} ${className}`}>
      <AvatarPrimitive.Image
        src={imageSrc}
        alt={imageAlt}
        className={`absolute inset-0 w-full h-full object-cover block`}
      />
      <AvatarPrimitive.Fallback
        className={`${fallbackBaseClasses} ${fallbackClassName}`}
        delayMs={0}
      >
        {type === "person" && name ? (
          // Show initials only for people with names
          <span
            className={`font-semibold ${textSizeClasses[size]} text-accent-base select-none`}
          >
            {getInitials(name)}
          </span>
        ) : (
          // Show icon for all non-person types or people without names
          <TypeIcon
            type={type}
            className={`${iconSizeClasses[size]} text-accent-base opacity-60`}
          />
        )}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};
