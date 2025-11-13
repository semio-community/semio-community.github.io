# React Migration Plan

Audience: Maintainers and contributors of the Semio Community website.
Status: Draft
Last updated: YYYY-MM-DD

## Purpose

Standardize the codebase on React for components and page UIs while retaining Astro for routing, content collections, and SSG. The migration must preserve or improve performance (TTFB, CLS, JS shipped), maintainability, and developer experience.

## Current state (summary)

- Astro v5 with React integration enabled.
- Routes: primarily `.astro` files in `src/pages/**`.
- UI: mixture of `.astro` components and React `.tsx` components.
- Content: Astro Content Collections + Zod schemas + MDX in `src/content/**`.
- Styling: Tailwind v4 via Vite plugin.
- Search: Pagefind.
- Hosting: GitHub Pages (DNS via Squarespace).

## Goals

- React-first component architecture across the site.
- Keep Astro for:
  - File-based routing and redirects.
  - Static Site Generation (SSG).
  - Content Collections and MDX parsing.
  - Head/SEO primitives and zero-JS-by-default ergonomics.
- Maintain Astro-level performance: only hydrate what needs interactivity.
- Minimize churn for MDX content authors.

## Non-goals

- Switching hosting or build system.
- Replacing Astro Content Collections.
- Introducing a different meta-framework (e.g., Next.js) at this time.

## Design principles

- Astro for routing, React for rendering:
  - Use `.astro` route files as thin wrappers whose primary job is to load data and render a single React page component.
- Default to server-rendered React components with no hydration:
  - Only add hydration directives (client:*) on components that require interactivity.
- Keep data-fetching in shared server-side modules (`src/data/**`):
  - Import those in `.astro` routes and pass results into React page components as props.
- Maintain “islands” boundaries:
  - Keep interactive components small and self-contained.
- Favor incremental, reversible changes:
  - Migrate core layout first, then components, then pages, then dynamic routes.

## Directory conventions

- React page components:
  - `src/pages` remains Astro route files.
  - Add `src/react-pages/` (or `src/pages-react/`) for page-level React components (one per route).
- React shared components:
  - Continue using `src/components/**` for shared UI; prefer `.tsx`.
- Layout:
  - Create `src/layouts/BaseLayout.tsx` to mirror the existing `Base.astro` layout features.
- Data modules:
  - Keep and extend `src/data/**` for content queries (already in use).

## Hydration strategy

- SSR-only by default (no client directive) for:
  - Headers/footers, static sections, cards, lists.
- Use hydration only for interactive elements:
  - `client:visible` for UI that appears in viewport (e.g., mobile menu, search modal).
  - `client:idle` for low-priority enhancements.
- Avoid `client:load` unless the interaction must be immediately available at page load.
- Consider dynamic `import()` for heavy subtrees within interactive components.
- Validate that any component with hydration has a clear user interaction justification.

## Performance guardrails

- JS shipped per route should not increase materially after migration.
- Track:
  - Lighthouse score ≥ pre-migration.
  - TTI, TBT, CLS at or better than baseline.
  - Bundle sizes using Vite’s analysis.
- Use code-splitting for large, optional UI (e.g., search).
- Keep image handling unchanged to leverage Astro image pipelines where applicable.

## Phased migration approach

Phase 0 — Preparation
- Document the migration decision (ADR in `docs/`).
- Add a lint rule and Biome/Prettier preferences that:
  - Encourage React `.tsx` for UI components.
  - Keep `.astro` primarily for routes, head tags, and client directives.
- Confirm TypeScript configs support React 19 and JSX in `.tsx`.
- Add a simple bundle size check and/or Lighthouse CI to CI pipeline.
- Define a hydration policy (which components can hydrate; which directive to prefer).

Phase 1 — Layout and head
- Create `BaseLayout.tsx` that replicates `Base.astro` structure:
  - `<html lang>`, `<head>` SEO and social tags, fonts and CSS.
  - ThemeProvider, SkipLink, Header, Footer.
  - Content container structure and background layers.
- Convert `BaseHead.astro` into a React head utility used inside the layout (while still allowing Astro to manipulate `<head>` via the route).
- Update 1–2 `.astro` routes (e.g., `index.astro`) to render the React page component within `BaseLayout`.
- Validate no change in visual or functional behavior.

Phase 2 — Shared components
- Convert `.astro` UI components to React, preserving props contracts:
  - `Hero.astro`, `Section.astro`, `GlyphField.astro`, etc.
  - Replace in pages with `.tsx` equivalents.
