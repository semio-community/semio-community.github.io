import type { SiteConfig } from "@/types";
import {
	type FeaturedSection as CoreFeaturedSection,
	type LinkSection as CoreLinkSection,
	type Section as CoreSection,
	type MenuLink,
	type NavCollectionKey,
	type NavCollections,
	setActiveSiteKey,
} from "@semio-community/ecosystem-site-core";

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
	siteKey: "semio-community",
	homeOrganizationId: "semio-community",
	suppressOrganizationPage: true,
	// Parallax hex background is part of the semio-community brand identity;
	// it renders site-wide. quori and vizij omit this key, so they never
	// show it. Customize via the fields here (count/seed/palette/etc.).
	parallaxBackground: {},
};

// Publish this build's site key to the shared card converters so their
// featured-state checks narrow to THIS site ("featured here") rather
// than "featured on any site." Runs at module-eval time — before any
// page renders a card — so the converters always see the right key.
// See `active-site.ts` in site-core for why a build singleton is used.
setActiveSiteKey(siteConfig.siteKey);

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
		// Footer-only link (not in the header nav). Keeps the About page
		// reachable and satisfies the orphan-page check.
		path: "/about/",
		title: "About",
		inHeader: false,
	},
	{
		path: "/projects/",
		title: "Projects",
		inHeader: true,
		// Detail pages for hardware, software, and research entries live
		// at their own top-level routes but are conceptually projects.
		subroutes: ["/hardware/", "/software/", "/research/"],
		sections: [
			{ kind: "link", title: "Hardware Projects", href: "/projects/#hardware" },
			{ kind: "link", title: "Software Projects", href: "/projects/#software" },
			{ kind: "link", title: "Research Projects", href: "/projects/#research" },
			// Auto-populated from currently-featured entries — items
			// whose `featuring` window is active land here automatically.
			{
				kind: "featured",
				title: "Featured Hardware",
				collection: "hardware",
				limit: 3,
				fields: { title: "name", subtitle: "shortDescription" },
			},
			{
				kind: "featured",
				title: "Featured Software",
				collection: "software",
				limit: 3,
				fields: { title: "name", subtitle: "shortDescription" },
			},
			{
				kind: "featured",
				title: "Featured Research",
				collection: "research",
				limit: 3,
				fields: { title: "title", subtitle: "description" },
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
			{
				kind: "featured",
				title: "Featured Events",
				collection: "events",
				limit: 3,
				fields: { title: "displayName", subtitle: "description" },
			},
		],
	},
	{
		path: "/contributors/",
		title: "Contributors",
		inHeader: true,
		// Person and organization detail pages live at their own routes
		// but conceptually belong to the contributors section (the
		// `/people` and `/organization`/`/partners` listings redirect here).
		subroutes: ["/people/", "/organizations/", "/organization/", "/partners/"],
		sections: [
			{ kind: "link", title: "People", href: "/contributors/#people" },
			{ kind: "link", title: "Partners", href: "/contributors/#partners" },
			{ kind: "link", title: "Sponsors", href: "/contributors/#sponsors" },
			{
				kind: "featured",
				title: "Featured People",
				collection: "people",
				limit: 3,
				// `affiliationLabel` is a virtual field — see
				// `nav-field-projectors.ts` in site-core. Resolves to
				// "Role · Org Name" with the home-org affiliation
				// prioritized.
				fields: { title: "name", subtitle: "affiliationLabel" },
			},
			{
				kind: "featured",
				title: "Featured Partners",
				collection: "organizations",
				limit: 3,
				fields: { title: "name", subtitle: "collaborationSummary" },
			},
		],
	},
	{
		path: "/press/",
		title: "Press",
		inHeader: true,
		dropdownSubtitle:
			"Announcements, publications, stories, and awards from across the ecosystem",
		sections: [
			{ kind: "link", title: "Featured", href: "/press/#featured" },
			{ kind: "link", title: "Announcements", href: "/press/#announcements" },
			{ kind: "link", title: "Publications", href: "/press/#publications" },
			{ kind: "link", title: "Stories", href: "/press/#stories" },
			{ kind: "link", title: "Awards", href: "/press/#awards" },
			{
				kind: "featured",
				title: "Featured Press",
				collection: "press",
				limit: 3,
				fields: { title: "title", subtitle: "description" },
			},
			{
				kind: "featured",
				title: "Featured Awards",
				collection: "awards",
				limit: 3,
				fields: { title: "title", subtitle: "description" },
			},
		],
	},
	{
		path: "/get-involved/",
		title: "Get Involved",
		inHeader: true,
		callToAction: true,
	},
];
