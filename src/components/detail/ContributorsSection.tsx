import React from "react";
import { PersonPopover } from "../PersonPopover";
import BasicChip from "../BasicChip.astro";

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
                  organization={contributor}
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

// Internal component for organization chips
const OrganizationChip: React.FC<{ organization: Contributor }> = ({
  organization,
}) => {
  const data = organization.data;
  const partnerId = organization.id;
  const role = organization.role;

  if (!data && !partnerId) {
    return (
      <span className="inline-flex items-center gap-2 px-2 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
        <svg
          className="w-5 h-5 text-neutral-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
        </svg>
        <span className="text-sm text-neutral-500">Unknown Organization</span>
      </span>
    );
  }

  return (
    <a
      href={`/partners/${partnerId}`}
      className="org-chip inline-flex items-center gap-2 px-3 py-1.5 bg-surface-lighter rounded-full border-2 border-accent-one/40 hover:border-accent-two transition-all no-underline group"
    >
      {data?.logo ? (
        <img
          src={data.logo.src}
          alt={data.name}
          className="w-6 h-6 rounded object-contain"
        />
      ) : (
        <svg
          className="w-6 h-6 text-accent-one group-hover:text-accent-two transition-colors"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
        </svg>
      )}
      <span className="text-sm font-medium transition-colors">
        {data?.shortName || data?.name || partnerId}
      </span>
      {role && (
        <span className="text-xs text-color-600 dark:text-color-400">
          • {role}
        </span>
      )}
    </a>
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
