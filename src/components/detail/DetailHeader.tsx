import React from "react";

export interface DetailHeaderBadge {
  text: string;
  color?: string;
  variant?: 'solid' | 'outline';
}

export interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  badges?: DetailHeaderBadge[];
  className?: string;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  subtitle,
  badges = [],
  className = "",
}) => {
  const getBadgeClasses = (badge: DetailHeaderBadge) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";

    // Map color strings to status colors from DetailLayout
    const colorMap: Record<string, string> = {
      // Hardware status colors
      'available': 'text-green-600 dark:text-green-400',
      'in-progress': 'text-yellow-600 dark:text-yellow-400',
      'coming-soon': 'text-blue-600 dark:text-blue-400',
      'deprecated': 'text-red-600 dark:text-red-400',
      // Software status colors
      'stable': 'text-green-600 dark:text-green-400',
      'beta': 'text-blue-600 dark:text-blue-400',
      'alpha': 'text-yellow-600 dark:text-yellow-400',
      // Generic colors
      'featured': 'text-accent-two',
      'license': 'text-special',
    };

    if (badge.variant === 'outline') {
      return `${baseClasses} ${colorMap[badge.color || ''] || 'text-accent-base'} border-2 border-current`;
    }

    const bgClasses = badge.color === 'featured'
      ? 'bg-accent-two/10'
      : badge.color === 'license'
      ? 'bg-special/10'
      : 'bg-color-100 dark:bg-special-dark';

    return `${baseClasses} ${colorMap[badge.color || ''] || 'text-accent-base'} ${bgClasses}`;
  };

  return (
    <header className={`mb-8 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="title mb-4">{title}</h1>
          {subtitle && (
            <p className="text-xl text-color-600 dark:text-color-400 mb-4">
              {subtitle}
            </p>
          )}
        </div>
        {badges.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={getBadgeClasses(badge)}
              >
                {badge.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
