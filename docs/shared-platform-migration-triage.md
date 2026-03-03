# Shared Platform Migration Triage

## Scope and Goal

This document tracks migration from three siloed site repos to a shared multi-site architecture with:

- Shared UI/layout and data-loading logic.
- Shared content schema/tooling.
- Centralized content source with per-site visibility.
- Thin site repos that hold site branding, site config, and custom feature surfaces.

Target sites in current scope:

- `semio-community.github.io`
- `quori-robot.github.io`
- `vizij-ai.github.io`

New shared repos scaffolded in `~/Projects`:

- `/Users/schoen/Projects/ecosystem-site-core`
- `/Users/schoen/Projects/ecosystem-content-schema`
- `/Users/schoen/Projects/ecosystem-content-hub`

Working branch for this plan and migration start:

- `semio-community.github.io` branch: `migration/shared-platform-extraction`

## Non-Goals (Current Phase)

- Final CMS migration decision (Decap vs Pages CMS vs other).
- Full redesign of site visual identity.
- Major URL architecture changes.

## Constraints and Assumptions

- Sites remain separate GitHub repos and deploy independently.
- `quori-robot.github.io` and `vizij-ai.github.io` may need cross-org access to shared repos.
- Build stack remains Astro + React + Tailwind.
- Initial migration should preserve output behavior and URLs.
- Existing GitHub Pages model remains: each site repo builds itself and deploys from its own Actions workflow.

## Target Architecture

### Repositories

1. `ecosystem-site-core`
- Shared components, layouts, route helpers, OG components, plugins, and reusable data utilities.
- Exports consumed by each site repo.

2. `ecosystem-content-schema`
- Canonical content collection schemas and schema-derived tooling contracts.
- Hosts config generation logic used by site-local CMS adapter layer.

3. `ecosystem-content-hub`
- Canonical MD/MDX content and media metadata.
- Per-entry site visibility fields (for example `sites: ["semio", "quori"]`).

4. Site repos (`semio-community`, `quori-robot`, `vizij-ai`)
- Keep brand assets, `site.config.ts`, menu config, and site-specific pages/features.
- Consume shared repos as dependencies.

### Runtime Model

- Site repo passes `siteKey` (`semio`, `quori`, `vizij`) to shared content loader.
- Shared loader returns only entries visible to that `siteKey`.
- Shared UI uses site-level config tokens for branding and navigation differences.

### Sync and Build Strategy

- Shared logic and schema are consumed as versioned dependencies, not submodules.
- `ecosystem-site-core` and `ecosystem-content-schema` are published to GitHub Packages under the `@semio-community` scope.
- Site repos receive dependency update PRs (scheduled or dispatch-triggered); merge triggers existing Pages builds.
- `ecosystem-content-hub` is the content source-of-truth and is synced into site repos through automated PR workflows (or later as versioned snapshots).
- Deterministic builds are required; deploy and preview workflows should both use lockfile-based installs (`npm ci`).

### Site Repo Boundaries (What Stays Local)

Expected to remain in each site repo:

- Site identity and branding (`src/site.config.ts`, logos/icons, brand images, theme token overrides).
- Site-specific route composition and enabled sections (for example Quori `platform` pages and Vizij `demos/showcase` pages).
- Site-only components that do not generalize cleanly.
- Deployment and environment wiring (`.github/workflows`, `CNAME`, platform-specific redirects/config).
- Minimal adapter layer that connects shared packages to local routes/layout wrappers.

Expected to move out to shared repos:

- Most reusable React components and UI elements across sites (target: majority of `src/components` and common `src/react-pages` shells).
- Shared UI primitives and cross-site component systems.
- Shared layouts and OG rendering modules.
- Shared data/query helpers and schema contracts.
- Duplicated generation scripts and content validation utilities.

## Workstreams

### WS1 - Platform Extraction (`ecosystem-site-core`)

Deliverables:
- Shared package scaffold with build/test and typed exports.
- Initial extraction set:
  - `src/components` shared subset
  - `src/layouts` shared subset
  - `src/og` shared subset
  - `src/plugins` shared subset
