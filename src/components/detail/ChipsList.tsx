import React from "react";
import InfoCard from "./InfoCard";

export interface ChipGroup {
  title: string;
  items: string[];
  variant?: "primary" | "secondary" | "tertiary" | "default";
}

export interface ChipsListProps {
  title: string;
  groups?: ChipGroup[];
  items?: string[];
  variant?: "primary" | "secondary" | "tertiary" | "default";
  className?: string;
}

const VARIANT_STYLES: Record<
  NonNullable<ChipsListProps["variant"]>,
  string
> = {
  primary: "bg-accent-two/10 text-accent-base",
  secondary: "bg-accent-one/10 text-accent-base",
  tertiary: "bg-surface-lighter text-accent-base",
  default: "bg-accent-base/10 text-accent-base",
};

export default function ChipsList({
  title,
  groups,
  items,
  variant = "default",
  className,
}: ChipsListProps) {
  const chipGroups =
    groups || (items ? [{ title: "", items, variant }] : undefined);
  const validGroups = (chipGroups || []).filter(
    (group) => group.items && group.items.length > 0,
  );

  if (!validGroups.length) return null;

  return (
    <div className={`mb-8 ${className ?? ""}`}>
      <InfoCard title={title}>
        <div className="space-y-4">
          {validGroups.map((group, index) => (
            <div
              key={`${group.title}-${index}`}
              className={index > 0 ? "pt-4 border-t border-accent-one/10" : ""}
            >
              {group.title && (
                <h4 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
                  {group.title}
                </h4>
              )}
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 ${VARIANT_STYLES[group.variant || variant]}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
}
