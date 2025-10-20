import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useSearch } from "./SearchProvider";

/**
 * SearchModal
 *
 * Stub component for the desktop search modal using Radix Dialog.
 * This reads state from the SearchProvider and renders a shell UI
 * that we can iterate on. It intentionally avoids importing any
 * not-yet-implemented shared components (e.g., SearchInput, ResultsList).
 *
 * Integration:
 * - Mount <SearchProvider> high enough (e.g., around Header) so this can read context.
 * - Render <SearchModal /> once in the app (e.g., near the end of Header or Base layout).
 * - Trigger opening with: const { openDesktopModal } = useSearch()
 */

export const SearchModal: React.FC = () => {
  const {
    mode,
    closeDesktopModal,
    openDesktopModal,
    query,
    setQuery,
    results,
    loading,
    activeIndex,
    moveActive,
    activateIndex,
  } = useSearch();

  const open = mode === "desktop-modal";
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Autofocus input on open
  React.useEffect(() => {
    if (open) {
      // Defer to next frame to ensure content is mounted
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [open]);

  // Basic keyboard nav for stub
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    }
    if (
      e.key === "Enter" &&
      typeof activeIndex === "number" &&
      results[activeIndex]
    ) {
      window.location.href = results[activeIndex].url;
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) openDesktopModal();
        else closeDesktopModal();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />
        <Dialog.Content
          onKeyDown={onKeyDown}
          className="fixed inset-x-0 top-[8vh] z-50 mx-auto w-full max-w-[44rem] rounded-xl border border-accent-base/10 bg-surface/90 p-4 shadow-2xl backdrop-blur-xl focus:outline-none data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut"
        >
          {/* Input (stub) */}
          <div className="mb-3">
            <div className="relative">
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
              <button
                type="button"
                onClick={() => {
                  const trimmed = (query ?? "").trim();
                  if (!trimmed) {
                    closeDesktopModal();
                  } else {
                    setQuery("");
                  }
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-accent-base hover:bg-accent-base/10 focus:outline-2 focus:outline-accent-two outline-offset-2"
                aria-label="Clear search or close"
                title="Clear search or close"
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
            </div>
          </div>

          {/* Results shell (stub) */}
          {(loading || (query ?? "").trim().length > 0) && (
            <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-accent-base/10 bg-surface/50 p-2">
              {loading && (
                <div className="px-2 py-3 text-sm text-color-600 dark:text-color-400">
                  Searching…
                </div>
              )}
              {!loading &&
                (query ?? "").trim().length > 0 &&
                results.length === 0 && (
                  <div className="px-2 py-3 text-sm text-color-600 dark:text-color-400">
                    No results
                  </div>
                )}
              {!loading &&
                results.length > 0 &&
                results.slice(0, 8).map((r, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <a
                      key={`${r.url}-${idx}`}
                      href={r.url}
                      className={[
                        "block rounded-md px-3 py-2 transition-colors",
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
          )}

          {/* Footer hint (stub) */}
          <div className="mt-3 flex items-center justify-between text-xs text-color-600 dark:text-color-400">
            <span>Use ↑/↓ to navigate • Enter to open • Esc to close</span>
            <span>
              Showing {results.length > 8 ? "8+" : results.length} result
              {results.length === 1 ? "" : "s"}
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SearchModal;
