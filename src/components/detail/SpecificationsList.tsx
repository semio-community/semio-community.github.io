import React from "react";
import {
  SpecificationsList as CoreSpecificationsList,
  type SpecificationsListProps,
} from "@semio-community/ecosystem-site-core";
import Icon from "@/components/ui/Icon";

export type { SpecificationsListProps };
export type { SpecificationItem } from "@semio-community/ecosystem-site-core";

export default function SpecificationsList(props: SpecificationsListProps) {
  return (
    <CoreSpecificationsList
      {...props}
      renderIcon={({ name, className }) => (
        <Icon name={name} className={className} />
      )}
    />
  );
}