- Majority of shared React components and UI surfaces moved into `ecosystem-site-core` with site extension points for local-only features.
- Site repos consuming package with minimal local shims.

Exit criteria:
- `semio-community` builds with shared package for selected modules.
- `vizij-ai` and `quori-robot` compile against same package version.

### WS2 - Schema and Tooling Consolidation (`ecosystem-content-schema`)

Deliverables:
- Canonical `content.config` model exported as reusable module/helpers.
- Consolidated CMS config generator logic migrated from duplicated scripts.
- Shared validation utilities for content checks.

Exit criteria:
- All site repos import schema/tooling from one package.
- No schema drift between sites.

### WS3 - Central Content Hub (`ecosystem-content-hub`)

Deliverables:
- Unified folder structure for collections and media references.
- Site visibility fields added and documented.
- Content import plan from each site with conflict handling rules.

Exit criteria:
- Content source-of-truth lives in one repo.
- Site builds can consume filtered content without local content copies for migrated collections.

### WS4 - Site Integration

Deliverables:
- Each site wired to shared packages and shared content source.
- Site-specific features preserved:
  - Quori platform/configurator pages.
  - Vizij demos/showcase pages.

Exit criteria:
- Each site builds and deploy previews pass.
- Route compatibility and key page regressions cleared.

### WS5 - Operationalization

Deliverables:
- Versioning and release policy for shared repos.
- Cross-repo CI smoke tests.
- Contributor docs for adding new sites.
- Automated dependency/content sync workflows across site repos.

Exit criteria:
- Shared release process documented and repeatable.
- Fourth-site onboarding path documented and tested.
- Site repos automatically receive update PRs when shared packages/content change.

## Triage Backlog

Status values: `todo`, `in_progress`, `blocked`, `done`.

| ID | Workstream | Status | Task | Dependencies | Acceptance Check |
|---|---|---|---|---|---|
| T001 | WS1 | done | Create package skeleton in `ecosystem-site-core` (exports, TS config, build) | none | Package imports in semio site compile |
| T002 | WS1 | in_progress | Extract shared `src/components/navigation` and `src/components/layout` | T001 | Header/navigation renders on all sites |
| T003 | WS1 | todo | Extract shared OG renderer/components | T001 | OG endpoints compile and render |
| T004 | WS1 | in_progress | Extract shared plugins and utility modules | T001 | Astro build passes with plugin imports |
| T005 | WS2 | in_progress | Move canonical schema contracts into `ecosystem-content-schema` | none | All 3 sites consume same schema package version |
| T006 | WS2 | done | Move CMS config generation logic to `ecosystem-content-schema` | T005 | Generated output matches current config for baseline site |
| T007 | WS3 | done | Define site-visibility field contract and docs | none | Contract approved and committed |
| T008 | WS3 | done | Import organizations collection into `ecosystem-content-hub` with visibility metadata | T007 | All sites resolve organizations from hub |
| T009 | WS3 | done | Import people/events/software/hardware/research collections | T008 | Filtered content parity checks pass |
| T010 | WS4 | done | Wire semio site to shared packages + content hub | T002,T006,T008 | `npm run build` passes |
| T011 | WS4 | done | Wire vizij site to shared packages + content hub | T010 | `npm run build` passes |
| T012 | WS4 | done | Wire quori site to shared packages + content hub | T010 | `npm run build` passes and platform pages still work |
| T013 | WS5 | in_progress | Define semver and release workflow for shared repos | T010 | Release checklist merged |
| T014 | WS5 | in_progress | Add cross-repo smoke CI matrix | T013 | CI green on sample PR |
| T015 | WS5 | todo | Write "add a new site" playbook | T010,T013 | Dry-run with template repo succeeds |
| T016 | WS5 | done | Publish `@semio-community/ecosystem-site-core` and `@semio-community/ecosystem-content-schema` to GitHub Packages | T013 | Tagged release is installable from all 3 site repos |
| T017 | WS5 | todo | Add site-repo Actions to open automated dependency bump PRs for shared packages | T016 | Bump PR auto-opens after package release |
| T018 | WS5 | in_progress | Add content-hub sync workflow that opens site PRs on content changes | T009 | Site repo receives content sync PR with parity checks |
| T019 | WS5 | in_progress | Standardize install strategy to lockfile-based CI (`npm ci`) for deploy and preview | T014 | Deploy and preview workflows are deterministic |
| T020 | WS3 | done | Define per-entry visibility and override contract (`sites`, optional per-site patch fields) | T007 | Contract documented with examples and validation rules |
| T021 | WS1 | in_progress | Move shared detail/header utility styles into `ecosystem-site-core` exported stylesheet and remove site-local fallback utility patches | T004 | Site repos no longer require `@source` scanning of `node_modules` for shared detail component classes |
| T022 | WS1 | in_progress | Track shared-vs-site-specific component inventory across semio/quori/vizij | T002 | Inventory table exists and is updated each extraction cycle |
| T023 | WS1 | in_progress | Extract shared navigation/layout runtime components (`Header`, `Footer`, `NavigationMenu`, `MobileNavigation`) into `ecosystem-site-core` | T002,T022 | All three sites import shared navigation/layout components |
| T024 | WS1 | todo | Extract shared UI/card/search/section components to `ecosystem-site-core` | T023 | Shared components consumed from package; local copies removed |
| T025 | WS1 | todo | Extract shared page-shell React surfaces (`Home`, `Events`, `Projects`, `Contributors`, `Services`, `GetInvolved`) with slot/config APIs | T024 | Shared page-shell package APIs render on all three sites |
| T026 | WS1 | todo | Document and enforce site-local exception list for non-generalizable components | T022 | Exception list committed and referenced by extraction PRs |

