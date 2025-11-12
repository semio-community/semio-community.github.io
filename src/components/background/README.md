# Background components — naming, usage, and hydration patterns

This folder contains renderers and helpers for decorative site backgrounds that occasionally require client-side hydration (e.g., for parallax effects with Framer Motion). The goal is to keep naming obvious and hydration minimal.

## Overview

- Frequently reused layout: keep clear, short names.
  - `SiteLayout.tsx` — the main React layout wrapper (SSR-first).
  - `SiteShell.astro` — an Astro wrapper that composes `SiteLayout` and hydrates background(s) only when needed.

- Specific/conditional components: use names that explain their limited, contextual purpose.
  - `ParallaxHexBackground.tsx` — the React renderer for a hex-based parallax background (requires hydration).
  - `BackgroundParallaxHexIsland.astro` — thin Astro island wrapper that hydrates `ParallaxHexBackground` without hydrating the entire page.

This separation gives us:
- Minimal hydration by default (SSR-first).
- Explicit, searchable names that reveal intent and typical usage.
- A consistent pattern to add new background types in the future.

## Components and intended usage

- `ParallaxHexBackground.tsx` (React)
  - Purpose: Render animated hexagon shapes with scroll-parallax using Framer Motion.
  - Important: This must run on the client to animate (Framer Motion hooks don’t run during SSR).
  - Props:
    - `count?: number`
    - `seed?: string | number`
    - `verticalSpanVh?: number`
    - `horizontalRangeVw?: { min: number; max: number }`
    - `palette?: string[]`
    - `opacity?: { stroke: [number, number]; fill: [number, number] }`
    - `className?: string`
  - Output: A full-viewport, fixed-position background. Marked `aria-hidden` and uses `pointer-events: none`.

- `BackgroundParallaxHexIsland.astro` (Astro, thin island)
  - Purpose: Hydrate `ParallaxHexBackground` only, leaving the rest of the page SSR-only.
  - Typical directive: `client:only="react"`
  - Props mirror the React component, with `className` passed through.

- `SiteLayout.tsx` (React)
  - Purpose: Main site layout wrapper for content (SSR-first, no hydration by default).
  - Props mirror layout choices (header/footer/skip/theme/sidebar/noPaddingTop/showBackground/containerClassName).
  - Recommendation: Keep `showBackground={false}` and rely on the island to hydrate the background (see below). If you prefer to host the background inside `SiteLayout`, hydrate the layout in the route.

- `SiteShell.astro` (Astro)
  - Purpose: Compose `SiteLayout` in a DRY way while hydrating the background only.
  - Slots:
    - `theme` — Theme provider
    - `skip` — Skip link
    - `header` — Page/site header
    - default — Page content
    - `footer` — Footer
  - Props:
    - Layout: `noPaddingTop?`, `containerClassName?`, `showBackground?` (usually true)
    - Background customization: `backgroundCount?`, `backgroundSeed?`, `backgroundVerticalSpanVh?`, `backgroundHorizontalRangeVw?`, `backgroundPalette?`, `backgroundOpacity?`, `backgroundClassName?`
  - Behavior: Injects `BackgroundParallaxHexIsland` (hydrated) and renders `SiteLayout` in SSR mode.

## Minimal hydration patterns (recommended)

Use the thin island to hydrate only the background:

```astro
---
import SiteShell from "@/layouts/SiteShell.astro";
import ThemeProvider from "@/components/theme/ThemeProvider.astro";
import Header from "@/components/layout/Header.astro";
import Footer from "@/components/layout/Footer.astro";
import SkipLink from "@/components/SkipLink.astro";
---

<SiteShell
  noPaddingTop
  showBackground
  backgroundCount={48}
  backgroundSeed="2025-11-12"
  backgroundClassName="opacity-80"
>
  <Fragment slot="theme"><ThemeProvider /></Fragment>
  <Fragment slot="skip"><SkipLink /></Fragment>
  <Fragment slot="header"><Header /></Fragment>

  <!-- Your SSR page content here (React SSR components or Astro) -->

  <Fragment slot="footer"><Footer /></Fragment>
</SiteShell>
```

Or wire the island directly in a route:

```astro
---
import BackgroundParallaxHexIsland from "@/components/background/BackgroundParallaxHexIsland.astro";
import SiteLayout from "@/layouts/SiteLayout";
---

<!-- Hydrate only the background -->
<BackgroundParallaxHexIsland client:only="react" count={48} seed="2025-11-12" />

<SiteLayout noPaddingTop showBackground={false}>
  <!-- Content remains SSR-only -->
</SiteLayout>
```

## Hydrating the entire layout (when needed)

If you want the background to live inside `SiteLayout` (and avoid an island), you must hydrate the layout in the Astro route. This hydrates more than just the background:

```astro
---
import SiteLayout from "@/layouts/SiteLayout";
---

<SiteLayout client:idle noPaddingTop>
  <!-- Content -->
</SiteLayout>
```

Trade-off: Simpler composition, but larger hydration scope.

## Implementation notes and gotchas

- Z-index/stacking:
  - `ParallaxHexBackground` uses `position: fixed; inset: 0; pointer-events: none;` by default.
  - Ensure your layout root doesn’t have an opaque background that hides it; typically keep `bg-surface` on the body or containers, not on the top-level layout wrapper that sits “above” the background.

- SSR vs client:
  - Framer Motion hooks (`useScroll`, `useTransform`) only animate when hydrated.
  - The island (`client:only="react"`) is the most targeted way to achieve this without hydrating your whole page.

- TypeScript quirks in Astro islands:
  - If you see a “not a module” TS error when importing a `.tsx` component into an Astro island, create a small type shim or suppress with a local ignore. The island in this repo is already configured appropriately.

- Accessibility:
  - Background is `aria-hidden` and `pointer-events: none`.
  - Consider supporting reduced-motion in future (e.g., `useReducedMotion()` and a static fallback).

## Naming conventions and future backgrounds

For new background types, keep names semantic and predictable:
- Renderer: `Parallax<Shape>Background.tsx`
- Island wrapper: `BackgroundParallax<Shape>Island.astro`

Examples:
- `ParallaxDotsBackground.tsx` + `BackgroundParallaxDotsIsland.astro`
- `AuroraGradientBackground.tsx` + `BackgroundAuroraGradientIsland.astro` (if not parallax)

Guidelines:
- Frequently reused layout primitives keep short, clear names: `SiteLayout`, `SiteShell`.
- Specialized/situational components are prefixed with “Background” and include the effect name to make intent obvious.
- Avoid passing Astro components into React props. Keep header/theme/skip/footer Astro-rendered in shells/routes for clarity and safety.

## FAQ

- Why not hydrate from inside the React layout?
  - Astro controls hydration at the `.astro` boundary via `client:*` directives. React components cannot self-declare hydration; they must be instantiated with a directive in `.astro`.

- Can I put the background inside `SiteLayout` without hydrating?
  - No. The parallax uses Framer Motion hooks and must be hydrated to animate. Use the island to hydrate only the background, or hydrate the layout if you prefer that composition.

- Why “SiteLayout” and “SiteShell”?
  - These are frequently referenced structural primitives. Short, descriptive names make their intent and usage obvious across the codebase.