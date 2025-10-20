/**
 * Barrel exports for search components and types.
 * This simplifies imports throughout the app:
 *
 * import { SearchProvider, useSearch, SearchModal, SearchMobilePanel } from "@/components/search";
 */

export { SearchProvider, useSearch } from "./SearchProvider";
export type {
  SearchMode,
  SearchRecord,
  SearchContextState,
  SearchProviderProps,
} from "./SearchProvider";

export { SearchModal } from "./SearchModal";
export { SearchMobilePanel } from "./SearchMobilePanel";

// Future shared components (to be implemented):
// export { SearchInput } from "./SearchInput";
// export { SearchResultItem } from "./SearchResultItem";
// export { SearchResultsList } from "./SearchResultsList";
