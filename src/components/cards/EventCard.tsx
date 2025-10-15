import React from "react";
import { ItemCard } from "@/components/ItemCard";
import { getEventPreviewDescriptionText } from "@/utils/events";


export interface EventCardProps {
  eventId: string;
  data: {
    name?: string;
    displayName?: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    type: string;
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
    location?: {
      city?: string;
      country?: string;
      online?: boolean;
    };
    featured?: boolean;
  };
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  eventId,
  data,
}) => {

  // Determine status based on dates
  const now = new Date();
  const startDate = new Date(data.startDate);
  const endDate = data.endDate ? new Date(data.endDate) : startDate;

  let status = "upcoming";
  if (now >= startDate && now <= endDate) {
    status = "happening now";
  } else if (now > endDate) {
    status = "past";
  }

  // Build category from event type
  const category = `${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`;

  const description = getEventPreviewDescriptionText(data)

  return (
    <ItemCard
      title={data.displayName || data.name || eventId}
      description={description}
      href={`/events/${eventId}`}
      type="events"
      image={data.images?.hero}
      imageAlt={data.name}
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
