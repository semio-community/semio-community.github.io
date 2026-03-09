# AGENTS.md — Semio Community Website

This file provides guidance for AI coding agents (Claude Code, Copilot, etc.) working in this repository.

## Ecosystem Overview

This repo is one of four interconnected repositories:

| Repo | Role |
|------|------|
| `ecosystem-content-hub` | Canonical content source (MDX files for all sites) |
| `ecosystem-content-schema` | Shared Zod schemas and TypeScript types for content |
| `ecosystem-site-core` | Shared React UI components, layout, and navigation |
| **this repo** | Semio Community website (Astro + React) |

Content flows: `ecosystem-content-hub` → sync → `src/content/` → Astro pages → static site.

## Key Files

| File | Purpose |
|------|---------|
| `src/site.config.ts` | Site metadata, navigation menu, and nav styling variant |
| `src/content.config.ts` | Astro content collections (uses `createEcosystemCollections` from schema package) |
| `src/layouts/SiteShell.astro` | Root Astro layout (html/head/body shell) |
| `src/components/BaseHead.astro` | Meta tags, OG, favicons |
| `src/components/layout/Header.tsx` | Site header with nav and search |
| `src/components/layout/Footer.tsx` | Site footer |
| `src/components/navigation/navIcons.ts` | Maps content-type route keys to icon components |

## Code Patterns

### 1. Thin re-export (most component files)
Site files that simply re-export from the shared package:
```ts
// src/components/sections/Section.tsx
export { PageSection as Section, PageSection as default } from "@semio-community/ecosystem-site-core";
```

### 2. siteConfig wrapper (navigation buttons)
Site files that wrap a shared component and inject site-specific styling from `siteConfig`:
```tsx
// src/components/navigation/NavIconButton.tsx
const navHighlight = getNavHighlightClasses(
  resolveNavHighlightVariant(siteConfig.navigation?.highlightVariant),
);
export const NavIconButton = React.forwardRef(...) => (
  <SharedNavIconButton navHighlight={navHighlight} {...props} />
);
```
Files following this pattern: `NavIconButton.tsx`, `MobileNavButton.tsx`.

### 3. Bound component (from package)
Package components pre-wired with common dependencies, used in `Header.tsx` and `SearchApp.tsx`:
- `BoundNavigationMenu` — desktop nav with `CallToActionButton` pre-wired
- `BoundMobileNavigation` — mobile nav with theme toggle and search support

### 4. Astro page + React island
Astro files (`.astro`) handle SSG data loading. Interactive React components mount as islands with `client:load`:
```astro
---
import { getCollection } from "astro:content";
import HomePage from "@/react-pages/home/HomePage";
const events = await getCollection("events");
---
<HomePage events={events} client:load />
```

## Common Tasks

### Add a new content entry
Content is synced from `ecosystem-content-hub`. To add content:
1. Add the MDX file to the appropriate collection in `ecosystem-content-hub/content/<type>/`
2. Run the site sync workflow, or copy the file directly to `src/content/<type>/`
3. Set `visibility` in the frontmatter to control which sites show the entry

To add directly without the hub sync, place the MDX file in `src/content/<type>/` matching the schema from `@semio-community/ecosystem-content-schema`.

### Add a new page
For a static informational page:
1. Create `src/pages/my-page.astro`
2. Import `SiteShell` layout and any needed React components
3. Add a menu entry to `menuLinks` in `src/site.config.ts` if it needs nav links

For a page with significant React UI:
1. Create `src/react-pages/my-page/MyPage.tsx` with the React component
2. Create `src/react-pages/my-page/sections/` for section components
3. Create `src/pages/my-page.astro` that imports and renders the React component with `client:load`

### Add a new home page section
1. Create `src/react-pages/home/sections/MySection.tsx`
2. Import it in `src/react-pages/home/HomePage.tsx` and add to the render tree

### Add a navigation link
Edit `menuLinks` in `src/site.config.ts`. Each entry:
```ts
{
  path: "/my-page/",
  title: "My Page",
  inHeader: true,             // show in desktop nav
  callToAction: true,         // optional: render as CTA button
  sections: [                  // optional: dropdown sections
    { kind: "link", title: "Section Name", href: "/my-page/#section" },
  ],
}
```

### Add a navigation icon for a content type
Edit `src/components/navigation/navIcons.ts`. Map a route key to a Solar icon component:
```ts
import { SolarIconName } from "@solar-icons/react-perf";
export const navIconMap = mapSlugKeysToRouteKeys({ "my-type": SolarIconName });
```

### Add a new shared component
If the component is site-specific, add it to `src/components/<category>/`.
If it would benefit all three ecosystem sites, add it to `ecosystem-site-core` instead, then re-export it from the local file if needed.

### Update the shared package

When a new version of `@semio-community/ecosystem-site-core` is published:

1. **Wait** for the Build & Publish Package workflow in `ecosystem-site-core` to complete (check Actions — the `vX.Y.Z` tag must be green before proceeding).
2. Run `npm install @semio-community/ecosystem-site-core@^X.Y.Z` — this updates **both** `package.json` and `package-lock.json`.
3. Update any site files that use a changed API.
4. Commit **both** `package.json` and `package-lock.json` together:
   ```
   git add package.json package-lock.json
   git commit -m "chore: bump ecosystem-site-core to vX.Y.Z"
   ```

> **Critical:** never bump the version in `package.json` (e.g. via `sed`) without also running `npm install` to regenerate the lockfile. A mismatched lockfile causes `npm ci` to fail in CI.

## Content Schema

