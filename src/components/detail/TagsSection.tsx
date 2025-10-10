import React from "react";

export interface TagsSectionProps {
  tags: string[];
  baseUrl?: string;
  title?: string;
  className?: string;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  baseUrl = "/tags",
  title = "Tags",
  className = "",
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <a
            key={index}
            href={`${baseUrl}/${tag}`}
            className="px-3 py-1 bg-special-lighter hover:bg-special text-sm rounded-full transition-colors no-underline"
          >
            #{tag}
          </a>
        ))}
      </div>
    </div>
  );
};
