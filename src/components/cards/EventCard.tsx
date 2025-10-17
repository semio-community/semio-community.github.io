import React from "react";
import { ItemCard } from "@/components/cards/ItemCard";
import { getEventPreviewDescriptionText, getLocationString } from "@/utils/events";
import { getFormattedDateRanges } from "@/utils/date";
import { Calendar, MapPoint } from "@solar-icons/react-perf/LineDuotone";


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

  const locationString = getLocationString(data.location);

  const dateString = getFormattedDateRanges(data.startDate, data.endDate)

  const description = getEventPreviewDescriptionText(data)

  return (
    <ItemCard
      title={data.displayName || data.name || eventId}
      // description={description}
      listItems={[
        {text: dateString, icon: <Calendar className="text-accent-two mt-0.5 w-4 h-4 flex-shrink-0"/> },
        {text: locationString ?? "Unknown Location", icon: <MapPoint className="text-accent-two mt-0.5 w-4 h-4 flex-shrink-0"/>}
      ]}
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
