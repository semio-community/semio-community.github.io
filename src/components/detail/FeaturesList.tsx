import React from "react";
import {
  FeaturesList as CoreFeaturesList,
  type FeaturesListProps,
} from "@semio-community/ecosystem-site-core";
import Icon from "@/components/ui/Icon";

export default function FeaturesList(props: FeaturesListProps) {
  return (
    <CoreFeaturesList
      {...props}
      renderIcon={({ name, className }) => (
        <Icon name={name} className={className} />
      )}
    />
  );
}
