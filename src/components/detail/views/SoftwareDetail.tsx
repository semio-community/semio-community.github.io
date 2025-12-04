import React from "react";
import type { CollectionEntry } from "astro:content";
import BaseDetailLayout from "@/components/detail/BaseDetailLayout";
import { DetailHero } from "@/components/detail/DetailHero";
import ContentSection from "@/components/detail/ContentSection";
import LinkSection from "@/components/detail/LinkSection";
import SpecificationsList from "@/components/detail/SpecificationsList";
import FeaturesList from "@/components/detail/FeaturesList";
import ChipsList from "@/components/detail/ChipsList";
import { RelatedItemsGrid } from "@/components/detail/RelatedItemsGrid";
import { OrganizationChip } from "@/components/ui/OrganizationChip";
import { PersonPopover } from "@/components/people/PersonPopover";
import BasicChip from "@/components/ui/BasicChip";
import { getStatusColor, getStatusLabel } from "@/config/statusConfig";
import { resolveLogoAsset } from "@/utils/images";

type SoftwareData = CollectionEntry<"software">["data"];

export type SoftwareOrganizationContributor = {
  organizationId: string;
  role?: string;
  primary?: boolean;
  data?: CollectionEntry<"organizations">["data"];
};

export type SoftwarePersonContributor = {
  personId: string;
  person: Parameters<typeof PersonPopover>[0]["person"];
  role?: string;
  currentAffiliation?: {
    organizationId: string;
    partnerName?: string;
    role: string;
  };
};

export interface SoftwareDetailProps {
  data: SoftwareData;
  organizationContributors?: SoftwareOrganizationContributor[];
  peopleContributors?: SoftwarePersonContributor[];
  relatedSoftware?: CollectionEntry<"software">[];
}

const CATEGORY_LABELS: Record<string, string> = {
  framework: "Framework",
  library: "Library",
  tool: "Tool",
  simulation: "Simulation",
  dataset: "Dataset",
  model: "Model",
};

