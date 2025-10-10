# Detail Layout Components

This directory contains the composition-based detail page components for displaying detailed information about hardware, software, people, partners, studies, and events.

## Architecture

The detail layout system uses a **composition-based architecture** where small, reusable React components are assembled into complete detail pages using Astro's slot system.

```
BaseDetailLayout.astro (Slot-based structure)
├── DetailLayoutWrapper.astro (Optional helper with common patterns)
└── React Components
    ├── DetailHero.tsx
    ├── DetailHeader.tsx
    ├── StatusBadge.tsx
    ├── ActionButtonGroup.tsx
    ├── ContributorsSection.tsx
    ├── SpecificationsCard.tsx
    ├── MetadataCard.tsx
    ├── FeaturesCard.tsx
    ├── ChipsCard.tsx
    ├── PricingCard.tsx
    ├── TechnologiesCard.tsx
    ├── TagsSection.tsx
    └── RelatedItemsGrid.tsx
```

## Components

### Layout Components

#### BaseDetailLayout.astro

The foundation component that provides a slot-based structure for detail pages.

**Available Slots:**
- `breadcrumbs` - Navigation breadcrumbs
- `hero` - Hero image section with overlay
- `header` - Text-based header (when no hero)
- `top-actions` - Prominent actions above main content
- `contributors` - Organizations and people section
- `actions` - Primary action buttons
- `meta-section` - Additional metadata section
- `before-content` - Content before main text
- *default* - Main MDX/Markdown content
- `after-content` - Content after main text
- `sidebar` - Sidebar with cards
- `additional-sections` - Extra content sections
- `related` - Related items grid
- `footer` - Footer content (citations, etc.)

**Usage Example:**

```astro
---
import BaseDetailLayout from '@/components/detail/BaseDetailLayout.astro';
import { DetailHero, ContributorsSection, FeaturesCard } from '@/components/detail';
---

<BaseDetailLayout>
  <DetailHero 
    slot="hero"
    image={data.images?.hero}
    title={data.name}
    subtitle={data.shortDescription}
    badges={badges}
    client:load
  />
  
  <ContributorsSection 
    slot="contributors"
    organizations={orgContributors}
    people={peopleContributors}
    client:load
  />
  
  <Fragment slot="sidebar">
    <FeaturesCard features={data.features} client:load />
  </Fragment>
  
  <Content /> <!-- Main MDX content -->
</BaseDetailLayout>
```

#### DetailLayoutWrapper.astro

A convenience wrapper that simplifies common detail page patterns by handling standard props and automatically placing components in the right slots.

**Props:**
- All BaseDetailLayout visibility controls
- `heroImage`, `title`, `subtitle`, `badges` - Hero/header data
- `organizations`, `people`, `leadOrg`, `supportingOrgs` - Contributors data
- `actionButtons` - Array of action button configurations
- `relatedItems`, `relatedTitle`, `relatedSubtitle` - Related content

### React Components

#### DetailHero
Displays a hero image with overlay containing title, subtitle, and status badges.

```tsx
<DetailHero
  image={heroImage}
  title="Product Name"
  subtitle="Short description"
  badges={[
    { text: "Available", color: "green" },
    { text: "Featured", color: "accent" }
  ]}
/>
```

#### DetailHeader
Alternative to hero for pages without hero images.

```tsx
<DetailHeader
  title="Study Title"
  subtitle="Abstract or description"
  badges={[{ text: "Published", color: "green" }]}
/>
```

#### StatusBadge
Flexible badge component for status indicators.

```tsx
<StatusBadge
  text="Beta"
  status="beta" // Auto-maps to color
  variant="soft" // soft | solid | outline
  size="medium"
/>
```

#### ActionButtonGroup
Groups action buttons with consistent spacing.

```tsx
<ActionButtonGroup
  buttons={[
    { href: "/docs", text: "Documentation", variant: "primary" },
    { href: data.github, text: "GitHub", variant: "tertiary" },
    { onClick: handleDemo, text: "Try Demo", condition: hasDemo }
  ]}
/>
```

#### ContributorsSection
Displays organizations and people contributors with statistics.

```tsx
<ContributorsSection
  organizations={orgContributors}
  people={peopleContributors}
  leadOrg={leadOrganization}
  supportingOrgs={supportingOrganizations}
  categories={["Mobile Robot"]}
  researchAreas={["Navigation", "HRI"]}
/>
```

#### SpecificationsCard
Generic key-value display card for specifications or requirements.

```tsx
<SpecificationsCard
  title="Specifications"
  icon="settings-icon"
  items={{
    height: "1.2m",
    weight: "45kg",
    battery: "8 hours",
    sensors: ["LIDAR", "RGB-D Camera", "IMU"]
  }}
/>
```

#### MetadataCard
Structured metadata display with optional links.

```tsx
<MetadataCard
  title="Publication Details"
  items={[
    { label: "Venue", value: "ICRA 2024" },
    { label: "DOI", value: "10.1234/5678", link: "https://doi.org/..." },
    { label: "Citations", value: "42" }
  ]}
/>
```

#### FeaturesCard
Display features with checkmark icons.

```tsx
<FeaturesCard
  title="Key Features"
  features={[
    "Autonomous navigation",
    "Real-time obstacle avoidance",
    "Multi-modal interaction"
  ]}
/>
```

#### ChipsCard
Display collections of chips/badges.

```tsx
<ChipsCard
  title="Expertise"
  items={["Machine Learning", "Robotics", "HCI"]}
  variant="primary"
/>
```

#### PricingCard
Display pricing information.

