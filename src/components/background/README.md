# Background components — naming, usage, and hydration patterns

This folder contains renderers and helpers for decorative site backgrounds that occasionally require client-side hydration (e.g., for parallax effects with Framer Motion). The goal is to keep naming obvious and hydration minimal.

## Overview

- Frequently reused layout: keep clear, short names.
  - `SiteLayout.tsx` — the main React layout wrapper (SSR-first).
  - `SiteShell.astro` — an Astro wrapper that composes `SiteLayout` and hydrates background(s) only when needed.

- Specific/conditional components: use names that explain their limited, contextual purpose.
  - `ParallaxHexBackground.tsx` — the React renderer for a hex-based parallax background (requires hydration).

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

- `SiteLayout.tsx` (React)
  - Purpose: Main site layout wrapper for content (SSR-first, no hydration by default).
  - Props mirror layout choices (header/footer/skip/theme/sidebar/noPaddingTop/showBackground/containerClassName).
  - Recommendation: Keep `showBackground={false}` unless you want the layout to render its own background (which would require hydrating the layout in the route).

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
  - Behavior: Hydrates `ParallaxHexBackground` directly via `client:only="react"` (when `showBackground` is true) while keeping `SiteLayout` SSR-only.

## Minimal hydration patterns (recommended)

Use `SiteShell` to keep hydration scoped to the background:

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

## Hydrating the entire layout (when needed)

If you want the background to live inside `SiteLayout` (and avoid relying on `SiteShell`'s isolated hydration boundary), you must hydrate the layout in the Astro route. This hydrates more than just the background:

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
  - `SiteShell` hydrates the background via `client:only="react"` while keeping everything else SSR-first. If you need a different composition, import `ParallaxHexBackground` directly in a route and wrap it with the desired `client:*` directive.

- TypeScript quirks in Astro islands:
  - If you ever create a dedicated Astro island for a future effect, watch for “not a module” TS errors when importing `.tsx` components. Create a small type shim or suppress with a local ignore when needed.

- Accessibility:
  - Background is `aria-hidden` and `pointer-events: none`.
  - Consider supporting reduced-motion in future (e.g., `useReducedMotion()` and a static fallback).

## Naming conventions and future backgrounds

For new background types, keep names semantic and predictable:
- Renderer: `Parallax<Shape>Background.tsx`
- If you need a dedicated hydration wrapper (only when `SiteShell` can’t host it), follow the pattern `Background<EffectName>Island.astro`. Most cases should continue to hydrate through `SiteShell` to avoid extra wrappers.

Guidelines:
- Frequently reused layout primitives keep short, clear names: `SiteLayout`, `SiteShell`.
- Specialized/situational components are prefixed with “Background” and include the effect name to make intent obvious.
- Avoid passing Astro components into React props. Keep header/theme/skip/footer Astro-rendered in shells/routes for clarity and safety.

## FAQ

- Why not hydrate from inside the React layout?
  - Astro controls hydration at the `.astro` boundary via `client:*` directives. React components cannot self-declare hydration; they must be instantiated with a directive in `.astro`.

- Can I put the background inside `SiteLayout` without hydrating?
  - No. The parallax uses Framer Motion hooks and must be hydrated to animate. Use `SiteShell` (which hydrates only the background) or hydrate the layout if you prefer that composition.

- Why “SiteLayout” and “SiteShell”?
  - These are frequently referenced structural primitives. Short, descriptive names make their intent and usage obvious across the codebase.