## WS1 Component Inventory (Shared UI Generalization)

Goal:
- Default to moving reusable React components and UI elements into `ecosystem-site-core`; keep only truly site-specific components in site repos.

Already centralized in `ecosystem-site-core`:
- Detail primitives and shared detail layout pieces (`BaseDetailLayout`, `DetailHero`, `ContentSection`, `InfoCard`, `FeaturesList`, `ChipsList`, `SpecificationsList`, `LinkSection`).
- Shared helper/contracts modules (navigation, layout, drafts, date/event utilities, URL/images helpers, route mapping).
- Shared style entry (`styles.css` + `styles/base.css`) used by migrated detail surfaces.

Shared-eligible components still local (to be moved):

| Area | Current Local Paths | Target | Status |
|---|---|---|---|
| Navigation + layout runtime | `src/components/layout/*`, `src/components/navigation/*` in semio/quori/vizij | `ecosystem-site-core` with site config/slot APIs | in_progress |
| Core cards + list elements | `src/components/cards/*` in semio/quori/vizij | `ecosystem-site-core` shared card package | todo |
| Shared UI primitives | `src/components/ui/{IconButton,Avatar,Tooltip,BasicChip,OrganizationChip,CallToActionButton,FeaturedStar,Icon}.tsx` across sites | `ecosystem-site-core` UI primitives | todo |
| Search surfaces | `src/components/search/*` across sites | `ecosystem-site-core` search module | todo |
| Shared section blocks | `src/components/sections/*` + common `react-pages/home/sections/*` patterns | `ecosystem-site-core` section/layout module | todo |
| Shared page shells | `src/react-pages/{home,events,projects,contributors,services,get-involved,about}` across sites | `ecosystem-site-core` page-shell APIs | todo |
| Background + hero patterns | `src/components/background/ParallaxHexBackground.tsx`, `src/components/hero/HeroHeader.tsx` across sites | `ecosystem-site-core` visual foundations | todo |

