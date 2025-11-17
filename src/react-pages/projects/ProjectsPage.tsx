import React from "react";
import Section from "@/components/sections/Section";
import HeroHeader from "@/components/hero/HeroHeader";
import { Icon } from "@/components/ui/Icon";
import { HardwareCard } from "@/components/cards/HardwareCard";
import { SoftwareCard } from "@/components/cards/SoftwareCard";
import { ResearchCard } from "@/components/cards/ResearchCard";
import type { CollectionEntry } from "astro:content";
import { TestTube } from "@solar-icons/react-perf/LineDuotone";

interface ProjectsPageProps {
  meta: {
    title: string;
    description: string;
  };
  hardware: CollectionEntry<"hardware">[];
  software: CollectionEntry<"software">[];
  research: CollectionEntry<"research">[];
}

export default function ProjectsPage({
  meta,
  hardware,
  software,
  research,
}: ProjectsPageProps) {
  return (
    <div className="relative pt-16 md:pt-20 lg:pt-4 space-y-12">
      <HeroHeader
        fullBleed
        fullBleedClassName="relative mb-8 sm:mb-12"
        icon={<TestTube className="w-16 h-16 text-accent-two" />}
        title={meta.title}
        description={meta.description}
        actions={[
          {
            label: "Hardware Projects",
            href: "#hardware",
            variant: "primary",
            indicatorText: hardware.length.toString(),
          },
          {
            label: "Software Projects",
            href: "#software",
            variant: "secondary",
            indicatorText: software.length.toString(),
          },
          {
            label: "Research Projects",
            href: "#research",
            variant: "tertiary",
            indicatorText: research.length.toString(),
          },
        ]}
      />

      <ProjectsSection
        id="hardware"
        title="Hardware Projects"
        subtitle="Community-driven robotics hardware for research and education"
        variant="primary"
        items={hardware}
        emptyIcon="solar:box-minimalistic-line-duotone"
        emptyMessage="Hardware platforms coming soon! Check back later for updates."
        renderCard={(hw) => <HardwareCard hardwareId={hw.id} data={hw.data} />}
      />

      <ProjectsSection
        id="software"
        title="Software Projects"
        subtitle="Comprehensive software tools for every aspect of HRI development"
        variant="secondary"
        items={software}
        emptyIcon="solar:code-2-line-duotone"
        emptyMessage="Software packages coming soon! Check back later for updates."
        renderCard={(sw) => <SoftwareCard softwareId={sw.id} data={sw.data} />}
      />

      <ProjectsSection
        id="research"
        title="Research Projects"
        subtitle="Reproducible science and studies advancing the field of human-robot interaction"
        variant="tertiary"
        items={research}
        emptyIcon="solar:document-add-line-duotone"
        emptyMessage="Research publications coming soon! Check back later for updates."
        renderCard={(st) => <ResearchCard researchId={st.id} data={st.data} />}
      />
    </div>
  );
}

interface ProjectsSectionProps<T> {
  id: string;
  title: string;
  subtitle: string;
  variant: "primary" | "secondary" | "tertiary";
  items: T[];
  emptyIcon: string;
  emptyMessage: string;
  renderCard: (item: T) => React.ReactNode;
}

function ProjectsSection<T>({
  id,
  title,
  subtitle,
  variant,
  items,
  emptyIcon,
  emptyMessage,
  renderCard,
}: ProjectsSectionProps<T>) {
  return (
    <Section id={id} title={title} subtitle={subtitle} variant={variant}>
      <div className="max-w-6xl mx-auto">
        {items.length > 0 ? (
          <ExpandableGrid>
            {items.map((item) => renderCard(item))}
          </ExpandableGrid>
        ) : (
          <EmptyState icon={emptyIcon} message={emptyMessage} />
        )}
      </div>
    </Section>
  );
}

function ExpandableGrid({ children }: { children: React.ReactNode }) {
  return (
    <div data-expandable-section data-initial-count="6">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-items-container
      >
        {React.Children.map(children, (child, index) => (
          <div
            data-expandable-item
            data-index={index}
            className={index >= 6 ? "hidden" : ""}
          >
            {child}
          </div>
        ))}
      </div>
      {React.Children.count(children) > 6 && <ExpandButton />}
    </div>
  );
}

function ExpandButton() {
  return (
    <div className="text-center mt-8">
      <button
        data-expand-button
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-base/10 hover:bg-accent-base/20 rounded-lg font-medium text-accent-base transition-all"
      >
        <span data-expand-text>View All</span>
        <span data-collapse-text className="hidden">
          Show Less
        </span>
        <Icon
          name="solar:alt-arrow-down-line-duotone"
          className="w-4 h-4 transition-transform"
          data-expand-icon
        />
      </button>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-12">
      <Icon name={icon} className="w-24 h-24 mx-auto mb-4 text-color-300" />
      <p className="text-lg text-color-600 dark:text-color-400">{message}</p>
    </div>
  );
}
