# Mobile Navigation Implementation Guide

## Current Implementation Analysis

The current mobile navigation uses a custom drawer implementation with vanilla JavaScript for state management. While functional, this approach has several limitations:

- **Z-index conflicts**: Manual z-index management leads to layering issues
- **Accessibility concerns**: Custom implementation may miss ARIA attributes and focus management
- **Animation complexity**: Custom CSS transitions require careful timing coordination
- **State management**: JavaScript state is disconnected from React component tree

## Radix UI Component Options

### Option 1: Dialog Component (Sheet Pattern)
**Best for: Full-screen mobile menus with overlay**

```tsx
import * as Dialog from '@radix-ui/react-dialog';

const MobileNav = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="md:hidden">Menu</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
      <Dialog.Content className="fixed right-0 top-0 h-full w-[300px] bg-white z-50">
        {/* Navigation items */}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
```

**Pros:**
- Built-in focus management and keyboard navigation
- Automatic z-index handling via Portal
- Screen reader announcements
- Prevents background scrolling automatically
- Smooth open/close animations with data attributes

**Cons:**
- Requires React component (not vanilla JS)
- May need custom styling for slide animations

### Option 2: Navigation Menu (Responsive Pattern)
**Best for: Unified desktop/mobile navigation**

```tsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

const ResponsiveNav = () => (
  <NavigationMenu.Root orientation="vertical" className="md:orientation-horizontal">
    <NavigationMenu.List>
      {/* Items adapt based on viewport */}
    </NavigationMenu.List>
  </NavigationMenu.Root>
);
```

**Pros:**
- Single component for all breakpoints
- Maintains navigation semantics
- Consistent keyboard navigation

**Cons:**
- Limited mobile-specific features
- May require significant restructuring

### Option 3: Dropdown Menu (Compact Pattern)
**Best for: Simple mobile menus without overlay**

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const MobileDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger className="md:hidden">
      Menu
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="min-w-[220px] bg-white rounded-md p-1 z-50">
        {/* Menu items */}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
```

**Pros:**
- Lightweight implementation
- Auto-positioning
- Good for simple navigation

**Cons:**
- Not ideal for many menu items
- Less suitable for full mobile experience

### Option 4: Collapsible (Accordion Pattern)
**Best for: In-page mobile navigation**

```tsx
import * as Collapsible from '@radix-ui/react-collapsible';

const MobileCollapsible = () => (
  <Collapsible.Root className="md:hidden">
    <Collapsible.Trigger>Menu</Collapsible.Trigger>
    <Collapsible.Content>
      {/* Navigation items */}
    </Collapsible.Content>
  </Collapsible.Root>
);
```

**Pros:**
- No overlay needed
- Maintains page context
- Simple implementation

**Cons:**
- Takes up page space when open
- May push content down

## Recommended Implementation

### Primary Recommendation: Dialog Component as Sheet

Given the current architecture and requirements, **Option 1 (Dialog as Sheet)** is the recommended approach for the following reasons:

1. **Seamless Integration**: The Dialog component can coexist with the current NavigationMenu component used for desktop
2. **Portal Rendering**: Automatically handles z-index stacking through React Portal
3. **Accessibility**: Full ARIA support, focus trapping, and keyboard navigation out of the box
4. **Mobile UX**: Provides expected mobile patterns (overlay, slide-in animation, close on escape/outside click)

### Implementation Strategy

#### Phase 1: Create Mobile Navigation Component
```tsx
// src/components/navigation/MobileNavigation.tsx
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';

interface MobileNavigationProps {
  menuLinks: Array<{
    path: string;
    title: string;
    callToAction?: boolean;
  }>;
  currentPath: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  menuLinks,
  currentPath,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="relative h-8 w-8 rounded-lg bg-color-100 hover:bg-accent-base/10 text-accent-base md:hidden"
          aria-label="Open navigation menu"
        >
          <HamburgerMenuIcon className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut z-40" />
        
        <Dialog.Content className="fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-surface data-[state=open]:animate-slideInRight data-[state=closed]:animate-slideOutRight z-50 focus:outline-none">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-color-200">
              <Dialog.Title className="text-lg font-semibold">
                Navigation
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="h-8 w-8 rounded-lg hover:bg-color-100 flex items-center justify-center"
                  aria-label="Close navigation"
                >
                  <Cross2Icon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            
            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {menuLinks.map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={() => setOpen(false)}
                      className={`
                        block px-4 py-3 rounded-lg transition-colors
                        ${link.callToAction 
                          ? 'bg-gradient-to-r from-accent-one to-accent-two text-white font-semibold'
                          : currentPath === link.path
                            ? 'bg-accent-base/10 text-accent-base font-semibold'
                            : 'hover:bg-color-100 text-foreground'
                        }
                      `}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

#### Phase 2: Add Required Animations
```css
/* src/styles/animations.css */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animate-slideInRight {
  animation: slideInRight 300ms ease-out;
}

.animate-slideOutRight {
  animation: slideOutRight 300ms ease-in;
}

.animate-fadeIn {
  animation: fadeIn 200ms ease-out;
}

.animate-fadeOut {
  animation: fadeOut 200ms ease-in;
}
```

#### Phase 3: Integration with Header
Replace the current mobile button and drawer implementation in `Header.astro`:

```astro
---
// Import the new component
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
---

<header>
  <!-- Logo -->
  
  <!-- Desktop Navigation (unchanged) -->
  
  <!-- Replace mobile-button with: -->
  <div class="md:hidden">
    <MobileNavigation
      client:load
      menuLinks={menuLinks.filter(link => link.inHeader)}
      currentPath={Astro.url.pathname}
    />
  </div>
  
  <!-- Remove old drawer div entirely -->
</header>
```

### Migration Path

1. **Install Radix Dialog**: `npm install @radix-ui/react-dialog`
2. **Create MobileNavigation component** with Dialog implementation
3. **Add animation classes** to global CSS or Tailwind config
4. **Test component in isolation** before integration
5. **Replace current mobile menu** in Header.astro
6. **Remove old drawer implementation** and associated JavaScript

### Benefits of This Approach

- **Accessibility**: Full keyboard navigation, focus management, and ARIA attributes
- **Performance**: React portal prevents z-index issues and improves render performance
- **Maintainability**: Single source of truth for mobile navigation state
- **User Experience**: Native-feeling animations and interactions
- **Developer Experience**: Less custom code to maintain, better TypeScript support

### Alternative Considerations

If you need to maintain vanilla JavaScript for some reason, consider using the **Web Components** version of these patterns or implementing a **Progressive Enhancement** strategy where the basic menu works without JavaScript and Radix enhances it when available.

## Conclusion

The Dialog-based sheet pattern provides the best balance of user experience, accessibility, and maintainability for the Semio Community website's mobile navigation. It integrates well with the existing Radix NavigationMenu component while providing mobile-specific interactions that users expect.