Explicit site-local exceptions (stay local unless reused by >=2 sites):
- Quori-only product/platform surfaces: `quori-robot.github.io/src/react-pages/platform/**`, `quori-robot.github.io/src/components/ui/configurator3d/**`, and related 3D model/configurator modules.
- Vizij-only showcase/demo runtime surfaces: `vizij-ai.github.io/src/react-pages/showcase/**`, `vizij-ai.github.io/src/components/demos/**`, and vizij runtime orchestration adapters.
- Any future site-specific feature with hard domain coupling and no multi-site reuse requirement.

## Progress Snapshot

Completed since migration kickoff:

- Created working package skeleton in `ecosystem-site-core` with typed exports, build/check scripts, and publish config.
- Created working package skeleton in `ecosystem-content-schema` with initial shared site-visibility contracts and validation helpers.
- Created initial structure in `ecosystem-content-hub` including draft visibility contract and sync model docs.

Current active focus:

- Continue WS1 component generalization in `ecosystem-site-core` with explicit inventory-driven extraction (T022-T026).
- Keep migration branches aligned with `main` hotfixes while preserving shared-package migration progress.
- Continue WS5 operationalization: release/version governance, cross-repo smoke CI parity, and automated update PR flows.

Latest integration notes:

- Introduced shared navigation/layout contracts in `ecosystem-site-core` and exported them from the package entrypoint.
- Updated `semio-community` to consume shared navigation types from `@semio-community/ecosystem-site-core` in `src/site.config.ts`.
- Added local workspace dependency wiring in `semio-community` (`file:../ecosystem-site-core`) to validate package-consumption flow before publishing.
- Verified `semio-community` static build succeeds after the contract extraction/wiring changes.
- Extracted reusable navigation runtime helpers into `ecosystem-site-core` (`nav-style` + active-header path resolution) and switched `semio-community` navigation to consume those shared implementations.
- Extracted reusable navigation menu section helpers (`getLinkSections`, `getFeaturedSections`, `getFieldValue`) into `ecosystem-site-core` and switched `NavigationMenu` to consume shared helpers and shared `MenuLink` typing.
- Updated `quori-robot` and `vizij-ai` navigation surfaces (`NavigationMenu`, `navVariant`, `navIcons`) to consume shared `ecosystem-site-core` contracts/helpers (`MenuLink` + active-header helpers + nav-style resolution + route-key icon mapping), reducing duplicated navigation logic ahead of full runtime component extraction.
- Extracted shared navigation runtime components into `ecosystem-site-core` (`NavigationMenu`, `MobileNavigation`, `NavIconButton`) plus shared navigation-menu stylesheet export; pending next package release and site-repo integration pass.
- Extracted reusable `SiteLayout` class-composition helpers into `ecosystem-site-core` and switched `semio-community` `SiteLayout` to consume shared layout helper functions.
- Extracted shared route-key mapping helper (`mapSlugKeysToRouteKeys`) into `ecosystem-site-core` and switched `semio-community` `navIcons` to consume it.
- Extracted base URL helper utilities (`resolveBaseUrl`, `isExternalUrl`) into `ecosystem-site-core` and switched `semio-community` `src/utils/url.ts` to consume them.
- Extracted shared draft-visibility helpers into `ecosystem-site-core` and switched `semio-community` `src/utils/drafts.ts` to consume them through a local adapter.
- Extracted shared date/event primitives (`parseDateLocal`, `getLocationString`, event preview composition helper) into `ecosystem-site-core` and switched `semio-community` date/event utility modules to consume them.
- Extracted shared image utility primitives (`resolveImagePolicy`, image path normalization/resolution, card/detail image-policy resolvers) into `ecosystem-site-core` and switched `semio-community` `src/utils/images.ts` to a thin adapter preserving Astro `ImageMetadata` typing.
- Expanded `ecosystem-content-schema` site-visibility contracts (`SITE_KEYS`, `SiteScopedEntry`, override validation, merge helper) and aligned `ecosystem-content-hub` visibility/sync docs to the shared contract.
- Wired `semio-community` content schema to consume `@semio-community/ecosystem-content-schema` (`SITE_KEYS`, visibility/override validators) and added optional `visibility`/`overrides` fields to organizations/software collection schemas.
- Moved the Decap CMS config generator implementation into `ecosystem-content-schema` and converted `semio-community` `scripts/generate-decap-config.mjs` into a thin wrapper that calls the shared generator.
- Updated `quori-robot.github.io` and `vizij-ai.github.io` Decap generator scripts to the same thin-wrapper pattern against `@semio-community/ecosystem-content-schema`.
- Added local workspace dependency wiring to both `quori-robot.github.io` and `vizij-ai.github.io` (`file:../ecosystem-content-schema`) and validated `npm run cms:config` + `npm run build:site` in both repos.
- Started WS3 organizations migration scaffold in `ecosystem-content-hub` with `content/organizations/` plus initial `orbbec.mdx` entry carrying `sites` and `overrides` metadata.
- Performed first bulk organizations import into `ecosystem-content-hub/content/organizations` from current site repos with computed per-entry `sites` visibility metadata.
- Added `semio-community` content-hub sync adapter script (`scripts/sync-content-hub-organizations.mjs`) to pull `semio`-visible organizations from `ecosystem-content-hub` and apply sparse `overrides.semio` patches into site-local content files as a migration bridge.
- Standardized site/domain inclusion across all three site repos using first-class `sites` frontmatter in all collections (separate from `draft`) and updated collection filtering to enforce `siteKey` visibility consistently.
- Imported unified events collection into `ecosystem-content-hub/content/events` (45 entries with computed `sites` visibility from semio/quori/vizij presence).
- Added `semio-community` events sync adapter (`scripts/sync-content-hub-events.mjs`) and wired package scripts to pull only `semio`-visible events from the hub while pruning non-visible local copies.
- Imported remaining shared collections into `ecosystem-content-hub` with computed `sites` visibility (`people` 25, `software` 3, `hardware` 6, `research` 11).
- Added semio sync bridge for remaining collections (`scripts/sync-content-hub-collections.mjs`) and package scripts to sync/prune `people`, `software`, `hardware`, and `research` from the hub.
- Verified semio build parity after organizations/events + remaining collection sync bridges (`npm run build:site` passes on migration branch).
- Added hub sync bridge script to `vizij-ai.github.io` and `quori-robot.github.io` (`scripts/sync-content-hub.mjs`) to sync/prune all migrated collections (`organizations`, `events`, `people`, `software`, `hardware`, `research`) from `ecosystem-content-hub`.
- Added `content:sync:hub` npm script in vizij/quori and validated with `npm run content:sync:hub` + `npm run build:site` in both repos.
- Added initial smoke CI workflows in all three site repos (`.github/workflows/smoke.yml`) to run install + CMS config generation + site build checks on PRs/pushes.
- Extended site smoke CI workflows with manual branch-safe hub-sync testing controls (`enable_hub_sync`, `hub_repo`, `hub_ref`, optional dirty-tree check) so migration can be validated on branches before cutover.
- Added `ecosystem-content-hub` fanout workflow (`.github/workflows/sync-site-prs.yml`) with dry-run default and branch-targeted PR mode for semio/quori/vizij sync validation.
- Temporary bridge for extracted detail components: semio branch adds Tailwind `@source` scans for `@semio-community/ecosystem-site-core` and local fallback utilities to prevent missing hero/link styles during migration; replace with shared exported stylesheet in T021.
- Started T021 implementation: added shared style artifact in `ecosystem-site-core` (`styles/base.css` via package `styles.css`) and switched semio global CSS to import shared package styles while removing local `node_modules` Tailwind scan/fallback utility block.
- Began moving detail/header/link styling to semantic shared classes in `ecosystem-site-core` (theme-variable-driven CSS layer + component class hooks) to avoid utility-class drift during future extractions.
- Bumped migration branches to `@semio-community/ecosystem-site-core@0.3.4` (semio site) and `@semio-community/ecosystem-content-schema@0.3.2` (all three sites); refreshed package-locks after install.
- Added CI/package-access hotfix branches for non-migration stability (`deploy-preview` / deploy / smoke) so unrelated PRs can continue while migration remains in flight.
- Added Vizij content visibility hotfix to keep only `hri-2026-tutorial` visible on event routes in production-facing branches.
- Added WS1 component inventory with explicit shared-eligible component buckets and documented site-local exception boundaries (Quori configurator, Vizij showcase/demo runtime).

