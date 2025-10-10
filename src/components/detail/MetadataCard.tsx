import React from "react";

export interface MetadataItem {
  label: string;
  value: string | React.ReactNode;
  link?: string;
  external?: boolean;
}

export interface MetadataCardProps {
  title: string;
  icon?: string | React.ReactNode;
  items: MetadataItem[];
  className?: string;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  title,
  icon,
  items,
  className = "",
}) => {
  // Filter out items with empty values
  const validItems = items.filter(item => item.value);

  if (validItems.length === 0) {
    return null;
  }

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      // Assuming icon is a class name for icon fonts
      // You might need to adjust this based on your icon system
      return <i className={`${icon} w-5 h-5 mr-2`} />;
    }

    return <span className="mr-2">{icon}</span>;
  };

  const renderValue = (item: MetadataItem) => {
    const content = (
      <span className="font-medium text-accent-base">
        {item.value}
      </span>
    );

    if (item.link) {
      const linkProps = item.external ? {
        target: "_blank",
        rel: "noopener noreferrer"
      } : {};

      return (
        <a
          href={item.link}
          className="font-medium text-accent-two hover:text-accent-one transition-colors no-underline"
          {...linkProps}
        >
          {item.value}
          {item.external && (
            <svg
              className="inline-block w-3 h-3 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </a>
      );
    }

    return content;
  };

  return (
    <div className={`mb-6 p-6 bg-special-lighter rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {renderIcon()}
        {title}
      </h3>
      <div className="space-y-3">
        {validItems.map((item, index) => (
          <div key={index} className="flex items-start">
            <dt className="text-sm text-color-500 min-w-[100px] mr-3">
              {item.label}
            </dt>
            <dd className="flex-1">
              {renderValue(item)}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
};
