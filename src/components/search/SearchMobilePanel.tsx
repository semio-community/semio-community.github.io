import React from "react";
import { useSearch } from "./SearchProvider";

/**
 * SearchMobilePanel
 *
 * Renders the React-first search UI inside the MobileNavigation dialog content.
 * When the provider mode is 'mobile-panel', the MobileNavigation should render
 * this component instead of its normal navigation items.
 *
 * Responsibilities:
 * - Provide a compact search input at the top
 * - Show a scrollable list of results
 * - Support basic keyboard navigation (↑/↓/Enter)
 * - Offer a "Back" action to exit search mode
 *
 * Integration notes:
 * - Ensure <SearchProvider> is mounted above MobileNavigation
 * - Trigger this panel by calling useSearch().enterMobileMode() from the dialog header search button
 * - Call exitSearchMode() to return to the normal nav view
 */

export interface SearchMobilePanelProps {
  onClose?: () => void;
}

export const SearchMobilePanel: React.FC<SearchMobilePanelProps> = ({
  onClose,
}) => {
  const {
    query,
    setQuery,
    results,
    loading,
    activeIndex,
    moveActive,
    activateIndex,
    exitSearchMode,
  } = useSearch();

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    // Focus the input when the panel mounts
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, []);

  const handleBack = () => {
    if (onClose) onClose();
    else exitSearchMode();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    }
    if (e.key === "Enter" && typeof activeIndex === "number") {
      const item = results[activeIndex];
      if (item) {
        window.location.href = item.url;
      }
    }
  };

  return (
    <div className="flex h-full flex-col" onKeyDown={handleKeyDown}>
      {/* Local header with search input */}
      <div className="sticky top-0 z-10 border-b border-accent-base/10 bg-surface/80 backdrop-blur-xl p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-color-100 text-accent-base transition-colors hover:bg-accent-base/10 focus:outline-2 focus:outline-accent-two outline-offset-2"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polyline
                points="15 18 9 12 15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="16.65"
                  y1="16.65"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-10 w-full rounded-lg border-none bg-color-100 pl-10 pr-10 text-base text-foreground outline-none placeholder:opacity-60"
              aria-label="Search query"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-accent-base hover:bg-accent-base/10 focus:outline-2 focus:outline-accent-two outline-offset-2"
                aria-label="Clear search query"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading && (
          <div className="px-2 py-3 text-sm text-color-600 dark:text-color-400">
            Searching…
          </div>
        )}
        {!loading && query.trim().length > 0 && results.length === 0 && (
          <div className="px-2 py-3 text-sm text-color-600 dark:text-color-400">
            No results
          </div>
        )}

        {!loading &&
          results.length > 0 &&
          results.map((r, idx) => {
            const isActive = idx === activeIndex;
            return (
              <a
                key={`${r.url}-${idx}`}
                href={r.url}
                className={[
                  "block rounded-lg px-3 py-2 transition-colors",
                  isActive
                    ? "bg-accent-base/10 text-accent-two"
                    : "hover:bg-accent-base/5 text-foreground",
                ].join(" ")}
                onMouseEnter={() => activateIndex(idx)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{r.title}</div>
                  {r.type && (
                    <span className="text-xs text-color-600 dark:text-color-400">
                      {r.type}
                    </span>
                  )}
                </div>
                {r.description && (
                  <div className="mt-0.5 line-clamp-2 text-sm text-color-600 dark:text-color-400">
                    {r.description}
                  </div>
                )}
              </a>
            );
          })}
      </div>

      {/* Footer actions */}
      <div className="border-t border-accent-base/10 p-2">
        <button
          type="button"
          onClick={handleBack}
          className="w-full rounded-lg bg-color-100 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent-base/10 focus:outline-2 focus:outline-accent-two outline-offset-2"
          aria-label="Back to menu"
        >
          Back to menu
        </button>
      </div>
    </div>
  );
};

export default SearchMobilePanel;