## Sequencing Plan

Phase 0 - Setup
- Branching and repo scaffolds.
- Confirm maintainers, permissions, and package publishing path.

Phase 1 - Extract shared platform code
- Prioritize high-identity low-risk modules (navigation, layout, OG, shared UI primitives).
- Keep temporary compatibility wrappers in site repos.

Phase 2 - Consolidate schema and generators
- Move content schema and generation scripts to one package.
- Enforce schema parity via CI check.

Phase 3 - Centralize content
- Start with organizations and people, then events/software/hardware/research.
- Introduce visibility filters and parity reports.

Phase 4 - Integrate site-by-site
- Semio first, then Vizij, then Quori.
- Preserve custom routes/features in local repos.

Phase 5 - Stabilize and scale
- CI hardening, release process, onboarding docs.
- Automated release-to-consumption sync via npm + update PR workflows.

## Content Customization Model

Core principle:
- Content is authored once in `ecosystem-content-hub` and filtered/overridden per site.

Entry-level visibility:
- Each content entry includes a visibility field, for example `sites: ["semio", "quori"]`.
- Entries without the current `siteKey` are excluded at load time.

Site-specific content adaptation:
- Keep global content body and metadata canonical in hub.
- Add optional per-site override object only for fields that must diverge (for example title variant, short description, featured flag, sort order, call-to-action link).
- Avoid full per-site content forks unless the narrative is genuinely different.

