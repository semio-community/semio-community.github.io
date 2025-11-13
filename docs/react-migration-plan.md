# React Migration Plan

Audience: Maintainers and contributors of the Semio Community website.
Status: In progress
Last updated: 2025-11-13

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
  - Use `src/layouts/SiteLayout.tsx` (React) for the content wrapper and `src/layouts/SiteShell.astro` (Astro) to compose shell concerns (ThemeProvider, SkipLink, Header/Footer slots) and hydrate only backgrounds where needed.
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
- Current usage:
  - Background parallax (ParallaxHexBackground) hydrates via a small island composed by `SiteShell` while the rest of the homepage remains SSR-only.

## Performance guardrails

- JS shipped per route should not increase materially after migration.
- Track:
  - Lighthouse score ≥ pre-migration.
  - TTI, TBT, CLS at or better than baseline.
  - Bundle sizes using Vite’s analysis.
- Use code-splitting for large, optional UI (e.g., search).
- Keep image handling unchanged to leverage Astro image pipelines where applicable.

## Phased migration approach

Phase 0 — Preparation (Status: partially complete)
- Completed:
  - Created `src/react-pages/` and established React-first page composition for the experimental homepage route.
  - Baseline conventions documented in this plan; directory naming aligned.
  - TypeScript strict settings and React 19 compat verified.
- Remaining:
  - Short ADR documenting “React-first UI; `.astro` for routing/head/hydration islands.”
  - Hydration policy doc (codify current background-only hydration; SSR-first elsewhere).
  - CI: Lighthouse/bundle-size reporting and budgets.

Phase 1 — Layout and head (Status: in progress)
- Completed:
  - Introduced `SiteLayout.tsx` (SSR-only React layout wrapper).
  - Introduced `SiteShell.astro` to compose ThemeProvider/SkipLink/Header/Footer and hydrate background only.
  - Implemented a parallax background as a dedicated React component with island hydration (minimal scope).
- Remaining:
  - A React head utility (optional) if we decide to manage `<head>` in React; currently `BaseHead.astro` remains in use.
  - Apply `SiteShell` across additional routes once React pages are introduced.

Phase 2 — Shared components (Status: in progress)
- Completed:
  - Ported and/or created React equivalents used on the homepage:
    - `HeroReact`, `ParallaxHexBackground`, `SectionBlock` (shared), `LinkCardReact`.
  - Ensured exact style parity for cards/sections (class translations).
  - Removed unused legacy wrappers (`Hero.astro`, `Section.astro`, `GlyphField.astro`, `CallToActionButton.astro`, `ItemCard.astro`, `FeatureCard.astro`, `LinkCard.astro`, `Search.astro`, `ThemeToggle.astro`, `Timeline.astro`, `LinkButton.astro`, `TagsList.astro`, `PricingInfo.astro`, background island) now that React replacements exist.
- Remaining:
  - Convert remaining `.astro` UI used across other pages (contributors/projects/events wrappers, detail layouts, card data bridges) to React where appropriate.
  - Keep purely presentational components SSR-only; hydrate only interactive leaves.

Phase 3 — Page components (Status: in progress)
- Completed:
  - Homepage content now composed of reusable React sections:
    - `HeroSection`, `MissionSection`, `ProgramsSection`, `PartnersSection`, `ConnectSection`.
  - Background hydration constrained to the background component; page remains SSR-only React.
- Remaining:
  - Convert additional pages (projects, contributors, events, etc.) to React compositions, retaining Astro routes for data-loading and head.
  - Verify Pagefind/search remains unaffected.

Phase 4 — Dynamic routes (Status: not started)
- Plan:
  - Keep `.astro` dynamic routes (e.g., `[...slug].astro`) as thin wrappers to load content via `astro:content`.
  - Render React detail components with passed props.
  - Replace any `.astro`-only widgets within details with React variants.

Phase 5 — Cleanup and stabilization (Status: not started)
- Plan:
  - Remove deprecated `.astro` components after React parity is verified site-wide.
  - Ensure all pages standardize on `SiteLayout` + `SiteShell`.
  - Rebaseline performance metrics and update onboarding docs.

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

- Create `SiteLayout.tsx` and `SiteShell.astro`; keep SSR-only by default and hydrate background only.
- Convert: `Header.astro`, `Footer.astro`, and the remaining shared `.astro` wrappers (cards, chips, detail layout) to React as each page migrates.
- Migrate `index.astro`/homepage route to render React sections within `SiteShell`.
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
  - Introduce `SiteLayout.tsx` and `SiteShell.astro`. Keep `Base.astro` temporarily until parity is verified.
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

## Astro component audit (2025-11-13)

Legacy `.astro` wrappers that no longer had importers have been deleted in this pass (`Hero.astro`, `Section.astro`, `GlyphField.astro`, `CallToActionButton.astro`, `ItemCard.astro`, `FeatureCard.astro`, `LinkCard.astro`, `Search.astro`, `ThemeToggle.astro`, `Timeline.astro`, `LinkButton.astro`, `TagsList.astro`, `PricingInfo.astro`, `BackgroundParallaxHexIsland.astro`). The list below tracks the remaining files under `src/components/**/*.astro`, their current usage, and what needs to happen before they can be removed.

| Component(s) | Current usage | Removal path |
| --- | --- | --- |
| `BaseHead.astro` | Head meta helper for every route | Keep until we decide on a React head strategy or confirm Astro head stays indefinitely. |
| `layout/Header.astro`, `layout/Footer.astro`, `SkipLink.astro`, `theme/ThemeProvider.astro` | Injected into every route via `SiteShell` slots | Replace once the global header/footer/theme logic moves to React (can happen before slug work). |
| `sections/SubsectionGrid.astro`, `cards/PersonCard.astro`, `cards/PersonListElement.astro`, `cards/PartnerCard.astro` | Only used by `src/pages/contributors.astro` | Remove after the Contributors page is rewritten as a React composition. |
| `cards/HardwareCard.astro`, `cards/SoftwareCard.astro`, `cards/ResearchCard.astro`, `cards/EventCard.astro` | Feed data from `astro:content` into React cards on `projects.astro` + slug detail pages | Replace with server utilities (e.g., `src/data/*`) and hydrate React cards directly once projects + slug routes migrate. |
| `ui/BasicChip.astro`, `ui/OrganizationChip.astro` | Metadata chips rendered inside slug detail pages | Convert to React and load data via the slug’s React detail component once those routes migrate. |
| `detail/BaseDetailLayout.astro`, `detail/ContentSection.astro`, `detail/InfoCard.astro`, `detail/ChipsList.astro`, `detail/FeaturesList.astro`, `detail/SpecificationsList.astro` | Core scaffolding for `[...slug].astro` detail pages | Replace with React detail shells/components when Phase 4 (dynamic routes) lands. |
| `people/PersonPopoverWrapper.astro` | Hover/focus popovers for people lists within slug detail pages | Convert when the related detail views move to React; depends on the same Phase 4 work. |

All of the components above (except `BaseHead` and the layout shell pieces) can disappear immediately after slug migrations because the React counterparts already exist or have clear design targets. Track deletions per route to keep diffs reviewable.
