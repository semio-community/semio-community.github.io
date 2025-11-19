## ItemCard → OG Card Mapping

This document summarizes how each collection-specific wrapper uses `ItemCard` today. The OG card renderer should mirror these inputs so the generated image looks like a snapshot of the actual card content rather than introducing new layout decisions.

### Common Structure

- **Hero region**: `ItemCard` always shows `image`/`imageUrl` (with optional `logo` overlay) in an aspect-video container. When no hero is provided, cards fall back to an avatar built from `logo`/person name.
- **Heading row**: `title` plus `FeaturedStar` state derived from `featured` boolean.
- **Body text**: Either `description` when `listItems` is empty, or the first two `listItems`.
- **Footer**: `status`/`statusLabel` if present; otherwise `category`. Up to five icons from `links`, sorted by `linkPriority`.

The OG renderer should therefore provide:

1. A full-width hero image (or avatar fallback) with optional centered logo overlay.
2. Title + featured badge.
3. Either description paragraph or two bullet rows.
4. Footer with status chip and category label; link icons are optional for OG (we can omit them for clarity unless we render brand logos later).

### Collection-Specific Inputs

| Collection      | Wrapper                      | Hero Source         | Description/List Logic                                       | Status/Category                                  | Logo Overlay | Links passed                           |
|-----------------|------------------------------|---------------------|---------------------------------------------------------------|--------------------------------------------------|--------------|----------------------------------------|
| Hardware        | `HardwareCard`               | `data.images?.hero` | `description = shortDescription || description`; no list      | `status`, `category = capitalized data.category` | No           | website, github/code, docs, demo       |
| Software        | `SoftwareCard`               | `data.images?.hero` | `description = shortDescription || description`; no list      | `status`, `category`                             | Logo overlay | website, github/code, docs, demo, npm/pypi |
| Research        | `ResearchCard`               | `data.images?.hero` | `description = data.description`; no list                     | `category = typeLabel + year`; no status         | Logo overlay | website/program, github/code, demo, docs/paper |
| Events          | `EventCard`                  | `data.images?.hero` | No description; `listItems = [date, location]`                | `status` derived from date, `category = type`    | Logo overlay | website, registration                  |
| Organizations   | `PartnerCard`                | `data.images?.hero` | `description = data.description`; no list                     | `category = capitalized type`                    | Logo if no hero | website, docs                        |
| People          | `PersonCard`                 | `data.images?.hero` | `description = bio or “Expertise: …”`; no list                | `category = title`                               | Avatar (always) | website, github                      |
| Hardware/Software (logo overlay) | Only when `logo` exists | `logo` image used inside hero container | — | — | Yes (software always, hardware never) | — |
| Research/Events | Provide `logo` as overlay | `logo` used atop hero | — | — | Yes | — |

### OG Policy

- **Hero image**: Always attempt to inline the Astro `image` field. If absent, use logo/avatar fallback similar to ItemCard.
- **Overlay avatar**: Only render when the wrapper passes `logo`. For people cards, use avatar-style fallback (circular) instead of centered overlay.
- **Description vs list**: Mirror the wrapper logic—only events use list items; others rely on `description`.
- **Status/Category**: Show status chip when wrappers provide `status` or `statusLabel`; otherwise render category label text.
- **Links**: Optional; we can omit for now to avoid small icons, but the OG design should leave footer space where they would normally appear.

Following this mapping ensures OG images read like static snapshots of the live cards. The renderer should not introduce additional badges, paragraphs, or metadata beyond what each wrapper feeds into `ItemCard`.
