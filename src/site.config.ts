import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: "Semio Community",
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  // Used as the default description meta property and webmanifest description
  description:
    "Semio Community is a 501(c)(3) nonprofit organization facilitating community-driven robotics hardware, software, and studies to foster repeatable, reproducible, and replicable science and reusable systems within human-robot interaction (HRI).",
  // HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
  lang: "en-GB",
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: "en_GB",
  // Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
  title: "Semio Community",
};

// Used to generate links in both the Header & Footer.
export const menuLinks: {
  path: string;
  title: string;
  inHeader: boolean;
  callToAction?: boolean;
}[] = [
  {
    path: "/",
    title: "Home",
    inHeader: false,
  },
  {
    path: "/hardware/",
    title: "Hardware",
    inHeader: true,
  },
  {
    path: "/software/",
    title: "Software",
    inHeader: true,
  },
  {
    path: "/studies/",
    title: "Studies",
    inHeader: false,
  },
  {
    path: "/events/",
    title: "Events",
    inHeader: true,
  },
  {
    path: "/partners/",
    title: "Partners",
    inHeader: true,
  },
  {
    path: "/about/",
    title: "About",
    inHeader: false,
  },
  {
    path: "/get-involved/",
    title: "Get Involved",
    inHeader: true,
    callToAction: true,
  },
];
