import React from "react";

/**
 * SearchProvider.tsx
 *
 * React-first search context built to orchestrate a Radix-based search UI,
 * backed by Pagefind’s client-side query API.
 *
 * This is a scaffold per the plan in SEARCH_OPTIONS.md:
 * - Provides a single source of truth for search UI state
 * - Lazy-loads Pagefind on demand and normalizes results
 * - Exposes imperative actions for desktop modal and mobile panel modes
 *
 * The actual desktop modal and mobile panel components will consume this
 * provider via the exported `useSearch()` hook.
 */

/* =========================
 * Types and interfaces
 * ========================= */

export type SearchMode = "none" | "desktop-modal" | "mobile-panel";

export type SearchRecord = {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  type?: string;
  status?: string;
  year?: number;
  excerpt?: string;
};

export type SearchContextState = {
  // UI mode
  mode: SearchMode;

  // Query & results
  query: string;
  results: SearchRecord[];
  loading: boolean;
  error: string | null;

  // Keyboard navigation
  activeIndex: number | null;

  // Actions
  openDesktopModal: () => void;
  closeDesktopModal: () => void;

  enterMobileMode: () => void;
  exitSearchMode: () => void;

  setQuery: (value: string) => void; // debounced externally in this provider
  clear: () => void;

  moveActive: (delta: number) => void;
  activateIndex: (index: number) => void;
};

export type SearchProviderProps = {
  children: React.ReactNode;
  /**
   * If true, attempts to preload Pagefind on mount (idle).
   */
  preloadOnMount?: boolean;
  /**
   * Custom debounce delay for queries (ms). Default: 200.
   */
  debounceMs?: number;
  /**
   * Breakpoint (px) to switch between desktop and mobile behavior when handling hotkeys.
   * Default: 768 (Tailwind `md`).
   */
  mobileBreakpoint?: number;
};

/* =========================
 * Pagefind client scaffold
 * ========================= */

/**
 * Minimal Pagefind types (loose to avoid build friction).
 */
type PagefindResultItem = {
  data: () => Promise<any>;
};

type PagefindSearchResponse = {
  results: PagefindResultItem[];
};

type PagefindClientApi = {
  search: (
    query: string,
    opts?: Record<string, unknown>,
  ) => Promise<PagefindSearchResponse>;
};

let _pagefindApi: PagefindClientApi | null = null;

/**
 * Dynamically loads the Pagefind client from the site’s bundle.
 * Note: The path is typically "/pagefind/pagefind.js" at runtime.
 * If your site runs under a base URL, you may need to prefix with that base.
 */
