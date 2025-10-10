import React from "react";

export interface FeaturesCardProps {
  title?: string;
  icon?: string | React.ReactNode;
  features: string[];
  className?: string;
}

export const FeaturesCard: React.FC<FeaturesCardProps> = ({
  title = "Key Features",
  icon,
  features,
  className = "",
}) => {
  if (!features || features.length === 0) {
    return null;
  }

  const renderIcon = () => {
    if (!icon) {
      // Default icon - star
      return (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }

    if (typeof icon === 'string') {
      // Assuming icon is a class name for icon fonts
      return <i className={`${icon} w-5 h-5 mr-2`} />;
    }

    return <span className="mr-2">{icon}</span>;
  };

  return (
    <div className={`mb-6 p-6 bg-special-lighter rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {renderIcon()}
        {title}
      </h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 text-accent-two flex-shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
