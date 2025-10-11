import React from "react";
import { ItemCard } from "@/components/ItemCard";

export interface EventCardProps {
  eventId: string;
  data: {
    name?: string;
    displayName?: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    type: string;
    banner?: any;
    images?: {
      logo?: any;
      hero?: any;
    };
    links?: {
      website?: string;
      registration?: string;
      program?: string;
      proceedings?: string;
      recordings?: string;
    };
    featured?: boolean;
  };
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  eventId,
  data,
  className,
}) => {
  // Format date string
  const dateStr = data.startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Determine status based on dates
  const now = new Date();
  const startDate = new Date(data.startDate);
  const endDate = data.endDate ? new Date(data.endDate) : startDate;

  let status = "upcoming";
  if (now >= startDate && now <= endDate) {
    status = "live";
  } else if (now > endDate) {
    status = "past";
  }

  // Build category from event type
  const category = `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} • ${dateStr}`;

  return (
    <ItemCard
      title={data.displayName || data.name || eventId}
      description={data.description}
      href={`/events/${eventId}`}
      type="events"
      image={data.banner}
      imageAlt={data.banner?.alt || data.name}
      logo={data.images?.logo}
      status={status}
      category={category}
      featured={data.featured}
      links={{
        website: data.links?.website,
        registration: data.links?.registration,
      }}
    />
  );
};
