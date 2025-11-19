import React from "react";
import Icon from "@/components/ui/Icon";
import InfoCard from "./InfoCard";

export interface FeaturesListProps {
  title?: string;
  features: string[];
  featureIcon?: string;
  className?: string;
}

export default function FeaturesList({
  title = "KEY FEATURES",
  features,
  featureIcon = "solar:settings-minimalistic-line-duotone",
  className,
}: FeaturesListProps) {
  if (!features || !features.length) return null;

  return (
    <div className={`mb-8 ${className ?? ""}`}>
      <InfoCard title={title}>
        <div className="space-y-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <Icon
                name={featureIcon}
                className="text-accent-two mt-0.5 w-4 h-4 flex-shrink-0"
              />
              <span className="text-sm text-accent-base">{feature}</span>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
}
