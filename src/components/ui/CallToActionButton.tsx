import React from "react";
import { clsx } from "clsx";

export interface CallToActionButtonProps {
  /** The text to display in the button */
  children: React.ReactNode;
  /** The size of the button */
  size?: "small" | "medium" | "large";
  /** Visual variant of the button */
  variant?: "default" | "primary" | "secondary" | "tertiary";
  /** The URL to link to (if provided, renders as an anchor tag) */
  href?: string;
  /** Click handler (only used when href is not provided) */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** HTML type attribute for button element */
  type?: "button" | "submit" | "reset";
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Target attribute for links */
  target?: string;
  /** Rel attribute for links */
  rel?: string;
}

export const CallToActionButton: React.FC<CallToActionButtonProps> = ({
  children,
  size = "medium",
  variant = "primary",
  href,
  onClick,
  className,
  type = "button",
  fullWidth = false,
  ariaLabel,
  target,
  rel,
}) => {
  // Size-specific styles
  const sizeClasses = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-4 py-3 text-base sm:px-4",
  };

  // Variant-specific styles
  // All variants use text-accent-base by default and text-surface on hover
  const variantClasses = {
    // Default: white/black based on theme
    default: [
      "outline-2 outline-foreground",
      "bg-foreground/10 text-accent-base",
      "hover:bg-foreground hover:text-surface",
      "hover:shadow-lg hover:scale-[1.02]",
      "focus:outline-2 focus:outline-foreground focus:outline-offset-2",
    ],
    // Primary: accent-two (red-orange)
    primary: [
      "outline-2 outline-accent-two",
      "bg-accent-two/10 text-accent-base",
      "hover:bg-accent-two hover:text-surface",
      "hover:shadow-lg hover:scale-[1.02]",
      "focus:outline-2 focus:outline-accent-two focus:outline-offset-2",
    ],
    // Secondary: accent-one (yellow-orange)
    secondary: [
      "outline-2 outline-accent-one",
      "bg-accent-one/10 text-accent-base",
      "hover:bg-accent-one hover:text-surface",
      "hover:shadow-lg hover:scale-[1.02]",
      "focus:outline-2 focus:outline-accent-one focus:outline-offset-2",
    ],
    // Tertiary: accent-three (teal)
    tertiary: [
      "outline-2 outline-accent-three",
      "bg-accent-three/10 text-accent-base",
      "hover:bg-accent-three hover:text-surface",
      "hover:shadow-lg hover:scale-[1.02]",
      "focus:outline-2 focus:outline-accent-three focus:outline-offset-2",
    ],
  };

  // Base classes that apply to all CTA buttons
  const baseClasses = clsx(
    // Layout & spacing
    "inline-flex items-center justify-center pointer-events-auto group/button",
    "rounded-md font-semibold transition-all duration-200 -outline-offset-1 backdrop-blur-lg",
    // Variant-specific styles
    variantClasses[variant],
    // Width
    fullWidth ? "w-full" : "",
    // Size-specific padding and text
    sizeClasses[size],
    // Additional classes
    className,
  );

  // Render as anchor tag if href is provided
  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