Recommended override shape (illustrative):
- `overrides.semio`, `overrides.quori`, `overrides.vizij` with sparse field patches.
- Validation ensures override keys are known site keys and patched fields are schema-valid.

How teams customize individual sites after migration:

1. Global update for all sites:
- Edit canonical entry in `ecosystem-content-hub`.
- Sync workflow opens PRs in site repos; merged PR rebuilds/deploys that site.

2. Site-limited visibility:
- Add/remove site key in entry visibility list.
- Entry appears/disappears for that site on next sync/deploy.

3. Site-specific variant:
- Add sparse override patch for that site key.
- Shared loader resolves `base entry + site override` at build time.

## Site-Specific Feature Extensions

Goal:
- Keep high-customization features (for example Quori robot configurator) inside the owning site repo while still using shared platform code.

Ownership model:
- Shared packages define extension contracts/interfaces and optional render slots.
- Site repos provide concrete implementations and route wiring.
- Quori-only components remain in `quori-robot.github.io` and are not moved to shared packages unless they become reusable.

Configuration model:
- Each site defines local feature flags and extension bindings in site-local config.
- Shared route/page composition checks flags and renders extension slots only when enabled.
- Site-local routes can directly import local React components when the feature is fully site-owned.

Example use case:
- `quori-robot.github.io` keeps configurator components/pages local.
- Quori enables `platformConfigurator` flag.
- Semio/Vizij keep the flag disabled and do not ship that route/UI path.

## Astro + React Hydration Guardrails

Hydration policy:
- Prefer static Astro rendering by default; hydrate React only where interactivity is required.
- Use `client:load`, `client:idle`, `client:visible`, and `client:media` intentionally per interaction need.
- Avoid blanket `client:only` except where SSR is impossible.

JS footprint controls:
- Keep heavy interactive islands route-scoped so non-interactive pages ship minimal JS.
- Do not import large interactive components into global/shared layout paths.
- Lazy-load heavy client components when possible.

Island boundary rules:
- Shared components should remain SSR-safe by default.
- Site-specific interactive extensions should be isolated behind explicit island boundaries.
- Avoid hidden coupling where a shared parent component accidentally forces hydration of large subtrees.