async function loadPagefind(): Promise<PagefindClientApi> {
  if (_pagefindApi) return _pagefindApi;

  if (typeof window === "undefined") {
    // SSR safety: never attempt to load Pagefind server-side
    throw new Error("Pagefind is only available in the browser.");
  }

  // In development, the Pagefind bundle may not exist. Provide a mock to avoid
  // Vite resolution errors and allow UI development without the index.
  // Consumers should still see a working UI with no results.
  const isDev =
    (import.meta as any)?.env?.DEV ??
    (typeof window !== "undefined" &&
      !!window.location &&
      /^(localhost|127\.0\.0\.1|.*\.local)$/i.test(window.location.hostname));

  if (isDev) {
    // Rich dev-mode mock to populate the UI for debugging
    type MockMeta = {
      url: string;
      title: string;
      description?: string;
      tags?: string[];
      type?: string;
      status?: string;
      year?: number;
      excerpt?: string;
    };
    const MOCK_DATA: MockMeta[] = [
      {
        url: "/projects/",
        title: "Projects Home",
        description: "Browse all community projects.",
        tags: ["projects", "overview"],
        type: "page",
        year: 2025,
        excerpt: "Landing page for hardware, software, and research projects.",
      },
      {
        url: "/hardware/coral-edge-tpu",
        title: "Coral Edge TPU",
        description: "Hardware accelerator for ML workloads at the edge.",
        tags: ["hardware", "ml", "accelerator"],
        type: "hardware",
        status: "available",
        year: 2024,
        excerpt: "Low-power ML inference accelerator used across edge devices.",
      },
      {
        url: "/software/semio-core",
        title: "Semio Core",
        description: "Core software stack for the Semio ecosystem.",
        tags: ["software", "platform"],
        type: "software",
        status: "stable",
        year: 2025,
        excerpt: "Foundation services, APIs, and tooling for Semio projects.",
      },
      {
        url: "/research/embodied-vision-2023",
        title: "Embodied Vision Methods",
        description: "Comparative study of embodied vision techniques.",
        tags: ["research", "vision"],
        type: "research",
        status: "published",
        year: 2023,
        excerpt: "Survey of methods for perception in embodied AI systems.",
      },
      {
        url: "/get-involved/",
        title: "Get Involved",
        description: "Contribute, donate, volunteer, or join the community.",
        tags: ["community", "contribute"],
        type: "page",
        year: 2025,
        excerpt: "All the ways you can participate in the Semio community.",
      },
      {
        url: "/services/",
        title: "Services",
        description: "Hardware, software, and research services.",
        tags: ["services"],
        type: "page",
        year: 2025,
        excerpt: "Offerings and engagements for partners and contributors.",
      },
      {
        url: "/contributors/",
        title: "Contributors",
        description:
          "People and organizations advancing human-centered robotics and AI together.",
        tags: ["contributors", "people", "organizations"],
        type: "page",
        year: 2025,
        excerpt: "People, partners, and sponsors supporting the community.",
      },
      {
        url: "/events/",
        title: "Events",
        description: "Upcoming and past events.",
        tags: ["events"],
        type: "page",
        year: 2025,
        excerpt: "Workshops, talks, and community gatherings.",
      },
    ];
    const normalize = (m: MockMeta) => ({
      meta: {
        url: m.url,
        title: m.title,
        description: m.description,
        tags: m.tags,
        type: m.type,
        status: m.status,
        year: m.year,
        excerpt: m.excerpt,
      },
      url: m.url,
      title: m.title,
      description: m.description,
      tags: m.tags,
      type: m.type,
      status: m.status,
      year: m.year,
      excerpt: m.excerpt,
    });
    const mock: PagefindClientApi = {
      async search(query: string) {
        const q = (query || "").toLowerCase().trim();
        const filtered = !q
          ? []
          : MOCK_DATA.filter((item) => {
              const hay = [
                item.title,
                item.description,
                item.type,
                item.status,
                ...(item.tags || []),
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
              const tokens = q.split(/\s+/).filter(Boolean);
              return tokens.every((t) => hay.includes(t));
            });
        return {
          results: filtered.map((item) => ({
            // shape compatible with Pagefind: result.data() => Promise<raw>
            data: async () => normalize(item),
          })),
        } as unknown as PagefindSearchResponse;
      },
    };
    _pagefindApi = mock;
    return mock;
  }

  // Compute the runtime URL for the pagefind script.
  // Astro injects BASE_URL; ensure no trailing slash.
  const base: string =
    ((import.meta as any)?.env?.BASE_URL as string) ||
    (typeof document !== "undefined" ? document.baseURI : "/");
  const cleanBase = base && base.endsWith("/") ? base.slice(0, -1) : base || "";
  const pagefindUrl = `${cleanBase}/pagefind/pagefind.js`;

  // Dynamic import by URL at runtime; prevent Vite from trying to resolve it statically.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  try {
    const mod = await import(/* @vite-ignore */ pagefindUrl);
    const api: PagefindClientApi = (mod?.default || mod) as PagefindClientApi;
    _pagefindApi = api;
    return api;
  } catch (e) {
    // Fallback: if the Pagefind script isn't available, provide an empty mock.
    const mock: PagefindClientApi = {
      async search() {
        return { results: [] } as unknown as PagefindSearchResponse;
      },
    };
    _pagefindApi = mock;
    return mock;
  }
}

/**
 * Normalize a raw Pagefind item (from item.data()) into SearchRecord.
 * Expect your Astro pages to emit frontmatter into indexable locations (JSON-LD or meta tags)
 * so Pagefind returns these fields in data().
 */
