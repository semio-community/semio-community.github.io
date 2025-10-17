import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { clsx } from "clsx";
import { CallToActionButton } from "../ui/CallToActionButton";
import { getStatusColor } from "@/config/statusConfig";

// Simplified type for serialized data
type HardwareItem = {
  id: string;
  name: string;
  shortDescription: string;
  status: "available" | "in-progress" | "coming-soon" | "deprecated";
};

type SoftwareItem = {
  id: string;
  name: string;
  shortDescription: string;
  status: "stable" | "beta" | "alpha" | "in-progress" | "deprecated";
};

type ResearchItem = {
  id: string;
  title: string;
  type: string;
  year: number;
  citations: number;
};

interface NavigationMenuProps {
  currentPath: string;
  menuLinks: Array<{
    path: string;
    title: string;
    inHeader: boolean;
    callToAction?: boolean;
  }>;
  hardwareItems: HardwareItem[];
  softwareItems: SoftwareItem[];
  researchItems?: ResearchItem[];
  menuSections: Record<
    string,
    Array<{
      title: string;
      href: string;
      icon?: string;
    }>
  >;
  urlPrefix: string;
}

// Helper function to construct URLs
const makeUrl = (path: string, prefix: string = "") => {
  // Handle absolute paths
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${normalizedPath}`;
};

export const NavigationMenuComponent: React.FC<NavigationMenuProps> = ({
  currentPath,
  menuLinks,
  hardwareItems,
  softwareItems,
  researchItems = [],
  menuSections,
  urlPrefix,
}) => {
  const url = (path: string) => makeUrl(path, urlPrefix);
  const maxItemsInDropdown = 4;
  const hardwareForDropdown = hardwareItems.slice(0, maxItemsInDropdown);
  const softwareForDropdown = softwareItems.slice(0, maxItemsInDropdown);
  const researchForDropdown = researchItems.slice(0, 3);

  // Fallback if no menu links
  if (!menuLinks || menuLinks.length === 0) {
    return <div className="text-accent-two">Loading navigation...</div>;
  }

  return (
    <NavigationMenu.Root className="relative z-10">
      <NavigationMenu.List className="flex list-none items-center justify-center gap-0.5 md:gap-1">
        {menuLinks
          .filter((link) => link.inHeader)
          .map((link) => {
            const hasDropdown =
              (menuSections[link.path] || link.path === "/projects/") &&
              !link.callToAction;

            if (!hasDropdown || link.callToAction) {
              // Simple link without dropdown
              if (link.callToAction) {
                return (
                  <NavigationMenu.Item key={link.path}>
                    <CallToActionButton
                      href={url(link.path)}
                      size="small"
                      className="text-xs sm:text-sm px-2 md:px-3 py-1.5 md:py-2"
                    >
                      {link.title}
                    </CallToActionButton>
                  </NavigationMenu.Item>
                );
              }

              return (
                <NavigationMenu.Item key={link.path}>
                  <NavigationMenu.Link
                    className={clsx(
                      "block select-none rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs sm:text-sm font-medium leading-none no-underline transition-all duration-200 whitespace-nowrap",
                      "text-accent-two hover:text-accent-base focus:text-accent-base",
                      currentPath === link.path &&
                        "font-semibold text-foreground",
                    )}
                    href={url(link.path)}
                  >
                    {link.title}
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              );
            }

            // Link with dropdown
            return (
              <NavigationMenu.Item key={link.path}>
                <NavigationMenu.Trigger
                  className={clsx(
                    "group inline-flex select-none items-center gap-0.5 md:gap-1 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs sm:text-sm font-medium leading-none outline-none transition-colors whitespace-nowrap",
                    currentPath === link.path
                      ? "font-semibold text-accent-two"
                      : "text-foreground hover:text-accent-base focus:text-accent-base data-[state=open]:text-accent-base",
                  )}
                  onPointerDown={(e) => {
                    // Allow click to navigate
                    e.preventDefault();
                    window.location.href = url(link.path);
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {link.title}
                  <svg
                    className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </NavigationMenu.Trigger>

                <NavigationMenu.Content className="data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto">
                  <div className="w-[400px] p-4 bg-surface backdrop-blur-md rounded-xl shadow-2xl border border-color-100 dark:border-color-800">
                    {/* Main page link */}
                    <a
                      href={url(link.path)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-base/10 transition-colors mb-3 group/link"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent-base/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-accent-base"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground group-hover/link:text-accent-base transition-colors">
                          {link.title} Home
                        </div>
                        <div className="text-xs text-color-500">
                          Browse all {link.title.toLowerCase()}
                        </div>
                      </div>
                    </a>

                    {/* Divider */}
                    <div className="h-px bg-color-200 dark:bg-color-700 my-3"></div>

                    {/* Sections */}
                    {menuSections[link.path] && (
                      <div className="space-y-2 mb-3">
                        <div className="text-xs font-semibold text-color-500 uppercase tracking-wider px-3">
                          Sections
                        </div>
                        {menuSections[link.path]?.map((section) => (
                          <a
                            key={section.href}
                            href={url(section.href)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent-base/10 transition-colors group/link"
                          >
                            <span className="text-sm text-foreground group-hover/link:text-accent-base transition-colors">
                              {section.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Projects Page - Combined Hardware, Software, Research */}
                    {link.path === "/projects/" && (
                      <>
                        {/* Hardware Items */}
                        {hardwareForDropdown.length > 0 && (
                          <>
                            <div className="h-px bg-color-200 dark:bg-color-700 my-3"></div>
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-color-500 uppercase tracking-wider px-3">
                                Featured Hardware
                              </div>
                              {hardwareForDropdown.slice(0, 2).map((item) => (
                                <a
                                  key={item.id}
                                  href={url(`/hardware/${item.id}`)}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent-base/10 transition-colors group/link"
                                >
                                  <div
                                    className={clsx(
                                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                      getStatusColor(item.status, "bullet"),
                                    )}
                                  ></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm text-foreground group-hover/link:text-accent-base transition-colors truncate">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-color-500 line-clamp-1">
                                      {item.shortDescription}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Software Items */}
                        {softwareForDropdown.length > 0 && (
                          <>
                            <div className="h-px bg-color-200 dark:bg-color-700 my-3"></div>
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-color-500 uppercase tracking-wider px-3">
                                Featured Software
                              </div>
                              {softwareForDropdown.slice(0, 2).map((item) => (
                                <a
                                  key={item.id}
                                  href={url(`/software/${item.id}`)}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent-base/10 transition-colors group/link"
                                >
                                  <div
                                    className={clsx(
                                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                      getStatusColor(item.status, "bullet"),
                                    )}
                                  ></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm text-foreground group-hover/link:text-accent-base transition-colors truncate">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-color-500 line-clamp-1">
                                      {item.shortDescription}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Research Items */}
                        {researchForDropdown.length > 0 && (
                          <>
                            <div className="h-px bg-color-200 dark:bg-color-700 my-3"></div>
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-color-500 uppercase tracking-wider px-3">
                                Featured Research
                              </div>
                              {researchForDropdown.map((item) => (
                                <a
                                  key={item.id}
                                  href={url(`/research/${item.id}`)}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent-base/10 transition-colors group/link"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm text-foreground group-hover/link:text-accent-base transition-colors line-clamp-2">
                                      {item.title}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-color-500">
                                      <span>{item.type}</span>
                                      <span>•</span>
                                      <span>{item.year}</span>
                                      <span>•</span>
                                      <span>{item.citations} citations</span>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          })}

        {/* Indicator hidden to avoid border overlap issues */}
        <NavigationMenu.Indicator className="hidden" />
      </NavigationMenu.List>

      <NavigationMenu.Viewport className="absolute top-full left-0 right-0 mt-[10px] flex justify-center data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
    </NavigationMenu.Root>
  );
};
