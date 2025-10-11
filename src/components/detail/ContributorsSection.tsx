import React from "react";
import { PersonPopover } from "../PersonPopover";
import { OrganizationChip } from "../OrganizationChip";
import { HandShake, QuestionCircle } from "@solar-icons/react-perf/LineDuotone";

export interface Contributor {
  id: string;
  role?: string;
  type?: "person" | "organization";
  data?: any; // Full data object if available
}

export interface Organization {
  id: string;
  name?: string;
  shortName?: string;
  logo?: { src: string };
}

export interface ContributorsSectionProps {
  organizations?: Contributor[];
  people?: Contributor[];
  leadOrg?: Organization;
  supportingOrgs?: Organization[];
  categories?: string[];
  researchAreas?: string[];
  languages?: string[];
  showStats?: boolean;
  className?: string;
}

export const ContributorsSection: React.FC<ContributorsSectionProps> = ({
  organizations = [],
  people = [],
  leadOrg,
  supportingOrgs = [],
  categories = [],
  researchAreas = [],
  languages = [],
  showStats = true,
  className = "",
}) => {
  // Filter out contributors without data
  const validPeople = people.filter((p) => p.data);
  const validOrgs = organizations.filter((o) => o.data || o.id);

  // Don't render if there's nothing to show
  if (
    !leadOrg &&
    supportingOrgs.length === 0 &&
    validOrgs.length === 0 &&
    validPeople.length === 0
  ) {
    return null;
  }

  return (
    <section className={`contributors-section mb-8 ${className}`}>
      <div className="bg-gradient-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6">
        {/* Organizations Section */}
        {validOrgs.length > 0 && (
          <div className="organizations mb-6">
            <h3 className="text-xs font-semibold mb-3 text-color-600 dark:text-color-400 uppercase tracking-wider">
              ORGANIZATIONS
            </h3>
            <div className="flex flex-wrap gap-2">
              {validOrgs.map((contributor, index) => (
                <OrganizationChip
                  key={contributor.id || index}
                  partnerId={contributor.id}
                  partnerName={
                    contributor.data?.shortName || contributor.data?.name
                  }
                  logo={contributor.data?.images?.logo}
                  role={contributor.role}
                />
              ))}
            </div>
          </div>
        )}

        {/* People Contributors Section */}
        {validPeople.length > 0 && (
          <div className="people-contributors">
            <h3 className="text-xs font-semibold mb-3 text-color-600 dark:text-color-400 uppercase tracking-wider">
              CONTRIBUTORS
            </h3>
            <div className="flex flex-wrap gap-2">
              {validPeople.map((contributor, index) => (
                <PersonPopover
                  key={contributor.id || index}
                  person={contributor.data}
                  personId={contributor.id}
                  role={contributor.role}
                />
              ))}
            </div>
          </div>
        )}

        {/* Chips row for categories, research areas, languages */}
        {(categories.length > 0 ||
          researchAreas.length > 0 ||
          languages.length > 0) && (
          <div className="mt-6 pt-4 border-t border-accent-one/10 flex flex-wrap gap-2 text-xs text-color-600 dark:text-color-400">
            {categories.map((category, index) => (
              <ChipDisplay
                key={`cat-${index}`}
                text={category}
                variant="tertiary"
              />
            ))}
            {researchAreas.map((area, index) => (
              <ChipDisplay
                key={`area-${index}`}
                text={area}
                variant="default"
              />
            ))}
            {languages.map((lang, index) => (
              <ChipDisplay
                key={`lang-${index}`}
                text={lang}
                variant="default"
              />
            ))}
          </div>
        )}

        {/* Stats Row */}
        {showStats &&
          (leadOrg || supportingOrgs.length > 0 || validPeople.length > 0) && (
            <div className="mt-6 pt-4 border-t border-accent-one/10 flex flex-wrap gap-6 text-xs text-color-600 dark:text-color-400">
              {leadOrg && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Lead:</span>
                  <span>{leadOrg.shortName || leadOrg.name}</span>
                </div>
              )}
              {supportingOrgs.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Supporting:</span>
                  <span>
                    {supportingOrgs.length} org
                    {supportingOrgs.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {validPeople.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Contributors:</span>
                  <span>
                    {validPeople.length}{" "}
                    {validPeople.length === 1 ? "person" : "people"}
                  </span>
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  );
};

// Internal component for chip display (simpler version of BasicChip)
const ChipDisplay: React.FC<{
  text: string;
  variant?: "default" | "primary" | "secondary" | "tertiary";
}> = ({ text, variant = "default" }) => {
  const variantClasses = {
    default: "bg-surface-lighter text-accent-base border-accent-base/20",
    primary: "bg-accent-one/10 text-accent-one border-accent-one/20",
    secondary: "bg-accent-two/10 text-accent-two border-accent-two/20",
    tertiary: "bg-accent-three/10 text-accent-three border-accent-three/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]}`}
    >
      {text}
    </span>
  );
};