function normalizeRecord(raw: any): SearchRecord {
  // Known properties that are commonly provided by Pagefind:
  // raw.url, raw.content, raw.meta (depends on your integration)
  // Here we attempt to favor explicit frontmatter fields if present.
  const meta = raw?.meta ?? raw ?? {};
  const url: string = raw?.url || meta?.url || "#";

  // Prefer explicit fields; fallback to common keys
  const title: string =
    meta.title || raw?.title || raw?.content?.title || "Untitled";

  const description: string | undefined =
    meta.description || raw?.description || undefined;

  const tags: string[] | undefined =
    meta.tags || (Array.isArray(raw?.tags) ? raw.tags : undefined);

  const type: string | undefined = meta.type || raw?.type || undefined;

  const status: string | undefined = meta.status || raw?.status || undefined;

  const year: number | undefined = (() => {
    const y = meta.year ?? raw?.year;
    const parsed = typeof y === "string" ? parseInt(y, 10) : y;
    return Number.isFinite(parsed) ? (parsed as number) : undefined;
  })();

  // Excerpt/highlighted snippet (if available)
  const excerpt: string | undefined =
    meta.excerpt || raw?.excerpt || raw?.content || undefined;

  return {
    url,
    title,
    description,
    tags,
    type,
    status,
    year,
    excerpt,
  };
}

/* =========================
 * Utilities
 * ========================= */

/**
 * Simple debounce utility hook (leading=false, trailing=true).
 */
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  const ref = React.useRef<number | null>(null);
  const cbRef = React.useRef(callback);
  cbRef.current = callback;

  const clear = () => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  React.useEffect(() => clear, []);

  return React.useCallback(
    (...args: Parameters<T>) => {
      clear();
      ref.current = window.setTimeout(() => {
        cbRef.current(...args);
      }, delay);
    },
    [delay],
  );
}

/**
 * Returns true if it is appropriate to open the search UI
 * based on the focused element (avoid when the user is typing in inputs).
 */
function okToOpenFromHotkey(): boolean {
  if (typeof document === "undefined") return false;
  const active = document.activeElement;
  if (!active) return true;
  const tag = active.tagName?.toLowerCase();
  const editable =
    (active as HTMLElement).isContentEditable ||
    tag === "input" ||
    tag === "textarea" ||
    tag === "select";
  return !editable;
}

/* =========================
 * Context and provider
 * ========================= */

const SearchContext = React.createContext<SearchContextState | null>(null);

