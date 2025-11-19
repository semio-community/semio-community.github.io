import { clsx } from "clsx";
import {
  cloneElement,
  isValidElement,
  type ComponentType,
  type ReactNode,
} from "react";

export type FeatureCardVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "default";

type IconRenderProps = {
  className?: string;
  "aria-hidden"?: boolean;
  focusable?: boolean;
};

export interface FeatureCardProps {
  /**
   * Title text rendered as the card heading.
   */
  title: string;
  /**
   * Optional short description rendered under the title.
   */
  description?: string;
  /**
   * Visual variant that controls the accent color for the icon.
   */
  variant?: FeatureCardVariant;
  /**
   * Additional class names applied to the outer card wrapper.
   */
  className?: string;
  /**
   * Optional children rendered at the end of the card (parity with Astro slot).
   */
  children?: ReactNode;
  /**
   * Provide a React icon component type (recommended when calling from .astro).
   * Example: iconComponent={Code2} (from @solar-icons/react-perf/LineDuotone)
   */
  iconComponent?: ComponentType<IconRenderProps>;
  /**
   * Provide an icon as a React node. It should respect currentColor.
   */
  icon?: ReactNode;
  /**
   * Alternative to `icon`: render function that receives a className
   * string and returns a React node (recommended for icon libraries).
   */
  iconRender?: (className: string) => ReactNode;
}

/**
 * FeatureCard
 *
 * React translation of the legacy FeatureCard.astro with visual parity:
 * - Wrapper: p-4 sm:p-6 bg-special-lighter rounded-lg text-center
 * - Icon: w-12 h-12 mx-auto mb-4 + variant color
 * - Title: text-lg font-semibold mb-2
 * - Description: text-sm text-accent-base/50
 * - Slot/children rendered after description
 *
 * Usage:
 *  <FeatureCard
 *    title="Design"
 *    description="Design for Manufacturing"
 *    variant="primary"
 *    iconRender={(className) => <CpuBolt className={className} />}
 *  />
 */
export default function FeatureCard({
  title,
  description,
  variant = "primary",
  className,
  children,
  iconComponent,
  icon,
  iconRender,
}: FeatureCardProps) {
  const textClass =
    {
      primary: "text-accent-two",
      secondary: "text-accent-one",
      tertiary: "text-accent-three",
      default: "text-accent-base",
    }[variant] || "text-accent-base";

  const iconClassName = clsx("w-12 h-12 mx-auto mb-4", textClass);

  let renderedIcon: ReactNode = null;
  if (iconComponent) {
    const IconComponent = iconComponent;
    renderedIcon = (
      <IconComponent className={iconClassName} aria-hidden focusable={false} />
    );
  } else if (typeof iconRender === "function") {
    renderedIcon = iconRender(iconClassName);
  } else if (isValidElement<IconRenderProps>(icon)) {
    renderedIcon = cloneElement(icon, {
      ...icon.props,
      className: clsx(icon.props?.className, iconClassName),
      "aria-hidden": true,
      focusable: false,
    });
  }

  return (
    <div
      className={clsx(
        "p-4 sm:p-6 bg-special-lighter rounded-lg text-center backdrop-blur-lg",
        className,
      )}
    >
      {renderedIcon}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description ? (
        <p className="text-sm text-accent-base/50">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
