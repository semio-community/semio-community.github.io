import React from "react";

export interface ChipsCardProps {
  title: string;
  icon?: string | React.ReactNode;
  items: string[];
  variant?: "default" | "primary" | "secondary" | "accent";
  size?: "small" | "medium" | "large";
  className?: string;
}

export const ChipsCard: React.FC<ChipsCardProps> = ({
  title,
  icon,
  items,
  variant = "default",
  size = "medium",
  className = "",
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === "string") {
      // Assuming icon is a class name for icon fonts
      return <i className={`${icon} w-5 h-5 mr-2`} />;
    }

    return <span className="mr-2">{icon}</span>;
  };

  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base",
  };

  const variantClasses = {
    default: "bg-accent-one/10 text-accent-base",
    primary: "bg-accent-one/10 text-accent-one",
    secondary: "bg-accent-two/10 text-accent-two",
    accent: "bg-special/10 text-special",
  };

  const chipClasses = `inline-flex items-center rounded-xl ${sizeClasses[size]} ${variantClasses[variant]}`;

  return (
    <div className={`mb-6 p-6 bg-special-lighter rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {renderIcon()}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span key={index} className={chipClasses}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
