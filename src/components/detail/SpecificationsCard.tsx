import React from "react";

export interface SpecificationItem {
  label: string;
  value: string | string[] | React.ReactNode;
  type?: 'text' | 'list' | 'custom';
}

export interface SpecificationsCardProps {
  title?: string;
  icon?: string | React.ReactNode;
  items?: Record<string, string | string[] | undefined> | SpecificationItem[];
  className?: string;
}

export const SpecificationsCard: React.FC<SpecificationsCardProps> = ({
  title = "Specifications",
  icon,
  items,
  className = "",
}) => {
  if (!items || (Array.isArray(items) ? items.length === 0 : Object.keys(items).length === 0)) {
    return null;
  }

  // Convert items to a normalized format
  const normalizedItems: SpecificationItem[] = Array.isArray(items)
    ? items
    : Object.entries(items)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => ({
          label: formatLabel(key),
          value,
          type: Array.isArray(value) ? 'list' : 'text'
        }));

  if (normalizedItems.length === 0) {
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

  const renderValue = (item: SpecificationItem) => {
    if (item.type === 'custom' || React.isValidElement(item.value)) {
      return item.value;
    }

    if (Array.isArray(item.value)) {
      return (
        <ul className="text-sm space-y-1">
          {item.value.map((val, index) => (
            <li key={index} className="flex items-start">
              <span className="text-accent-two mr-2">•</span>
              {val}
            </li>
          ))}
        </ul>
      );
    }

    return <span className="font-medium">{item.value}</span>;
  };

  return (
    <div className={`mb-6 p-6 bg-special-lighter rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {renderIcon()}
        {title}
      </h3>
      <dl className="space-y-3">
        {normalizedItems.map((item, index) => (
          <div key={index}>
            <dt className={`text-sm text-color-500 ${Array.isArray(item.value) ? 'mb-1' : ''}`}>
              {item.label}
            </dt>
            <dd>{renderValue(item)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

// Helper function to format camelCase or snake_case labels
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
    .trim();
}