export function useSearch(): SearchContextState {
  const ctx = React.useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return ctx;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
  children,
  preloadOnMount = false,
  debounceMs = 120,
  mobileBreakpoint = 768,
}) => {
  // UI State
  const [mode, setMode] = React.useState<SearchMode>("none");
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<SearchRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Keyboard navigation
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Internal
  const lastRequestId = React.useRef<number>(0);
  const cacheRef = React.useRef<Map<string, SearchRecord[]>>(new Map());

  // Lazy preload on mount (idle)
  React.useEffect(() => {
    if (!preloadOnMount || typeof window === "undefined") return;
    const onIdle =
      (window as any).requestIdleCallback ||
      ((cb: FrameRequestCallback) => window.setTimeout(cb, 1));
    onIdle(async () => {
      try {
        await loadPagefind();
      } catch {
        // no-op; keep silent preload
      }
    });
  }, [preloadOnMount]);

  const applyResults = React.useCallback(
    (records: SearchRecord[], reqId: number) => {
      // Only apply if this response is the latest request
      if (reqId !== lastRequestId.current) return;
      setResults(records);
      setActiveIndex(records.length > 0 ? 0 : null);
      setLoading(false);
      setError(null);
    },
    [],
  );

  const runSearch = React.useCallback(
    async (q: string, reqId: number) => {
      setLoading(true);
      setError(null);
      try {
        const cached = cacheRef.current.get(q);
        if (cached) {
          applyResults(cached, reqId);
          return;
        }
        const api = await loadPagefind();
        const resp = await api.search(q);
        const rawItems = resp?.results ?? [];
        const normalized: SearchRecord[] = [];

        // Pull data() for each result (serially or in parallel).
        // In practice, Pagefind returns small payloads, so this is fine.
        for (const item of rawItems) {
          try {
            const data = await item.data();
            normalized.push(normalizeRecord(data));
          } catch {
            // Ignore individual item errors
          }
        }

        cacheRef.current.set(q, normalized);
        applyResults(normalized, reqId);
      } catch (e: any) {
        if (reqId !== lastRequestId.current) return;
        setLoading(false);
        setError(e?.message || "Search failed.");
      }
    },
    [applyResults],
  );

  // Debounce only the search execution; keep input (query) state immediate
  const scheduleSearch = useDebouncedCallback((next: string) => {
    const trimmed = (next ?? "").trim();
    if (!trimmed) {
      setResults([]);
      setActiveIndex(null);
      setLoading(false);
      setError(null);
      return;
    }
    const reqId = ++lastRequestId.current;
    runSearch(trimmed, reqId);
  }, debounceMs);

  const immediateSetQuery = React.useCallback(
    (value: string) => {
      // update input state immediately to avoid laggy typing
      setQuery(value ?? "");
      // schedule the debounced search with the fresh value
      scheduleSearch(value ?? "");
    },
    [scheduleSearch],
  );

  /* ===========
   * Actions
   * =========== */

  const openDesktopModal = React.useCallback(() => {
    setMode("desktop-modal");
  }, []);

  const closeDesktopModal = React.useCallback(() => {
    setMode("none");
    // Keep query/results around between opens? For now, clear.
    setQuery("");
    setResults([]);
    setActiveIndex(null);
    setLoading(false);
    setError(null);
  }, []);

  const enterMobileMode = React.useCallback(() => {
    setMode("mobile-panel");
  }, []);

  const exitSearchMode = React.useCallback(() => {
    setMode("none");
    setQuery("");
    setResults([]);
    setActiveIndex(null);
    setLoading(false);
    setError(null);
  }, []);

  const clear = React.useCallback(() => {
    setQuery("");
    setResults([]);
    setActiveIndex(null);
    setLoading(false);
    setError(null);
  }, []);

  const moveActive = React.useCallback(
    (delta: number) => {
      if (!results.length) return;
      setActiveIndex((prev) => {
        const curr = typeof prev === "number" ? prev : 0;
        const next = (curr + delta + results.length) % results.length;
        return next;
      });
    },
    [results.length],
  );

  const activateIndex = React.useCallback(
    (index: number) => {
      if (!results.length) return;
      const clamped = Math.max(0, Math.min(index, results.length - 1));
      setActiveIndex(clamped);
    },
    [results.length],
  );

  /* ===========
   * Hotkey: '/'
   * =========== */

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      if (!okToOpenFromHotkey()) return;

      const isMobile = window.innerWidth < mobileBreakpoint;
      if (mode === "none") {
        e.preventDefault();
        if (isMobile) {
          enterMobileMode();
        } else {
          openDesktopModal();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enterMobileMode, mobileBreakpoint, mode, openDesktopModal]);

  /* ===========
   * Context value
   * =========== */

  const ctx: SearchContextState = React.useMemo(
    () => ({
      mode,
      query,
      results,
      loading,
      error,
      activeIndex,

      openDesktopModal,
      closeDesktopModal,
      enterMobileMode,
      exitSearchMode,

      setQuery: immediateSetQuery,
      clear,

      moveActive,
      activateIndex,
    }),
    [
      mode,
      query,
      results,
      loading,
      error,
      activeIndex,
      openDesktopModal,
      closeDesktopModal,
      enterMobileMode,
      exitSearchMode,
      immediateSetQuery,
      clear,
      moveActive,
      activateIndex,
    ],
  );

  return (
    <SearchContext.Provider value={ctx}>{children}</SearchContext.Provider>
  );
};

/* =========================
 * Notes for integrators
 * =========================
 *
 * - Wrap your app (or at least the header + mobile nav area) with <SearchProvider>.
 *
 * - Desktop:
 *   - The header search button should call useSearch().openDesktopModal().
 *   - A <SearchModal /> component will read mode === 'desktop-modal' and render
 *     a Radix Dialog content containing <SearchInput> and <SearchResultsList>.
 *
 * - Mobile:
 *   - The button inside the MobileNavigation dialog header should call useSearch().enterMobileMode().
 *   - When mode === 'mobile-panel', render a <SearchMobilePanel /> inside the dialog content
 *     instead of the regular nav list.
 *
 * - Query:
 *   - Bind <SearchInput onChange={setQuery} value={query} />.
 *   - Results are in `results`. Use `activeIndex`, `moveActive`, and `activateIndex`
 *     to support Up/Down/Enter keyboard navigation.
 *
 * - Pagefind:
 *   - Ensure frontmatter fields are emitted into indexable HTML so normalizeRecord() can map them.
 *   - If your site is under a base path, you may need to adjust the dynamic import path.
 */
