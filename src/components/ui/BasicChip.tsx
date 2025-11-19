import React from "react";
import { clsx } from "clsx";

export type BasicChipVariant =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary";

export interface BasicChipProps {
  text?: string;
  children?: React.ReactNode;
  variant?: BasicChipVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BasicChipVariant, string> = {
  default: "border-accent-base/50 text-accent-base/70",
  primary: "border-accent-two text-accent-two",
  secondary: "border-accent-one text-accent-one",
  tertiary: "border-accent-three text-accent-three",
};

export function BasicChip({
  text,
  children,
  variant = "default",
  className,
}: BasicChipProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1.5 bg-surface-lighter rounded-full border-2 transition-colors",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      <span className="text-sm font-medium">
        {children ?? text ?? "\u00A0"}
      </span>
    </span>
  );
}

export default BasicChip;
