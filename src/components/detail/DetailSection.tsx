import React from "react";

export interface DetailSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'small' | 'medium' | 'large';
  id?: string;
}

export const DetailSection: React.FC<DetailSectionProps> = ({
  children,
  className = "",
  spacing = 'medium',
  id,
}) => {
  const spacingClasses = {
    none: '',
    small: 'mb-4',
    medium: 'mb-8',
    large: 'mb-12',
  };

  return (
    <section
      id={id}
      className={`
        ${spacingClasses[spacing]}
        ${className}
      `}
    >
      {children}
    </section>
  );
};