- Keep purely presentational components SSR-only (no hydration).
- For interactive atoms (e.g., tooltips, popovers, mobile nav):
  - Opt into hydration with `client:visible` or `client:idle`.
- Remove or deprecate `.astro` versions once replaced and tested.

Phase 3 — Page components
- Introduce React page components for:
  - Home (index), projects, contributors, events, etc.
- Each `.astro` route:
  - Imports server-side data from `src/data/**`.
  - Passes props to the corresponding React page component.
- Ensure Pagefind/search still functions with minimal hydration scope.

Phase 4 — Dynamic routes
- Keep `.astro` dynamic routes (e.g., `[...slug].astro`) as thin wrappers:
  - Load the MDX entry via `astro:content`.
  - Render a React detail page component with the entry as props.
- Replace any `.astro`-only detail widgets with React variants.

Phase 5 — Cleanup and stabilization
- Remove unused `.astro` components.
- Ensure all pages use `BaseLayout.tsx`.
- Rebaseline performance metrics and compare to Phase 0.
- Update documentation and onboarding guidance.

## Data and content considerations

- Continue using Astro Content Collections and Zod schemas (no change for authors).
- MDX content remains in `src/content/**`.
- If any React component needs `ImageMetadata` from Astro’s `image()`:
  - Keep importing content via `.astro` route and pass already-resolved image props into React components.
  - Alternatively, relax Zod image types to accept `string | ImageMetadata` and handle both forms in React components if needed.

## Testing and verification

- Unit tests:
  - Add lightweight tests for React components (props, rendering, simple logic).
- Visual checks:
  - Storybook (optional) or per-route screenshots for common viewports.
- Performance:
  - Lighthouse CI or WebPageTest budget checks in CI.
- Accessibility:
  - Axe/lighthouse a11y checks for key pages.
- Content integrity:
  - Existing build checks (`astro check`, draft verifier) continue to run.

## Rollback plan

- Each phase is PR-gated and reversible.
- Avoid deleting `.astro` components until their React equivalents are battle-tested and merged.
- Maintain branches per phase to allow quick revert to last known good.

## Risks and mitigations

- Risk: Increased JS shipped to client.
  - Mitigation: Strict hydration policy; measure bundle sizes per page.
- Risk: Layout differences.
  - Mitigation: Incremental rollout; compare screenshots and DOM diffs.
- Risk: Image pipeline regressions.
  - Mitigation: Keep Astro handling of images at the route level and pass results to React; test image-heavy pages.
- Risk: Developer confusion during transition.
  - Mitigation: Document conventions; use consistent naming and colocated page components.

## Success criteria

- All UI components migrated to React `.tsx`.
- `.astro` files remain primarily as route wrappers + head/SEO + hydration directives.
- Equal or better Lighthouse scores and JS payloads.
- No regressions in content rendering, search, or navigation.
- Documentation updated; contributors can follow conventions without confusion.

## Task checklist (high level)

- Create `BaseLayout.tsx` with props parity and SSR-only by default.
- Convert: `Header.astro`, `Footer.astro`, `Hero.astro`, `Section.astro`, and other shared components to React.
- Migrate `index.astro` to render `<HomePage />` within `<BaseLayout />`.
- Migrate `projects.astro`, `contributors.astro`, `events.astro`, and dynamic detail pages.
- Replace hydration for nav/search/popovers with `client:visible`/`client:idle`.
- Remove deprecated `.astro` components after parity is confirmed.
- Establish CI checks for performance, bundle size, and a11y.
- Update docs and contributor guide.

## Appendix: practical tips

- Keep `.astro` route files as small as possible: imports, data fetch, single React render.
- Co-locate page-specific components under `src/react-pages/your-page/` to avoid a flat, crowded components directory.
- For any React component that must run only on the client, consider moving it behind a small `.astro` “island” wrapper with the appropriate `client:*` directive.
- Use dynamic `import()` in React for optional panels (e.g., search modal) to avoid loading them in the main bundle.
- Prefer stable UI libraries you already use (Radix UI) and avoid new heavy dependencies during migration.

## Phase 0 — Status audit (current findings)

- Linting/formatting:
  - Biome and Prettier are configured. Biome formatter is set to ignore *.astro files; Prettier is run with prettier-plugin-astro for formatting .astro via "format:code" script.
  - Scripts present: "lint", "format", "format:code", "format:imports".
- TypeScript:
  - tsconfig extends "astro/tsconfigs/strictest", with DOM libs and path alias "@/*" → "src/*".
  - Strict settings are enabled; React 19 is compatible with current TS version (>=5.7).
- React and Astro:
  - react and react-dom are at ^19.2.0.
  - @astrojs/react integration is installed and enabled in astro.config.ts.
