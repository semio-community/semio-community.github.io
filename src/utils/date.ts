import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/site.config";

export function getFormattedDate(
  date: Date | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (date === undefined) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat(siteConfig.date.locale, {
    ...(siteConfig.date.options as Intl.DateTimeFormatOptions),
    ...options,
  }).format(date);
}

export function collectionDateSort<T extends CollectionEntry<any>>(
  a: T & { data: { publishDate: Date } },
  b: T & { data: { publishDate: Date } },
) {
  return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}

export function getFormattedDateRanges(
  date1: Date,
  date2?: Date,
  options?: Intl.DateTimeFormatOptions
): string {

  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options ?? { year: "numeric", month: "short", day: "numeric" })

  const multiDay = date2 && date1 !== date2;

  let dateString = multiDay ? dateTimeFormat.formatRange(date1, date2) : dateTimeFormat.format(date1);

  return dateString
}