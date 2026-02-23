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

- `/Users/schoen/Projects/semio-site-core`
- `/Users/schoen/Projects/semio-content-schema`
- `/Users/schoen/Projects/semio-content-hub`

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

1. `semio-site-core`
- Shared components, layouts, route helpers, OG components, plugins, and reusable data utilities.
- Exports consumed by each site repo.

2. `semio-content-schema`
- Canonical content collection schemas and schema-derived tooling contracts.
- Hosts config generation logic used by site-local CMS adapter layer.

3. `semio-content-hub`
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
- `semio-site-core` and `semio-content-schema` are published to GitHub Packages (npm).
- Site repos receive dependency update PRs (scheduled or dispatch-triggered); merge triggers existing Pages builds.
- `semio-content-hub` is the content source-of-truth and is synced into site repos through automated PR workflows (or later as versioned snapshots).
- Deterministic builds are required; deploy and preview workflows should both use lockfile-based installs (`npm ci`).

### Site Repo Boundaries (What Stays Local)

Expected to remain in each site repo:

- Site identity and branding (`src/site.config.ts`, logos/icons, brand images, theme token overrides).
- Site-specific route composition and enabled sections (for example Quori `platform` pages and Vizij `demos/showcase` pages).
- Site-only components that do not generalize cleanly.
- Deployment and environment wiring (`.github/workflows`, `CNAME`, platform-specific redirects/config).
- Minimal adapter layer that connects shared packages to local routes/layout wrappers.

Expected to move out to shared repos:

- Shared UI primitives and cross-site component systems.
- Shared layouts and OG rendering modules.
- Shared data/query helpers and schema contracts.
- Duplicated generation scripts and content validation utilities.

## Workstreams

### WS1 - Platform Extraction (`semio-site-core`)

Deliverables:
- Shared package scaffold with build/test and typed exports.
- Initial extraction set:
  - `src/components` shared subset
  - `src/layouts` shared subset
  - `src/og` shared subset
  - `src/plugins` shared subset
- Site repos consuming package with minimal local shims.

Exit criteria:
- `semio-community` builds with shared package for selected modules.
- `vizij-ai` and `quori-robot` compile against same package version.

### WS2 - Schema and Tooling Consolidation (`semio-content-schema`)

Deliverables:
- Canonical `content.config` model exported as reusable module/helpers.
- Consolidated CMS config generator logic migrated from duplicated scripts.
- Shared validation utilities for content checks.

Exit criteria:
- All site repos import schema/tooling from one package.
- No schema drift between sites.

### WS3 - Central Content Hub (`semio-content-hub`)

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
| T001 | WS1 | done | Create package skeleton in `semio-site-core` (exports, TS config, build) | none | Package imports in semio site compile |
| T002 | WS1 | in_progress | Extract shared `src/components/navigation` and `src/components/layout` | T001 | Header/navigation renders on all sites |
| T003 | WS1 | todo | Extract shared OG renderer/components | T001 | OG endpoints compile and render |
| T004 | WS1 | todo | Extract shared plugins and utility modules | T001 | Astro build passes with plugin imports |
| T005 | WS2 | in_progress | Move canonical schema contracts into `semio-content-schema` | none | All 3 sites consume same schema package version |
| T006 | WS2 | todo | Move CMS config generation logic to `semio-content-schema` | T005 | Generated output matches current config for baseline site |
| T007 | WS3 | in_progress | Define site-visibility field contract and docs | none | Contract approved and committed |
| T008 | WS3 | todo | Import organizations collection into `semio-content-hub` with visibility metadata | T007 | All sites resolve organizations from hub |
| T009 | WS3 | todo | Import people/events/software/hardware/research collections | T008 | Filtered content parity checks pass |
| T010 | WS4 | todo | Wire semio site to shared packages + content hub | T002,T006,T008 | `npm run build` passes |
| T011 | WS4 | todo | Wire vizij site to shared packages + content hub | T010 | `npm run build` passes |
| T012 | WS4 | todo | Wire quori site to shared packages + content hub | T010 | `npm run build` passes and platform pages still work |
| T013 | WS5 | todo | Define semver and release workflow for shared repos | T010 | Release checklist merged |
| T014 | WS5 | todo | Add cross-repo smoke CI matrix | T013 | CI green on sample PR |
| T015 | WS5 | todo | Write "add a new site" playbook | T010,T013 | Dry-run with template repo succeeds |
| T016 | WS5 | todo | Publish `semio-site-core` and `semio-content-schema` to GitHub Packages | T013 | Tagged release is installable from all 3 site repos |
| T017 | WS5 | todo | Add site-repo Actions to open automated dependency bump PRs for shared packages | T016 | Bump PR auto-opens after package release |
| T018 | WS5 | todo | Add content-hub sync workflow that opens site PRs on content changes | T009 | Site repo receives content sync PR with parity checks |
| T019 | WS5 | todo | Standardize install strategy to lockfile-based CI (`npm ci`) for deploy and preview | T014 | Deploy and preview workflows are deterministic |
| T020 | WS3 | in_progress | Define per-entry visibility and override contract (`sites`, optional per-site patch fields) | T007 | Contract documented with examples and validation rules |

