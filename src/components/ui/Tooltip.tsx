import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { clsx } from "clsx";

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  alignOffset?: number;
  delayDuration?: number;
  className?: string;
  arrowClassName?: string;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
}

/**
 * Tooltip
 * A small, reusable wrapper around Radix UI Tooltip with project-standard styles.
 *
 * Usage:
 * <Tooltip content="Featured">
 *   <button>...</button>
 * </Tooltip>
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
  alignOffset,
  delayDuration = 150,
  className,
  arrowClassName,
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
  asChild = true,
}) => {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <RadixTooltip.Trigger asChild={asChild}>
          {children as React.ReactElement}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            className={clsx(
              "rounded-md bg-accent-base px-2 py-1 text-xs font-medium text-surface shadow-lg",
              "data-[state=delayed-open]:animate-in data-[state=open]:fade-in z-100",
              className,
            )}
          >
            {content}
            <RadixTooltip.Arrow
              className={clsx("fill-accent-base", arrowClassName)}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;

// OPTIONAL: Export styled building blocks for advanced usage
export const TooltipProvider = RadixTooltip.Provider;
export const TooltipRoot = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;
export const TooltipContent = RadixTooltip.Content;
export const TooltipArrow = RadixTooltip.Arrow;
