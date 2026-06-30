import HugeUserGroup from "@/components/icons/HugeUserGroup";
import {
	CallToActionButton,
	MarketingPage,
	type MarketingPageContent,
} from "@semio-community/ecosystem-site-core";
import {
	BoxMinimalistic,
	CartLarge2,
	Chart2,
	Code2,
	Database,
	Delivery,
	Document,
	HeadphonesRound,
	Rocket,
	SettingsMinimalistic,
	ShieldCheck,
	SquareAcademicCap,
	TestTube,
	UserHandUp,
	UsersGroupTwoRounded,
	VerifiedCheck,
} from "@solar-icons/react-perf/LineDuotone";

const FORM_URL = "https://forms.gle/5iiaThSsGUMzXWsu6";

/** Centered "intro paragraph + request button" block that follows each
 * service-category grid. Bespoke spacing (`mt-12`) → a `custom` block. */
const requestCta = (
	text: string,
	label: string,
	variant?: "secondary" | "tertiary",
) =>
	({
		kind: "custom" as const,
		node: (
			<div className="text-center mt-12">
				<p className="text-color-600 dark:text-color-400 mb-6">{text}</p>
				<CallToActionButton href={FORM_URL} size="large" variant={variant}>
					{label}
				</CallToActionButton>
			</div>
		),
	});