## Progress Snapshot

Completed since migration kickoff:

- Created working package skeleton in `semio-site-core` with typed exports, build/check scripts, and GitHub Packages publish config.
- Created working package skeleton in `semio-content-schema` with initial shared site-visibility contracts and validation helpers.
- Created initial structure in `semio-content-hub` including draft visibility contract and sync model docs.

Current active focus:

- Begin extracting the first shared module slice (`navigation` and `layout`) into `semio-site-core`.
- Replace duplicated schema entry points in site repos with `semio-content-schema` imports.

Latest integration notes:

- Introduced shared navigation/layout contracts in `semio-site-core` and exported them from the package entrypoint.
- Updated `semio-community` to consume shared navigation types from `@semio-community/site-core` in `src/site.config.ts`.
- Added local workspace dependency wiring in `semio-community` (`file:../semio-site-core`) to validate package-consumption flow before publishing.
- Verified `semio-community` static build succeeds after the contract extraction/wiring changes.
- Extracted reusable navigation runtime helpers into `semio-site-core` (`nav-style` + active-header path resolution) and switched `semio-community` navigation to consume those shared implementations.
- Extracted reusable navigation menu section helpers (`getLinkSections`, `getFeaturedSections`, `getFieldValue`) into `semio-site-core` and switched `NavigationMenu` to consume shared helpers and shared `MenuLink` typing.

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
- Automated release-to-consumption sync via GitHub Packages + update PR workflows.

## Content Customization Model

Core principle:
- Content is authored once in `semio-content-hub` and filtered/overridden per site.

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
- Edit canonical entry in `semio-content-hub`.
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
- Mitigation: choose package distribution model early (GitHub Packages vs direct git refs), test auth in CI before migration work.

2. Content merge conflicts and duplicate IDs during hub import.
- Mitigation: define ID ownership rules and automated duplicate checks before import.

3. Unintended visual regressions from shared component extraction.
- Mitigation: snapshot key pages per site and compare before/after.

4. Quori and Vizij custom surfaces blocked by over-generalized abstractions.
- Mitigation: preserve extension points and keep custom areas local by design.

5. CMS mismatch with new architecture.
- Mitigation: keep CMS choice decoupled; content hub contract should remain CMS-agnostic.

## Decision Log

| Date | Decision | Rationale | Owner |
|---|---|---|---|
| 2026-02-19 | Create three shared repos (`semio-site-core`, `semio-content-schema`, `semio-content-hub`) | Separate code reuse, schema governance, and content ownership concerns | team |
| 2026-02-19 | Start migration branch from `semio-community` | Use semio as lead integration path before propagating to quori/vizij | team |
| 2026-02-20 | Use GitHub Packages for shared code/schema distribution (`site-core`, `content-schema`) | Enables versioned dependency updates and Actions-driven synchronization across orgs | team |
| 2026-02-20 | Keep high-customization site features local (for example Quori configurator) | Preserves site autonomy while shared core handles reusable concerns | team |

## Immediate Next Actions

1. Confirm repository names and whether any should be merged.
2. Confirm package distribution approach for cross-org consumption.
3. Approve Phase 1 extraction scope (exact module list).
4. Open initial task issues from T001-T020.
