import React from "react";
import { clsx } from "clsx";

/**
 * NavIconButton
 *
 * Unified, accessible icon-only button for navigation controls across desktop and mobile.
 * Use this for:
 * - Desktop: search trigger, theme toggle, close actions
 * - Mobile: hamburger trigger, search/theme/close actions within dialogs
 *
 * Accessibility:
 * - Provide a descriptive `label` (used for aria-label and default title)
 *
 * Examples:
 *  <NavIconButton label="Open search" onClick={...}>
 *    <SearchIcon />
 *  </NavIconButton>
 */
export interface NavIconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Accessible name. Applied to aria-label and used as default title.
   */
  label: string;
  /**
   * Icon or content to render inside the button (usually an SVG).
   */
  children: React.ReactNode;
  /**
   * Visual size preset.
   * - sm -> 28px
   * - md -> 32px (default)
   * - lg -> 36px
   */
  size?: "sm" | "md" | "lg";
  /**
   * Visual variant.
   * - default: subtle filled background
   * - ghost: transparent background
   */
  variant?: "default" | "ghost";
  /**
   * Active state styling (e.g., for toggles).
   */
  active?: boolean;
  /**
   * Additional class names to merge with the base styles.
   */
  className?: string;
  /**
   * Override for the title attribute; defaults to `label`.
   */
  title?: string;
}

export const NavIconButton = React.forwardRef<
  HTMLButtonElement,
  NavIconButtonProps
>(function NavIconButton(
  {
    label,
    children,
    size = "md",
    variant = "default",
    active = false,
    className,
    title,
    type,
    ...rest
  },
  ref,
) {
  const sizeClasses =
    size === "sm" ? "h-7 w-7" : size === "lg" ? "h-9 w-9" : "h-8 w-8";

  const variantClasses =
    variant === "ghost"
      ? "bg-transparent text-accent-base hover:bg-accent-base/10"
      : "bg-color-100 text-accent-base hover:bg-accent-base/10";

  const baseClasses = clsx(
    "relative inline-flex items-center justify-center select-none",
    "rounded-lg transition-colors",
    "focus:outline-2 focus:outline-accent-two outline-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses,
    variantClasses,
    active && "bg-accent-base/10 text-accent-two",
    className,
  );

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-label={label}
      title={title ?? label}
      className={baseClasses}
      data-active={active ? "true" : "false"}
      {...rest}
    >
      {children}
    </button>
  );
});

export default NavIconButton;
