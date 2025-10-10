import React from "react";

export interface TechnologiesCardProps {
  title?: string;
  icon?: string | React.ReactNode;
  languages?: string[];
  platforms?: string[];
  className?: string;
}

export const TechnologiesCard: React.FC<TechnologiesCardProps> = ({
  title = "Technologies",
  icon,
  languages = [],
  platforms = [],
  className = "",
}) => {
  if (languages.length === 0 && platforms.length === 0) {
    return null;
  }

  const renderIcon = () => {
    if (!icon) {
      // Default code icon
      return (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
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
      <div className="space-y-3">
        {languages.length > 0 && (
          <div>
            <p className="text-sm text-color-500 mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-accent-one/10 text-xs rounded"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {platforms.length > 0 && (
          <div>
            <p className="text-sm text-color-500 mb-2">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-special/10 text-xs rounded"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
