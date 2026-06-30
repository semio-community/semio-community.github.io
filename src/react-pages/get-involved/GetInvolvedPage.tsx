import {
	CallToActionButton,
	MarketingPage,
	type MarketingPageContent,
} from "@semio-community/ecosystem-site-core";
import { CheckCircle } from "@solar-icons/react-perf/Bold";
import {
	Buildings2,
	CalendarMark,
	Eye,
	Gift,
	HandMoney,
	Letter,
	ShieldCheck,
	Target,
	TestTube,
	UserPlusRounded,
	UsersGroupTwoRounded,
} from "@solar-icons/react-perf/LineDuotone";

/**
 * Semio Community's Get Involved page content. The layout is the shared
 * `MarketingPage` content-block engine in site-core; this file supplies
 * only the copy/structure as data.
 */
const content: MarketingPageContent = {
	hero: {
		icon: <UserPlusRounded className="w-16 h-16 text-accent-two" />,
		title: "Get Involved",
		description: (
			<>
				Be part of a global community advancing human-centered robotics and AI.
				Your support helps us foster reproducible science and develop reusable
				systems for human-robot interaction.
			</>
		),
		actions: [
			{ label: "Make a Donation", href: "#donate" },
			{ label: "Volunteer", href: "#volunteer", variant: "secondary" },
			{ label: "Join the Mailing List", href: "#mailing-list", variant: "tertiary" },
		],
	},
	sections: [
		{
			id: "donate",
			title: "Support Semio Community",
			subtitle: "Your donations enable us to advance open science in robotics",
			containerClassName: "max-w-5xl mx-auto",
			blocks: [
				{
					kind: "box",
					style: "highlight",
					className: "mb-8",
					children: [
						{
							kind: "heading",
							as: "h3",
							text: "Why Your Support Matters",
							className: "text-2xl font-semibold mb-4 text-center text-accent-base",
						},
						{
							kind: "prose",
							content:
								"As a 501(c)(3) nonprofit organization, we rely on donations to sustain our mission of making robotics research more accessible, reproducible, and impactful.",
						},
						{
							kind: "pillars",
							items: [
								{
									icon: ShieldCheck,
									title: "Tax Deductible",
									description:
										"All donations are tax-deductible to the fullest extent of the law",
								},
								{
									icon: Eye,
									title: "Transparent",
									description:
										"Annual reports show exactly how your donations are used",
								},
								{
									icon: Target,
									title: "Impactful",
									description:
										"100% of donations directly support our programs and initiatives",
								},
							],
						},
						{
							kind: "cta",
							buttons: [
								{
									href: "https://donate.semio.community/b/cNiaEX4ZE07R8Wj8Yva7C00",
									label: "Donate Now",
								},
							],
						},
					],
				},
				{
					kind: "box",
					style: "surface",
					children: [
						{
							kind: "heading",
							as: "h3",
							text: "Other Ways to Give",
						},
						{
							kind: "pillars",
							compact: true,
							gridClassName: "grid grid-cols-1 md:grid-cols-3 gap-6 text-center",
							items: [
								{
									icon: Buildings2,
									title: "Corporate Sponsorship",
									description: "Partner with us through corporate giving programs",
								},
								{
									icon: Gift,
									title: "In-Kind Donations",
									description: "Donate equipment, software licenses, or services",
								},
								{
									icon: HandMoney,
									title: "Planned Giving",
									description: "Include Semio Community in your estate planning",
								},
							],
						},
					],
				},
			],
		},
		{
			id: "volunteer",
			title: "Join the Community",
			subtitle:
				"Share your skills and passion to advance human-centered robotics and AI",
			variant: "secondary",
			containerClassName: "max-w-5xl mx-auto",
			blocks: [
				{
					kind: "box",
					style: "highlight",
					children: [
						{
							kind: "heading",
							as: "h3",
							text: "Volunteer Benefits",
							className: "text-xl font-semibold mb-6 text-center text-accent-base",
						},
						{
							kind: "checklist",
							checkIcon: CheckCircle,
							items: [
								{
									title: "Professional Network",
									description:
										"Connect with researchers and professionals in robotics and AI",
								},
								{
									title: "Skill Development",
									description:
										"Gain hands-on experience with cutting-edge robotics and AI technologies",
								},
								{
									title: "Recognition",
									description: "Receive certificates and LinkedIn recommendations",
								},
								{
									title: "Flexible Commitment",
									description: "Choose projects that fit your schedule and interests",
								},
							],
						},
						{
							kind: "cta",
							buttons: [
								{
									href: "https://forms.gle/5iiaThSsGUMzXWsu6",
									label: "Sign Up as Volunteer",
									variant: "secondary",
								},
							],
						},
					],
				},
			],
		},
		{
			id: "mailing-list",
			title: "Join Our Mailing List",
			subtitle: "Stay connected with the latest news, events, and opportunities",
			variant: "tertiary",
			containerClassName: "max-w-4xl mx-auto",
			blocks: [
				{
					kind: "box",
					style: "surfaceLighter",
					children: [
						{
							kind: "columns",
							columns: [
								[
									{
										kind: "heading",
										as: "h3",
										text: "What You'll Receive:",
										className: "text-lg font-semibold mb-4",
									},
									{
										kind: "iconList",
										items: [
											{ icon: Letter, text: "Regular newsletter with community updates" },
											{
												icon: CalendarMark,
												text: "Early announcements for events and workshops",
											},
											{ icon: TestTube, text: "Research highlights and findings" },
											{
												icon: UsersGroupTwoRounded,
												text: "Volunteer and collaboration opportunities",
											},
										],
									},
								],
								[
									{
										kind: "heading",
										as: "h3",
										text: "Sign Up:",
										className: "text-lg font-semibold mb-4",
									},
									{
										kind: "custom",
										node: (
											<CallToActionButton
												size="large"
												variant="tertiary"
												fullWidth
												href="https://forms.gle/5iiaThSsGUMzXWsu6"
											>
												Connect with Us
											</CallToActionButton>
										),
									},
								],
							],
						},
						{
							kind: "custom",
							node: (
								<div className="text-center text-sm text-color-600 dark:text-color-400">
									<p>
										We respect your privacy and never share your information with
										third parties.
									</p>
								</div>
							),
						},
					],
				},
			],
		},
	],
};

export default function GetInvolvedPage() {
	return <MarketingPage content={content} baseUrl={import.meta.env.BASE_URL} />;
}