- Routing and data:
  - Routes are primarily .astro files under src/pages/**.
  - Data fetching is centralized in src/data/** modules and used in .astro routes (good baseline).
- Hydration/interactivity:
  - Interactive components exist (navigation, search, tooltips/popovers) implemented in React TSX.
  - No explicit, codified hydration policy yet (client:* directives applied ad hoc).
- Layout:
  - The primary layout is src/layouts/Base.astro; there is no React equivalent yet.
- Content and images:
  - Astro Content Collections with Zod schemas in src/content.config.ts.
  - MDX entries under src/content/**.
  - Image fields use image() where applicable; components accept Astro image metadata.
- CI/CD:
  - GitHub Actions workflow builds and deploys to GitHub Pages.
  - No performance checks (Lighthouse/bundle size) in CI at present.
- Performance:
  - Tailwind v4 via Vite plugin; Pagefind runs postbuild for search indexing.
  - No bundle size regression guardrails yet.
- Previews:
  - Pages deploy on merge to main; no PR preview environment configured.

## Phase 0 — Actionable next steps

- Conventions and docs:
  - Add a short ADR in docs/ capturing "React-first components; .astro only for routes/head/hydration islands".
  - Document hydration policy: default SSR-only; use client:visible or client:idle for specific interactive components; avoid client:load unless necessary.
- Directory structure:
  - Create src/react-pages/ and add a README.md describing usage (one React page component per route).
- Layout scaffolding:
  - Introduce src/layouts/BaseLayout.tsx that mirrors Base.astro structure. Keep Base.astro temporarily until parity is verified.
- Linting/formatting:
  - Keep current setup. Optionally remove "*.astro" ignore from Biome formatter once most UI moves to React; Prettier already formats .astro via plugin.
- CI enhancements:
  - Add Lighthouse CI (or GitHub Action) to measure LCP/CLS/TBT on key routes.
  - Add a bundle size report step (e.g., vite-bundle-visualizer or rollup-plugin-visualizer in CI) with a basic budget.
- Hydration guardrails:
  - Inventory interactive components (nav, search, tooltips/popovers) and explicitly annotate with client:visible or client:idle in the route wrappers.
- Previews (optional):
  - Add PR preview builds (e.g., publish build artifacts and comment URLs, or deploy previews to a secondary static host).
- Success criteria baseline:
  - Capture current Lighthouse scores and JS payload sizes for Home, Projects, and a Detail page to compare post-migration.

## Icon migration registry (homepage React components)

Purpose:
- Keep a running record of icons used in React components to ensure consistent, solar-only icon usage and aid future migrations.

Library:
- Use line icons from "@solar-icons/react-perf/LineDuotone".
- Icons should inherit color via currentColor; pass className to control size/color/hover transforms.
- Prefer passing a React element (icon) or a render function (iconRender) over string-based icon names.

Components and icons (current homepage):

- ProgramsSection (src/react-pages/home/sections/ProgramsSection.tsx)
  - Hardware: CpuBolt
  - Software: CodeSquare
  - Research: TestTube
  - Notes:
    - Icons are injected via iconRender={(className) => <Icon className={className} />} so they receive size/variant color classes and hover scaling.

- PartnersSection (src/react-pages/home/sections/PartnersSection.tsx)
  - Academia: SquareAcademicCap
  - Industry: Buildings2
  - Public Sector: Flag2
  - Notes:
    - Icons use className="w-12 h-12" and inherit contextual color (e.g., variant text classes).

- LinkCardReact (src/components/cards/LinkCardReact.tsx)
  - Accepts either:
    - icon: a React node (must respect currentColor), or
    - iconRender: (className) => ReactNode (recommended to ensure consistent styling)
  - Used by ProgramsSection to render the three program tiles.

Pending mappings / TODO:
- MissionSection (src/react-pages/home/sections/MissionSection.tsx)
  - Currently rendered without icons in React for parity. The original Astro used mixed icon sets (hugeicons and a solar icon).
  - Action: decide on solar-only equivalents for:
    - Community-Driven (TBD)
    - Human-Centered (TBD)
    - Replicable (TBD)
  - Apply the same pattern as ProgramsSection (iconRender) once decided.

Conventions (for future components):
- Import icons from "@solar-icons/react-perf/LineDuotone".
- Standard size: "w-12 h-12" unless a specific component requires a different scale.
- Color and hover: let parent container provide the color via variant text classes; icons inherit via currentColor.
- Avoid string-based icon lookups. Pass React elements directly to maintain type-safety and remove runtime resolution.
