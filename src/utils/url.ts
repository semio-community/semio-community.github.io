import { isExternalUrl, resolveBaseUrl } from "@semio-community/site-core";

/**
 * Utility functions for handling URLs with base path support
 */

/**
 * Creates a base-aware URL for internal links
 * @param path - The relative path (e.g., "about/", "/contact/", "")
 * @param baseOverride - Optional base URL to use instead of import.meta.env.BASE_URL
 * @returns The full path with base URL applied
 */
export function url(path: string = "", baseOverride?: string): string {
  const baseUrl = baseOverride ?? import.meta.env.BASE_URL;
  return resolveBaseUrl(path, baseUrl);
}

/**
 * Creates a base-aware URL for the home page
 * @returns The home page URL with base path
 */
export function homeUrl(): string {
  return import.meta.env.BASE_URL;
}

export { isExternalUrl };