const content: MarketingPageContent = {
	hero: {
		icon: <UserHandUp className="w-16 h-16 text-accent-two" />,
		title: "Services",
		description:
			"Comprehensive support services to accelerate your robotics development, from hardware manufacturing to software deployment and research facilitation.",
		actions: [
			{ label: "Hardware Services", href: "#hardware", indicatorText: "6" },
			{ label: "Software Services", href: "#software", variant: "secondary", indicatorText: "6" },
			{ label: "Research Services", href: "#research", variant: "tertiary", indicatorText: "6" },
		],
	},
	sections: [
		{
			id: "hardware",
			title: "Hardware Services",
			subtitle:
				"Comprehensive support for scaling robotics hardware development and deployment",
			variant: "primary",
			containerClassName: "max-w-6xl mx-auto",
			blocks: [
				{
					kind: "featureCards",
					variant: "primary",
					gridClassName: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
					items: [
						{ icon: SettingsMinimalistic, title: "Design", description: "Expert guidance on making your robotic designs ready for scale manufacturing" },
						{ icon: BoxMinimalistic, title: "Manufacturing", description: "End-to-end scale manufacturing services for robotics hardware" },
						{ icon: Database, title: "Inventory", description: "Storage and inventory solutions for robotics components" },
						{ icon: CartLarge2, title: "Sales", description: "Make your hardware available to the broader robotics community" },
						{ icon: Delivery, title: "Shipping", description: "Worldwide distribution of your robotics hardware platforms" },
						{ icon: HeadphonesRound, title: "Support", description: "Ongoing technical support for your robotics hardware platforms" },
					],
				},
				requestCta(
					"From initial design to global distribution, we provide end-to-end support for your robotics hardware projects.",
					"Request Hardware Services",
				),
			],
		},
		{
			id: "software",
			title: "Software Services",
			subtitle: "Supporting the transition from research code to production-ready systems",
			variant: "secondary",
			containerClassName: "max-w-6xl mx-auto",
			blocks: [
				{
					kind: "featureCards",
					variant: "secondary",
					gridClassName: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
					items: [
						{ icon: Code2, title: "Code Refactoring", description: "Transform research code into production-ready software with industry best practices" },
						{ icon: UsersGroupTwoRounded, title: "Community Pool", description: "Contribute to open projects and earn rewards for solving community challenges" },
						{ icon: ShieldCheck, title: "Quality Assurance", description: "Comprehensive testing and validation for robotics applications" },
						{ icon: Document, title: "Documentation", description: "Clear, comprehensive documentation for all software projects" },
						{ icon: SquareAcademicCap, title: "Training", description: "Learn best practices for developing HRI software systems" },
						{ icon: HeadphonesRound, title: "Support", description: "Ongoing technical support for your robotics software tools and frameworks" },
					],
				},
				requestCta(
					"Transform your research code into robust, production-ready systems with our comprehensive software services.",
					"Request Software Services",
					"secondary",
				),
			],
		},
		{
			id: "research",
			title: "Research Services",
			subtitle: "Comprehensive support for conducting replicable HRI research and studies",
			variant: "tertiary",
			containerClassName: "max-w-5xl mx-auto",
			blocks: [
				{
					kind: "featureCards",
					variant: "tertiary",
					items: [
						{ icon: TestTube, title: "Replication Studies", description: "Plan, pre-register, and execute confirmatory studies with standardized protocols" },
						{ icon: Document, title: "Grants", description: "Identify, develop, and coordinate submissions for research funding" },
						{ icon: UsersGroupTwoRounded, title: "Broader Impacts", description: "Design and deliver activities and artifacts that meet program requirements" },
						{ icon: SquareAcademicCap, title: "Events", description: "Plan, host, and support workshops, user studies, and symposia for the community" },
						{ icon: HugeUserGroup, title: "Populations", description: "Recruit diverse in-person and remote participants, including special populations" },
						{ icon: Chart2, title: "Analysis", description: "Build robust pipelines for data cleaning, statistical modeling, and visualization" },
					],
				},
				requestCta(
					"Enable reproducible, scalable research with our comprehensive study support services.",
					"Request Research Services",
					"tertiary",
				),
			],
		},
		{
			id: "benefits",
			title: "Why Choose Our Services?",
			subtitle: "Benefits of working with the Semio Community",
			containerClassName: "max-w-5xl mx-auto",
			blocks: [
				{
					kind: "benefits",
					items: [
						{ icon: VerifiedCheck, iconClassName: "w-10 h-10 text-accent-one shrink-0", title: "Community-Driven", description: "Benefit from collective expertise and shared resources across the entire HRI community." },
						{ icon: Rocket, iconClassName: "w-10 h-10 text-accent-two shrink-0", title: "Accelerate Development", description: "Speed up your time to market with proven solutions and expert guidance." },
						{ icon: ShieldCheck, iconClassName: "w-10 h-10 text-special shrink-0", title: "Quality Assurance", description: "Ensure reliability and robustness with industry-standard testing and validation." },
						{ icon: UsersGroupTwoRounded, iconClassName: "w-10 h-10 text-green-500 shrink-0", title: "Global Network", description: "Connect with researchers, developers, and industry partners worldwide." },
					],
				},
			],
		},
		{
			id: "process",
			title: "How It Works",
			subtitle: "Simple steps to access our services",
			containerClassName: "max-w-4xl mx-auto",
			blocks: [
				{
					kind: "steps",
					items: [
						{ title: "Contact Us", description: "Reach out through our Get Involved page to discuss your project needs and requirements." },
						{ title: "Consultation", description: "We'll work with you to understand your goals and recommend the best services for your needs." },
						{ title: "Implementation", description: "Our expert team will deliver the services, keeping you informed throughout the process." },
						{ title: "Ongoing Support", description: "Continue to benefit from community support and updates as your project evolves." },
					],
				},
			],
		},
		{
			id: "get-started",
			containerClassName: "max-w-4xl mx-auto text-center",
			blocks: [
				{
					kind: "heading",
					as: "h2",
					text: "Ready to Get Started?",
					className: "text-3xl font-bold mb-4",
				},
				{
					kind: "prose",
					content:
						"Whether you're developing hardware, software, or conducting research, our services can help you achieve your goals faster and more effectively.",
					className: "text-lg mb-8 text-color-600 dark:text-color-400",
				},
				{
					kind: "cta",
					className: "flex flex-wrap justify-center gap-4",
					buttons: [{ href: FORM_URL, label: "Request Services" }],
				},
			],
		},
	],
};

export default function ServicesPage() {
	return <MarketingPage content={content} baseUrl={import.meta.env.BASE_URL} />;
}
