import { getEventPreviewDescription, getLocationString } from "@semio-community/site-core";
import { getFormattedDateRanges, parseDateLocal } from "./date";

interface PartialEvent {
  description?: string;
  startDate: Date | string;
  endDate?: Date | string;
  location?: {
    city?: string;
    country?: string;
    online?: boolean;
  };
}

export function getEventPreviewDescriptionText(event: PartialEvent): string {
  const locationString = getLocationString(event.location);

  const start = parseDateLocal(event.startDate);
  const end = parseDateLocal(event.endDate ?? event.startDate);

  const dateString = getFormattedDateRanges(start, end);

  return getEventPreviewDescription(dateString, event.description, locationString);
}

export { getLocationString };
