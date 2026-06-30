/**
 * Thin wrapper over site-core's shared ProjectsPage layout. The layout
 * (hero, expandable hardware/software/research grids, empty states) is
 * shared; this file supplies only the site-specific connect/CTA section
 * (semio's donate block via the local ConnectSection).
 */
import ConnectSection from "@/react-pages/home/sections/ConnectSection";
import { ProjectsPage as ProjectsPageLayout } from "@semio-community/ecosystem-site-core";

interface ProjectsPageProps {
	projectsPayload: string;
}

export default function ProjectsPage({ projectsPayload }: ProjectsPageProps) {
	return (
		<ProjectsPageLayout
			projectsPayload={projectsPayload}
			baseUrl={import.meta.env.BASE_URL}
			footerSection={<ConnectSection />}
		/>
	);
}
