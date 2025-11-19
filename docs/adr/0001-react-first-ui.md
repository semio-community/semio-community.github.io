# ADR 0001 — React-first UI with Astro routing

- Status: Accepted
- Date: 2025-11-14

## Context

Semio Community's site uses Astro for routing/content collections and React for most UI. Historically many shared components (headers, cards, sections) existed as `.astro` wrappers around React logic so we could attach hydration directives. This duplication caused confusion, made the migration harder to reason about, and left contributors unsure where UI code should live.

## Decision

- All shared UI should live in React (`.tsx`) components under `src/components/**`.
- Astro remains only for:
  - File-based routing and redirects under `src/pages/**`.
  - Head/SEO helpers (e.g., `BaseHead.astro`).
  - Layout glue that needs direct control over hydration directives (currently `SiteShell.astro` and slug routes that call `astro:content` APIs).
- Layout primitives that used to be `.astro` (Header, Footer, ThemeProvider, SkipLink) are being rewritten in React and consumed from `SiteShell`. Astro slots are no longer required to inject those pieces.
- React page components live in `src/react-pages/<route>/` and are rendered from their matching `.astro` file, keeping all data loading server-side.

## Consequences

- Contributors have a single place to look for UI (React) and can stop creating new `.astro` wrappers unless they truly need a custom hydration boundary.
- `SiteShell.astro` becomes the only layout entry point that knows about hydration directives (e.g., applying `client:load` to the header). All routes automatically pick up the same layout behavior.
- Performance stays predictable because we still opt into hydration only where interaction exists (navigation menu, search, popovers). The hydration policy (see `docs/hydration-policy.md`) documents the current directives.
- Future work: once Astro's head/theme logic is ported to React completely, we can consider dropping the remaining `.astro` helpers (e.g., replacing `BaseHead.astro` with a React head component if desired).
