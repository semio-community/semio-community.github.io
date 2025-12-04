import type { ReactNode } from "react";

export interface ContentSectionProps {
  title: string;
  content?: string | null;
  className?: string;
  children?: ReactNode;
}

export default function ContentSection({
  title,
  content,
  className,
  children,
}: ContentSectionProps) {
  if (!content && !children) return null;

  return (
    <div className={`content-section mb-8 ${className ?? ""}`}>
      <div className="bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6 backdrop-blur-lg">
        <h3 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
          {title}
        </h3>
        <div className="text-accent-base leading-relaxed">
          {children ?? <p>{content}</p>}
        </div>
      </div>
    </div>
  );
}