```tsx
<PricingCard
  purchase={25000}
  rental={{
    daily: 500,
    weekly: 2500,
    monthly: 8000
  }}
  currency="$"
/>
```

#### TechnologiesCard
Display programming languages and platforms.

```tsx
<TechnologiesCard
  languages={["Python", "C++", "ROS"]}
  platforms={["Ubuntu 20.04", "Windows 11"]}
/>
```

#### TagsSection
Display hashtag-style tags with links.

```tsx
<TagsSection
  tags={["robotics", "ai", "opensource"]}
  baseUrl="/tags"
/>
```

#### RelatedItemsGrid
Grid of related content items.

```tsx
<RelatedItemsGrid
  title="Related Hardware"
  subtitle="Other platforms you might like"
  items={relatedHardware}
  itemType="hardware"
  columns={3}
/>
```

## Complete Example: Hardware Detail Page

```astro
---
import BaseDetailLayout from '@/components/detail/BaseDetailLayout.astro';
import {
  DetailHero,
  ActionButtonGroup,
  ContributorsSection,
  SpecificationsCard,
  FeaturesCard,
  PricingCard,
  ChipsCard,
  TagsSection,
  RelatedItemsGrid
} from '@/components/detail';

const { entry } = Astro.props;
const { Content } = await render(entry);
const { data } = entry;

// Prepare data
const badges = [
  { text: statusLabels[data.status], color: statusColors[data.status] },
  data.featured && { text: "Featured", color: "accent" }
].filter(Boolean);

const actionButtons = [
  data.links?.website && { href: data.links.website, text: "Visit Website", variant: "tertiary" },
  data.links?.purchase && { href: data.links.purchase, text: "Purchase", variant: "primary" },
  data.links?.github && { href: data.links.github, text: "GitHub", variant: "tertiary" },
].filter(Boolean);
---

<BaseDetailLayout>
  <DetailHero
    slot="hero"
    image={data.images?.hero}
    title={data.name}
    subtitle={data.shortDescription}
    badges={badges}
    client:load
  />
  
  <ContributorsSection
    slot="contributors"
    organizations={orgContributors}
    people={peopleContributors}
    leadOrg={leadOrg}
    supportingOrgs={supportingOrgs}
    categories={[categoryLabels[data.category]]}
    researchAreas={data.researchAreas}
    client:load
  />
  
  <ActionButtonGroup
    slot="actions"
    buttons={actionButtons}
    client:load
  />
  
  <Fragment slot="sidebar">
    <SpecificationsCard
      items={data.specifications}
      client:load
    />
    <FeaturesCard
      features={data.features}
      client:load
    />
    <PricingCard
      purchase={data.pricing?.purchase}
      rental={data.pricing?.rental}
      client:load
    />
    <ChipsCard
      title="Applications"
      items={data.applications}
      client:load
    />
    <TagsSection
      tags={data.tags}
      client:load
    />
  </Fragment>
  
  <Content />
  
  <RelatedItemsGrid
    slot="related"
    title="Related Hardware"
    subtitle="Other platforms you might be interested in"
    items={relatedHardware}
    itemType="hardware"
    client:load
  />
</BaseDetailLayout>
```

## Migration from Old DetailLayout

### Before (Monolithic Component)
```astro
<DetailLayout type="hardware" data={data} relatedItems={relatedHardware}>
  <Content />
</DetailLayout>
```

### After (Composition-Based)
```astro
<BaseDetailLayout>
  <!-- Compose with specific components as needed -->
  <DetailHero slot="hero" {...heroProps} client:load />
  <ContributorsSection slot="contributors" {...contributorProps} client:load />
  <!-- ... other components ... -->
  <Content />
</BaseDetailLayout>
```

## Best Practices

1. **Use `client:load` directive** for React components in Astro
2. **Filter empty data** before passing to components (they handle nulls gracefully)
3. **Compose only what you need** - don't include sections without data
4. **Use Fragment for multiple sidebar items**:
   ```astro
   <Fragment slot="sidebar">
     <Card1 client:load />
     <Card2 client:load />
   </Fragment>
   ```
5. **Leverage TypeScript** - All components have full type definitions
6. **Keep sidebar content concise** - It's sticky and has limited height
7. **Use consistent status mappings** across content types

## Component Customization

All components accept a `className` prop for additional styling:

```tsx
<FeaturesCard
  features={data.features}
  className="border-2 border-accent-two"
/>
```

Many components also have variant and size options:

```tsx
<StatusBadge
  text="New"
  variant="solid" // soft | solid | outline
  size="large"    // small | medium | large
/>

<ChipsCard
  items={tags}
  variant="primary" // default | primary | secondary | accent
/>
```

## Adding New Content Types

To add a new content type:

1. Create the slug page (e.g., `src/pages/newtype/[...slug].astro`)
2. Import `BaseDetailLayout` and needed components
3. Map your content type's data to component props
4. Compose the layout using appropriate slots
5. Add any type-specific components as needed

## Troubleshooting

### Components not rendering
- Ensure you're using `client:load` (or other client directives) for React components
- Check that data is being passed correctly

### Styling issues
- Components use Tailwind classes with your custom theme colors
- Ensure your Tailwind config includes custom colors like `accent-one`, `special`, etc.

### TypeScript errors
- All components export their prop types
- Import types from `@/components/detail` when needed

### Layout issues
- The sidebar is sticky by default with scrollable content
- Use the `showSidebar={false}` prop on BaseDetailLayout for full-width content
- Mobile view automatically moves sidebar below content