Styling and asset rules for hydrated islands:
- Ensure CSS required by client-only islands is included in production bundles.
- Prefer importing island styles from an SSR-reachable path (page/layout/shared stylesheet) when Astro tree-shaking may omit client-only-only imports.

Verification requirements:
- Add hydration checks to CI smoke tests for interactive routes (for example Quori `platform` page).
- Validate both no-JS fallback behavior (where applicable) and hydrated behavior.
- Track JS bundle changes per site for regressions during extraction.

## Risks and Mitigations

1. Cross-org dependency access and publishing friction.
- Mitigation: lock npm package scope and publish workflow early, then test install/auth flows in CI before migration work.

2. Content merge conflicts and duplicate IDs during hub import.
- Mitigation: define ID ownership rules and automated duplicate checks before import.

3. Unintended visual regressions from shared component extraction.
- Mitigation: snapshot key pages per site and compare before/after.

4. Quori and Vizij custom surfaces blocked by over-generalized abstractions.
- Mitigation: preserve extension points and keep custom areas local by design.

5. CMS mismatch with new architecture.
- Mitigation: keep CMS choice decoupled; content hub contract should remain CMS-agnostic.

6. Tailwind class drift when shared component classes are not visible to site-local scanning.
- Mitigation: publish shared component styles from `ecosystem-site-core` and import them explicitly in site roots; treat `node_modules` scan/fallback utility patches as temporary migration-only bridge.

## Decision Log

| Date | Decision | Rationale | Owner |
|---|---|---|---|
| 2026-02-19 | Create three shared repos (`ecosystem-site-core`, `ecosystem-content-schema`, `ecosystem-content-hub`) | Separate code reuse, schema governance, and content ownership concerns | team |
| 2026-02-19 | Start migration branch from `semio-community` | Use semio as lead integration path before propagating to quori/vizij | team |
| 2026-02-20 | Use npm package distribution for shared code/schema under `@semio-community` scope (`@semio-community/ecosystem-site-core`, `@semio-community/ecosystem-content-schema`) | Enables versioned dependency updates and Actions-driven synchronization across orgs with stable package naming | team |
| 2026-02-20 | Keep high-customization site features local (for example Quori configurator) | Preserves site autonomy while shared core handles reusable concerns | team |
| 2026-02-25 | Adopt descriptive shared package names under `@semio-community` (`ecosystem-site-core`, `ecosystem-content-schema`) | Avoids generic naming collisions and keeps room for future product/site package families | team |
| 2026-02-26 | Standardize a shared `renderMarkdown` content flag across all collections in shared schema | Supports per-entry body rendering behavior by site/page without collection-specific schema drift | team |
| 2026-02-26 | Start UI extraction by moving base detail primitives into `ecosystem-site-core` and wiring semio as the first consumer | Establishes the shared detail-page foundation before broader nav/button/component extraction | team |
| 2026-02-26 | Keep `ecosystem-site-core` and `ecosystem-content-schema` on aligned release versions | Simplifies dependency management, rollout coordination, and cross-repo CI expectations | team |
| 2026-03-02 | Default component strategy: move most reusable React/UI surfaces to `ecosystem-site-core`, keep only explicit site-local exceptions in site repos | Reduces long-term duplication and maintenance load across semio/quori/vizij while preserving product-specific feature autonomy | team |

## Immediate Next Actions

1. Push and reconcile migration branches (semio/quori/vizij) with latest `main` hotfix commits, then re-run smoke CI on each migration PR.
2. Finish T021 by removing remaining site-local detail fallback style patches once shared stylesheet coverage is confirmed on all sites.
3. Execute T023 and T024 (navigation/layout runtime + shared UI/card/search/section extraction) using the WS1 inventory as the source of truth.
4. Execute T025 (shared page-shell APIs) and T026 (site-local exception contract) so new features default to `ecosystem-site-core`.
5. Complete WS5 follow-through: dependency bump automation (T017) and deterministic CI/deploy parity closure (T019).
