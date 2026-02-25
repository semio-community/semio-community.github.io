import type { SiteConfig } from "@/types";
import type {
  FeaturedSection as CoreFeaturedSection,
  LinkSection as CoreLinkSection,
  MenuLink,
  NavCollectionKey,
  NavCollections,
  Section as CoreSection,
} from "@semio/ecosystem-site-core";

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: "Semio Community",
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: "en-US",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  // Used as the default description meta property and webmanifest description
  description:
    "Semio Community is a 501(c)(3) nonprofit organization facilitating community-driven robotics hardware, software, and research to foster repeatable, reproducible, and replicable science and reusable systems within human-robot interaction (HRI).",
  // HTML lang property, found in src/layouts/SiteShell.astro (html lang attr) & astro.config.ts L:48
  lang: "en-US",
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: "en_US",
  // Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
  title: "Semio Community",
  navigation: {
    highlightVariant: "primary",
    ctaVariant: "primary",
  },
};

export type LinkSection = CoreLinkSection;
export type FeaturedSection = CoreFeaturedSection;
export type Section = CoreSection;
export type { NavCollectionKey, NavCollections };

// Used to generate links in both the Header & Footer.
export const menuLinks: MenuLink[] = [
  {
    path: "/",
    title: "Home",
    inHeader: false,
  },
  {
    path: "/projects/",
    title: "Projects",
    inHeader: true,
    sections: [
      { kind: "link", title: "Hardware Projects", href: "/projects/#hardware" },
      { kind: "link", title: "Software Projects", href: "/projects/#software" },
      { kind: "link", title: "Research Projects", href: "/projects/#research" },
      {
        kind: "featured",
        title: "Featured Hardware",
        collection: "hardware",
        items: ["quori-v2", "quori-v1"],
        fields: {
          title: "name",
          subtitle: "shortDescription",
        },
      },
      {
        kind: "featured",
        title: "Featured Software",
        collection: "software",
        items: ["arora", "vizij"],
        fields: {
          title: "name",
          subtitle: "shortDescription",
        },
      },
    ],
  },
  {
    path: "/services/",
    title: "Services",
    inHeader: true,
    sections: [
      { kind: "link", title: "Hardware Services", href: "/services/#hardware" },
      { kind: "link", title: "Software Services", href: "/services/#software" },
      { kind: "link", title: "Research Services", href: "/services/#research" },
      { kind: "link", title: "Benefits", href: "/services/#benefits" },
      { kind: "link", title: "Process", href: "/services/#process" },
      { kind: "link", title: "Get Started", href: "/services/#get-started" },
    ],
  },
  {
    path: "/events/",
    title: "Events",
    inHeader: true,
    sections: [
      { kind: "link", title: "Featured Events", href: "/events/#featured" },
      { kind: "link", title: "Upcoming Events", href: "/events/#upcoming" },
      { kind: "link", title: "Past Events", href: "/events/#past" },
      {
        kind: "link",
        title: "Partner for an Event",
        href: "/events/#events-contribute",
      },
    ],
  },
  {
    path: "/contributors/",
    title: "Contributors",
    inHeader: true,
    sections: [
      { kind: "link", title: "People", href: "/contributors/#people" },
      { kind: "link", title: "Partners", href: "/contributors/#partners" },
      { kind: "link", title: "Sponsors", href: "/contributors/#sponsors" },
    ],
  },
  {
    path: "/get-involved/",
    title: "Get Involved",
    inHeader: true,
    callToAction: true,
  },
];
