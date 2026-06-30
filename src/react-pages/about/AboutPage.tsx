import { url } from "@/utils/url";
import {
	AboutPage as AboutPageLayout,
	type AboutPageContent,
} from "@semio-community/ecosystem-site-core";

/**
 * Semio Community's About page content. The layout (section structure,
 * styling, pillar/initiative/contact/legal rendering) lives in
 * site-core's `AboutPage`; this file only supplies the copy. To tweak
 * the page text, edit the `content` object below — no layout changes
 * needed.
 */
const content: AboutPageContent = {
	mission: {
		title: "Our Mission",
		subtitle: "Advancing human-centered robotics through community collaboration",
		highlight: (
			<>
				Semio Community is a{" "}
				<span className="font-semibold">501(c)(3) nonprofit organization</span>{" "}
				facilitating community-driven robotics hardware, software, and research to
				foster repeatable, reproducible, and replicable science and reusable
				systems within human-robot interaction (HRI).
			</>
		),
		body: "Founded with the belief that the future of robotics lies in collaborative innovation, we work to break down barriers between research and application, making cutting-edge robotics technology accessible to researchers, educators, and developers worldwide.",
	},
	partners: {
		title: "Our Partners",
		subtitle: "Building the future of human-centered robotics and AI together",
		intro:
			"Semio Community actively encourages multidisciplinary collaboration among academia, industry, and the public sector to drive innovation, ethical practices, and the widespread adoption of human-centered robotics technologies.",
		pillars: [
			{
				icon: "solar:square-academic-cap-line-duotone",
				title: "Academia",
				description:
					"Supporting research institutions with tools and infrastructure",
			},
			{
				icon: "solar:buildings-2-line-duotone",
				title: "Industry",
				description:
					"Bridging the gap between research and commercial applications",
			},
			{
				icon: "solar:flag-2-line-duotone",
				title: "Public Sector",
				description:
					"Partnering with government to advance robotics policy and standards",
			},
		],
	},
	whatWeDo: {
		title: "What We Do",
		subtitle: "Our key initiatives and programs",
		items: [
			{
				icon: "solar:cpu-bolt-line-duotone",
				title: "Hardware Development & Support",
				description:
					"We facilitate the development, manufacturing, and distribution of open-source robotics hardware platforms, making advanced research tools accessible to institutions worldwide.",
			},
			{
				icon: "solar:code-square-line-duotone",
				title: "Software & Tools Development",
				description:
					"We create and maintain open-source software libraries, frameworks, and tools that enable researchers to build upon each other's work and accelerate innovation in HRI.",
			},
			{
				icon: "solar:test-tube-line-duotone",
				title: "Research Infrastructure",
				description:
					"We provide shared research infrastructure including study protocols, data repositories, and analysis tools that promote reproducible science in human-robot interaction.",
			},
			{
				icon: "solar:users-group-two-rounded-line-duotone",
				title: "Community Building",
				description:
					"We organize conferences, workshops, and training events that bring together researchers, practitioners, and students to share knowledge and collaborate on advancing the field.",
			},
		],
	},
	story: {
		title: "Our Story",
		subtitle: "The journey of Semio Community",
		body: (
			<>
				<p>
					Semio Community was founded on the principle that the most significant
					advances in robotics come not from isolated efforts, but from
					collaborative innovation. Recognizing the challenges researchers face in
					accessing hardware, replicating research, and building upon existing
					work, we set out to create an organization that would address these
					fundamental barriers.
				</p>
				<p>
					As a 501(c)(3) nonprofit, we operate with complete transparency and
					dedication to our mission. Every dollar donated and every hour
					volunteered directly supports our programs to advance open science in
					robotics.
				</p>
				<p>
					Today, we're proud to support a global community of researchers,
					educators, and developers who share our vision of making robotics
					technology more accessible, reproducible, and impactful for society.
				</p>
			</>
		),
	},
	contactPerson: {
		title: "Contact",
		subtitle: "Get in touch with Semio Community",
		name: "Ross Mead",
		email: "ross@semio.community",
	},
	contactDetails: {
		title: "Contact Us",
		subtitle: "Get in touch with Semio Community",
		email: "ross@semio.community",
		legalStatus: "501(c)(3) Tax-Exempt Nonprofit",
		blurb:
			"Follow us on social media and join our mailing list to stay updated on our latest initiatives, events, and opportunities.",
		socials: [
			{ href: "https://github.com/semio-community", icon: "mdi:github", label: "GitHub" },
			{
				href: "https://www.linkedin.com/company/semio-community",
				icon: "mdi:linkedin",
				label: "LinkedIn",
			},
			{ href: "https://twitter.com/semiocommunity", icon: "mdi:twitter", label: "Twitter" },
		],
		ctaPrompt: "Have a question or want to learn more about our work?",
		ctaHref: url("/#connect"),
		ctaLabel: "Join Our Mailing List",
	},
	legal: {
		title: "Legal Information",
		subtitle: "Transparency and compliance",
		cards: [
			{
				title: "Tax-Exempt Status",
				body: (
					<>
						<p className="text-sm text-color-600 dark:text-color-400 mb-3">
							Semio Community is recognized as a tax-exempt organization under
							section 501(c)(3) of the Internal Revenue Code. Donations are
							tax-deductible to the extent allowed by law.
						</p>
						<p className="text-sm">
							<strong>EIN:</strong> 93-2156692
						</p>
					</>
				),
			},
			{
				title: "Transparency",
				body: (
					<p className="text-sm text-color-600 dark:text-color-400">
						We operate with full transparency and accountability. Financial
						reports, board meetings, and program updates are made available to our
						community and supporters.
					</p>
				),
			},
		],
	},
};

export default function AboutPage() {
	return <AboutPageLayout content={content} baseUrl={import.meta.env.BASE_URL} />;
}
