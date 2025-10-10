import React from "react";

export interface RentalPricing {
  daily?: number;
  weekly?: number;
  monthly?: number;
}

export interface PricingCardProps {
  title?: string;
  icon?: string | React.ReactNode;
  purchase?: number;
  rental?: RentalPricing;
  currency?: string;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title = "Pricing",
  icon,
  purchase,
  rental,
  currency = "$",
  className = "",
}) => {
  if (!purchase && !rental) {
    return null;
  }

  const renderIcon = () => {
    if (!icon) {
      // Default pricing icon
      return (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <path d="M12 12v6" />
          <path d="M9 15h6" />
        </svg>
      );
    }

    if (typeof icon === 'string') {
      // Assuming icon is a class name for icon fonts
      return <i className={`${icon} w-5 h-5 mr-2`} />;
    }

    return <span className="mr-2">{icon}</span>;
  };

  const formatPrice = (price: number) => {
    return `${currency}${price.toLocaleString()}`;
  };

  return (
    <div className={`mb-6 p-6 bg-special-lighter rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {renderIcon()}
        {title}
      </h3>
      <div className="space-y-3">
        {purchase && (
          <div>
            <p className="text-sm text-color-500">Purchase</p>
            <p className="text-2xl font-bold">
              {formatPrice(purchase)}
            </p>
          </div>
        )}

        {rental && (
          <div>
            <p className="text-sm text-color-500 mb-2">Rental Options</p>
            <div className="space-y-1">
              {rental.daily && (
                <p className="text-sm">
                  <span className="font-medium">Daily:</span> {formatPrice(rental.daily)}/day
                </p>
              )}
              {rental.weekly && (
                <p className="text-sm">
                  <span className="font-medium">Weekly:</span> {formatPrice(rental.weekly)}/week
                </p>
              )}
              {rental.monthly && (
                <p className="text-sm">
                  <span className="font-medium">Monthly:</span> {formatPrice(rental.monthly)}/month
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
