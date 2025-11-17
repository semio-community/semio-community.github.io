import React from "react";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";

export interface SubsectionGridProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: string;
  count?: number;
  className?: string;
  gridClass?: string;
  empty?: boolean;
  emptyIcon?: string;
  emptyMessage?: string;
  emptyActions?: React.ReactNode;
  children?: React.ReactNode;
}

export function SubsectionGrid({
  id,
  title,
  subtitle,
  icon,
  count,
  className,
  gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  empty = false,
  emptyIcon = "solar:buildings-2-line-duotone",
  emptyMessage = "Nothing to show yet. Check back soon.",
  emptyActions,
  children,
}: SubsectionGridProps) {
  return (
    <div id={id} className={clsx("mb-10", className)}>
      <div className="flex items-center gap-3 mb-2">
        {icon && <Icon name={icon} className="w-6 h-6 text-accent-two" />}
        <h3 className="text-xl font-semibold">{title}</h3>
        {typeof count === "number" && (
          <span className="text-sm px-2 py-1 bg-accent-one/20 rounded">
            {count}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-sm text-color-600 dark:text-color-400 mb-6">
          {subtitle}
        </p>
      )}

      {empty ? (
        <div className="text-center py-12">
          <Icon name={emptyIcon} className="w-24 h-24 mx-auto mb-4 text-color-300" />
          <p className="text-lg text-color-600 dark:text-color-400">
            {emptyMessage}
          </p>
          {emptyActions}
        </div>
      ) : (
        <div className={clsx("subsection-grid", gridClass)}>{children}</div>
      )}
    </div>
  );
}

export default SubsectionGrid;
