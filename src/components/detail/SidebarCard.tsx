import React from "react";

export interface SidebarCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'lighter' | 'darker';
}

export const SidebarCard: React.FC<SidebarCardProps> = ({
  children,
  className = "",
  padding = 'medium',
  variant = 'default',
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const variantClasses = {
    default: 'bg-special-lighter',
    lighter: 'bg-surface-lighter',
    darker: 'bg-surface-dark',
  };

  return (
    <div
      className={`
        mb-6
        rounded-lg
        ${paddingClasses[padding]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
