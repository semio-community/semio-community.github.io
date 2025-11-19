import { clsx } from "clsx";
import { cloneElement, isValidElement, type ReactNode } from "react";

export type LinkCardVariant = "primary" | "secondary" | "tertiary" | "default";

export interface LinkCardProps {
  /**
   * Main title of the card.
   */
  title: string;
  /**
   * Optional short description rendered under the title.
   */
  description?: string;
  /**
   * Variant that controls accent colors for icon and link styles.
   */
  variant?: LinkCardVariant;
  /**
   * Optional additional classes applied to the outer container.
   */
  className?: string;
  /**
   * Extra inline links rendered in a row at the bottom of the card.
   */
  extraLinks?: Array<{ label: string; href: string }>;
  /**
   * Provide a fully-rendered icon node or render function.
   * If a node is provided, it should accept CSS color via currentColor.
   */
  icon?: ReactNode;
  /**
   * Alternative to `icon`: a render function that receives the resolved color class
   * and returns a React node. Prefer this for icon libraries to ensure color/size control.
   */
  iconRender?: (className: string) => ReactNode;
}

type IconNodeProps = {
  className?: string;
  "aria-hidden"?: boolean;
  focusable?: boolean;
};

function variantTextClass(variant: LinkCardVariant) {
  switch (variant) {
    case "primary":
      return "text-accent-two";
    case "secondary":
      return "text-accent-one";
    case "tertiary":
      return "text-accent-three";
    default:
      return "text-accent-base";
  }
}

function variantBorderClass(variant: LinkCardVariant) {
  switch (variant) {
    case "primary":
      return "border-accent-two/10";
    case "secondary":
      return "border-accent-one/10";
    case "tertiary":
      return "border-accent-three/10";
    default:
      return "border-accent-base/10";
  }
}

function variantExtraLinkClass(variant: LinkCardVariant) {
  switch (variant) {
    case "primary":
      return "bg-accent-two/10 hover:bg-accent-two/30 outline-accent-two";
    case "secondary":
      return "bg-accent-one/10 hover:bg-accent-one/30 outline-accent-one";
    case "tertiary":
      return "bg-accent-three/10 hover:bg-accent-three/30 outline-accent-three";
    default:
      return "bg-accent-base/10 hover:bg-accent-base/30 outline-accent-base";
  }
}

/**
 * LinkCard
 *
 * React translation of the legacy LinkCard.astro to ensure visual parity:
 * - Outer card with special background, rounded corners, blur, centered content
 * - Large accent icon at the top
 * - Title, optional description
 * - Optional row of inline links with variant-colored outlines/backgrounds
 *
 * Usage:
 *  <LinkCard
 *    iconName="solar:cpu-bolt-line-duotone"
 *    title="Hardware"
 *    description="Community-driven robotics hardware platforms"
 *    variant="secondary"
 *    extraLinks={[
 *      { label: "Projects", href: "/projects#hardware" },
 *      { label: "Services", href: "/services#hardware" },
 *    ]}
 *  />
 */
export default function LinkCard({
  title,
  description,
  variant = "primary",
  className,
  extraLinks = [],
  icon,
  iconRender,
}: LinkCardProps) {
  const textClass = variantTextClass(variant);
  const borderClass = variantBorderClass(variant);
  const extraLinkClass = variantExtraLinkClass(variant);

  const iconColorClass = clsx(
    "w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform",
    textClass,
  );
  const renderedIcon =
    typeof iconRender === "function"
      ? iconRender(iconColorClass)
      : isValidElement<IconNodeProps>(icon)
        ? cloneElement(icon, {
            ...icon.props,
            className: clsx(icon.props?.className, iconColorClass),
            "aria-hidden": true,
            focusable: false,
          })
        : null;

  return (
    <div
      className={clsx(
        "group p-4 sm:p-6 bg-special-lighter rounded-lg backdrop-blur-lg transition-all text-center",
        className,
      )}
    >
      {renderedIcon}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description ? (
        <p className="text-sm text-accent-base/70">{description}</p>
      ) : null}

      {extraLinks.length > 0 ? (
        <div
          className={clsx(
            "flex w-full gap-3 mt-3 pt-3 border-t-1",
            borderClass,
          )}
        >
          {extraLinks.map(({ label, href }) => (
            <a
              key={`${href}-${label}`}
              className={clsx(
                "rounded-md p-1 outline text-accent-base transition-colors flex-1",
                extraLinkClass,
              )}
              href={href}
            >
              {label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
