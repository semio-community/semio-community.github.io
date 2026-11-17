/**
 * Thin wrapper over site-core's shared ProjectsPage layout. The layout
 * (hero, expandable hardware/software/research grids, empty states) is
 * shared; the copy and data come from `projects.astro`, and this file
 * supplies only the site-specific connect/CTA section (the donate block
 * via the local ConnectSection).
 */
import ConnectSection from "@/react-pages/home/sections/ConnectSection";
import {
	type ProjectsPageContent,
	ProjectsPage as ProjectsPageLayout,
	type ProjectsPayload,
} from "@semio-community/ecosystem-site-core";

interface ProjectsPageProps {
	projects: ProjectsPayload;
	content: ProjectsPageContent;
}

export default function ProjectsPage({ projects, content }: ProjectsPageProps) {
	return (
		<ProjectsPageLayout
			projects={projects}
			content={content}
			baseUrl={import.meta.env.BASE_URL}
			footerSection={<ConnectSection />}
		/>
	);
}
