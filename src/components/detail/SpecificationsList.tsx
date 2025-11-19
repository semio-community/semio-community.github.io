import React from "react";
import Icon from "@/components/ui/Icon";
import InfoCard from "./InfoCard";

export interface SpecificationItem {
  label: string;
  value: string | number | string[];
  icon?: string;
  link?: string;
  external?: boolean;
}

export interface SpecificationsListProps {
  title: string;
  items: SpecificationItem[] | Record<string, any>;
  defaultItemIcon?: string;
  className?: string;
}

function formatLabel(label: string): string {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default function SpecificationsList({
  title,
  items,
  defaultItemIcon = "solar:settings-minimalistic-line-duotone",
  className,
}: SpecificationsListProps) {
  const itemsArray: SpecificationItem[] = Array.isArray(items)
    ? items
    : Object.entries(items).map(([key, value]) => ({
        label: key,
        value: Array.isArray(value) ? value.join(", ") : String(value),
      }));

  if (!itemsArray.length) return null;

  return (
    <div className={`specifications-section mb-8 ${className ?? ""}`}>
      <InfoCard title={title}>
        <div className="space-y-3">
          {itemsArray.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <Icon
                name={item.icon || defaultItemIcon}
                className="text-accent-two mt-0.5 w-4 h-4 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="text-xs font-medium text-accent-two mb-0.5">
                  {formatLabel(item.label)}
                </div>
                <div className="text-sm text-accent-base/80">
                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.external ? "_blank" : undefined}
                      rel={
                        item.external ? "noopener noreferrer" : undefined
                      }
                      className="text-accent-one hover:text-accent-two transition-colors inline-flex items-center gap-1"
                    >
                      {item.value}
                      {item.external && (
                        <Icon
                          name="solar:arrow-right-up-line-duotone"
                          className="w-3 h-3"
                        />
                      )}
                    </a>
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
}