export function SoftwareDetail({
  data,
  organizationContributors = [],
  peopleContributors = [],
  relatedSoftware = [],
}: SoftwareDetailProps) {
  const badges = [
    data.status && {
      text: getStatusLabel(data.status),
      color: getStatusColor(data.status, "chip") as any,
      variant: "solid" as const,
    },
    data.license && {
      text: data.license,
      color: "blue" as const,
      variant: "outline" as const,
    },
  ].filter(Boolean) as Array<{
    text: string;
    color: "green" | "blue" | "orange" | "red" | "accent" | "yellow" | "gray";
    variant: "solid" | "outline";
  }>;

  const topics = data.topics ?? [];
  const languages = data.language ?? [];
  const platforms = data.platform ?? [];

  const requirementItems: Array<{ label: string; value: string }> = [];
  if (data.requirements?.runtime) {
    requirementItems.push({
      label: "Runtime",
      value: Array.isArray(data.requirements.runtime)
        ? data.requirements.runtime.join(", ")
        : data.requirements.runtime,
    });
  }
  if (data.requirements?.hardware) {
    requirementItems.push({
      label: "Hardware",
      value: Array.isArray(data.requirements.hardware)
        ? data.requirements.hardware.join(", ")
        : data.requirements.hardware,
    });
  }
  if (data.requirements?.dependencies) {
    requirementItems.push({
      label: "Dependencies",
      value: Array.isArray(data.requirements.dependencies)
        ? data.requirements.dependencies.join(", ")
        : data.requirements.dependencies,
    });
  }

  const hasContributors =
    organizationContributors.length > 0 || peopleContributors.length > 0;
  const primaryOrganization = organizationContributors.find(
    (contributor) => contributor.primary,
  );
  const supportingOrganizations = organizationContributors.filter(
    (contributor) => !contributor.primary,
  );

  const technologyGroups = [];
  if (languages.length > 0) {
    technologyGroups.push({
      title: "LANGUAGES",
      items: languages,
      variant: "primary" as const,
    });
  }
  if (platforms.length > 0) {
    technologyGroups.push({
      title: "PLATFORMS",
      items: platforms,
      variant: "secondary" as const,
    });
  }

  const hasRelated = relatedSoftware.length > 0;

  return (
    <BaseDetailLayout
      hero={
        <DetailHero
          image={data.images?.hero}
          title={data.name}
          subtitle={data.shortDescription}
          badges={badges}
          featuredState={data.featured ? "featured" : undefined}
          entityType="software"
          logo={resolveLogoAsset(data.images)}
        />
      }
      links={
        data.links && Object.keys(data.links).length > 0 ? (
          <LinkSection links={data.links} size="md" className="gap-1" />
        ) : null
      }
      description={
        <ContentSection title="DESCRIPTION" content={data.description} />
      }
      contributors={
        hasContributors ? (
          <div className="bg-gradient-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6 backdrop-blur-lg">
            {organizationContributors.length > 0 && (
              <div className="organizations mb-6">
                <h3 className="text-xs font-semibold mb-3 text-color-600 dark:text-color-400 uppercase tracking-wider">
                  ORGANIZATIONS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {organizationContributors.map((contributor) => (
                    <OrganizationChip
                      key={contributor.organizationId}
                      partnerId={contributor.organizationId}
                      partnerName={
                        contributor.data?.shortName ||
                        contributor.data?.name ||
                        contributor.organizationId
                      }
                      logo={resolveLogoAsset(contributor.data?.images)}
                      role={contributor.role || "Contributing Organization"}
                    />
                  ))}
                </div>
              </div>
            )}

            {peopleContributors.length > 0 && (
              <div className="people-contributors">
                <h3 className="text-xs font-semibold mb-3 text-color-600 dark:text-color-400 uppercase tracking-wider">
                  CONTRIBUTORS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {peopleContributors
                    .filter((contributor) => contributor.person)
                    .map((contributor) => (
                      <PersonPopover
                        key={contributor.personId}
                        personId={contributor.personId}
                        person={contributor.person}
                        role={contributor.role}
                        currentAffiliation={contributor.currentAffiliation}
                      />
                    ))}
                </div>
              </div>
            )}

            {(data.category || data.language?.length) && (
              <div className="mt-6 pt-4 border-t border-accent-one/10 flex flex-wrap gap-2">
                {data.category && (
                  <BasicChip
                    text={CATEGORY_LABELS[data.category] || data.category}
                    variant="tertiary"
                  />
                )}
                {data.language?.map((lang) => (
                  <BasicChip key={lang} text={lang} variant="default" />
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-accent-one/10 flex flex-wrap gap-6 text-xs text-color-600 dark:text-color-400">
              {primaryOrganization && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Lead:</span>
                  <span>
                    {primaryOrganization.data?.shortName ||
                      primaryOrganization.data?.name ||
                      primaryOrganization.organizationId}
                  </span>
                </div>
              )}
              {supportingOrganizations.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Supporting:</span>
                  <span>
                    {supportingOrganizations.length} org
                    {supportingOrganizations.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {peopleContributors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Contributors:</span>
                  <span>
                    {peopleContributors.length}{" "}
                    {peopleContributors.length === 1 ? "person" : "people"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : null
      }
      specifications={
        requirementItems.length > 0 ? (
          <SpecificationsList title="SYSTEM REQUIREMENTS" items={requirementItems} />
        ) : null
      }
      metadata={
        technologyGroups.length > 0 ? (
          <ChipsList title="TECHNOLOGIES" groups={technologyGroups} />
        ) : null
      }
      features={
        data.features && data.features.length > 0 ? (
          <FeaturesList
            title="KEY FEATURES"
            features={data.features}
            featureIcon="solar:star-bold-duotone"
          />
        ) : null
      }
      tags={
        topics.length > 0 ? (
          <ChipsList title="TOPICS" items={topics} variant="primary" />
        ) : null
      }
      related={
        hasRelated ? (
          <RelatedItemsGrid
            title="Related Software"
            subtitle="Discover similar tools and frameworks"
            items={relatedSoftware}
            itemType="software"
            columns={3}
          />
        ) : null
      }
    />
  );
}
