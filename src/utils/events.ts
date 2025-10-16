import { getFormattedDateRanges } from "./date";

interface PartialEvent {
    description?: string;
    startDate: Date;
    endDate?: Date;
    location?: {
      city?: string;
      country?: string;
      online?: boolean;
    }
}

export function getEventPreviewDescriptionText(event: PartialEvent): string {
  const locationString = getLocationString(event.location);
  
    // Format date string
    const dateString = getFormattedDateRanges(event.startDate!, event.endDate);
  
    const description = getDescription(dateString, event.description, locationString)

    return description
}

export function getLocationString(location?: {city?: string, country?: string, online?: boolean}): string | undefined {
  if (!location) return undefined;
  if (location.city && location.country) return `${location.city}, ${location.country}`;
  if (location.country) return location.country;
  if (location.online) return "Online";
  return undefined;
}

function getDescription(dateString: string, descriptionString?: string, locationString?: string): string {
  if (locationString) {
    return `${dateString} • ${locationString}`
  } else if (descriptionString) {
    return `${dateString} • ${descriptionString}`
  } else {
    return dateString
  }
}