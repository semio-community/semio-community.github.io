import type React from "react";
import { clsx } from "clsx";

export interface InfoCardProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export default function InfoCard({
  title,
  className,
  children,
}: InfoCardProps) {
  return (
    <div
      className={clsx(
        "info-card bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6 backdrop-blur-lg",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-semibold text-accent-base uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="info-card-content">{children}</div>
    </div>
  );
}