Content collections are defined by `createEcosystemCollections` (from `@semio-community/ecosystem-content-schema`). The available collections are:
- `events` — workshops, symposiums, conferences
- `hardware` — robotics hardware projects
- `software` — software tools and frameworks
- `research` — publications and papers
- `people` — team and community members
- `organizations` — partner and affiliated organizations

Each collection entry is an MDX file in `src/content/<collection>/`. The frontmatter schema is defined in the schema package — check there for required and optional fields.

## Local Development with the Shared Package

To iterate on `ecosystem-site-core` locally while running this site:

### Option A — use the published package (normal workflow)

```bash
npm install
npm run dev
```

### Option B — link the local build for live iteration

In `ecosystem-site-core`, start the TypeScript compiler in watch mode:

```bash
cd ../ecosystem-site-core
npx tsc -p tsconfig.json --watch
```

In a separate terminal, link the package and start the dev server:

```bash
cd semio-community.github.io
npm link @semio-community/ecosystem-site-core
npm run dev
```

When you are done, unlink and restore the published version:

```bash
npm unlink --no-save @semio-community/ecosystem-site-core
npm install
```

> **Why linking is safe:** `astro.config.ts` sets `vite.ssr.noExternal` to include `@semio-community/ecosystem-site-core` and related Radix/motion packages, and `vite.resolve.dedupe: ["react", "react-dom"]`. This forces Vite to bundle the linked package through its own resolver, preventing Node from picking up a nested React copy inside the linked `node_modules` and causing an "Invalid hook call" error.

## Vite / Astro Configuration

`astro.config.ts` must keep the following to avoid duplicate-React errors when the shared package is npm-linked or when its transitive dependencies carry their own React-using packages:

```ts
vite: {
  ssr: {
    noExternal: [
      "@semio-community/ecosystem-site-core",
      /^@radix-ui\/react-/,
      /^react-remove-scroll/,
      /^react-style-singleton/,
      /^react-remove-scroll-bar/,
      /^use-callback-ref/,
      /^use-sidecar/,
      /^motion(\/.*)?$/,
      /^framer-motion(\/.*)?$/,
    ],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
},
```

**`noExternal`** forces Vite to bundle the shared package and its React-using transitive deps through its own resolver rather than letting Node load them natively (which would find a nested React copy first).

**`dedupe`** ensures a single React instance across the client-side bundle.

**Do not use directory-level aliases** (e.g. `resolve.alias` pointing at the package source directory) — that bypasses the package's `exports` map and breaks CJS/ESM interop.

## Troubleshooting

### "Invalid hook call" / useRef is null at runtime

Two copies of React are loaded simultaneously. Checklist:

1. Run `find node_modules -path "*/react/index.js"` — you should see only one entry. A path through `ecosystem-site-core/node_modules/react` means a nested copy is present; delete it with `rm -rf node_modules/@semio-community/ecosystem-site-core/node_modules/react`.
2. Confirm `astro.config.ts` has both `vite.ssr.noExternal` (including `@semio-community/ecosystem-site-core` and Radix/motion packages) and `vite.resolve.dedupe: ["react", "react-dom"]`.
3. Confirm `react` and `react-dom` are `peerDependencies` (not `dependencies`) in `ecosystem-site-core/package.json`.

### `npm ci` fails with lockfile mismatch

`package.json` was bumped without running `npm install` to regenerate the lockfile. Fix:

```bash
npm install
git add package.json package-lock.json
git commit -m "fix: sync lockfile after version bump"
git push
```

### `npm ci` fails with `No matching version found` / `ETARGET`

CI ran before the publish workflow in `ecosystem-site-core` finished. Wait for **Actions → Build & Publish Package** to complete there, then re-run the failing CI job here.

## Build and Check

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Full build (CMS + Astro + Pagefind)
npm run build:site   # Astro only
npm run check        # Astro type check
npx tsc --noEmit     # TypeScript type check
npm run lint         # Biome lint
npm run format       # Format code
```

## What Stays Site-Specific

These components are intentionally site-specific and should not be moved to the shared package:
- `src/components/hero/HeroHeader.tsx` — branded glyph animation (Semio visual identity)
- `src/components/background/ParallaxHexBackground.tsx` — branded hex background
- `src/components/search/` — Pagefind search integration (uses `SearchProvider`, `SearchModal`, `SearchMobilePanel` from package, but the `useSearch` hook and Pagefind wiring are site-specific)
- `src/components/BaseHead.astro` — site-specific meta, OG, and webmention config
- `src/components/navigation/navIcons.ts` — site-specific route→icon mapping

## What Lives in the Shared Package

If you see a component that has identical logic across all three sites, it belongs in `ecosystem-site-core`. Currently shared:
- All card components (`BriefCard`, `DetailCard`, `EventCard`, etc.)
- Navigation (`NavigationMenu`, `MobileNavigation`, `BoundNavigationMenu`, `BoundMobileNavigation`)
- Button primitives (`NavIconButton`, `MobileNavButton`, `CallToActionButton`)
- Layout primitives (`PageSection`, `SubsectionGrid`, `SectionBlock`)
- Detail page components (`BaseDetailLayout`, `DetailHero`, `InfoCard`, `ContentSection`, etc.)
- Events page (`EventsSections`)
- Header and Footer shells (`Header`, `Footer`, `SkipLink`)
- Search UI (`SearchProvider`, `SearchModal`, `SearchMobilePanel`) — site wires `useSearch()` hook
- Theme (`ThemeProvider`) — manages dark/light mode toggle
