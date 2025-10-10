import React from "react";
import { CallToActionButton, type CallToActionButtonProps } from "../CallToActionButton";

export interface ActionButton {
  href?: string;
  text: string;
  variant?: CallToActionButtonProps['variant'];
  size?: CallToActionButtonProps['size'];
  target?: string;
  rel?: string;
  onClick?: () => void;
  condition?: boolean;
}

export interface ActionButtonGroupProps {
  buttons: ActionButton[];
  size?: CallToActionButtonProps['size'];
  className?: string;
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  buttons,
  size = "large",
  className = "",
}) => {
  // Filter out buttons where condition is false
  const visibleButtons = buttons.filter(button => button.condition !== false);

  if (visibleButtons.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-3 mb-6 ${className}`}>
      {visibleButtons.map((button, index) => (
        <CallToActionButton
          key={index}
          href={button.href}
          onClick={button.onClick}
          size={button.size || size}
          variant={button.variant || "tertiary"}
          target={button.target}
          rel={button.rel}
        >
          {button.text}
        </CallToActionButton>
      ))}
    </div>
  );
};
