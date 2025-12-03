import React from "react";
import CMS from "decap-cms-app";
import BaseDetailLayout from "@/components/detail/BaseDetailLayout";
import ContentSection from "@/components/detail/ContentSection";
import ChipsList from "@/components/detail/ChipsList";
import {
  DetailHero,
  type DetailHeroBadge,
} from "@/components/detail/DetailHero";
import FeaturesList from "@/components/detail/FeaturesList";
import InfoCard from "@/components/detail/InfoCard";
import LinkSection from "@/components/detail/LinkSection";
import {
  PersonDetail,
  type AffiliationDisplay,
} from "@/components/detail/views/PersonDetail";
import { EventDetail } from "@/components/detail/views/EventDetail";
import { OrganizationDetail } from "@/components/detail/views/OrganizationDetail";
import Footer from "@/components/layout/Footer";
import previewStyles from "@/styles/global.css?inline";
declare const __CMS_ROOT__: string;

// Apply the same page-level chrome used by slug pages so component styles render as expected.
function applyPreviewChrome() {
  const root = document.documentElement;
  root.setAttribute("data-theme", "light");
  root.classList.add(
    "overflow-x-hidden",
    "grid",
    "scroll-pt-[72px]",
    "scroll-smooth",
    "font-sans",
    "text-text",
    "text-xl",
    "md:text-base",
    "antialiased",
    "bg-surface",
  );
  document.body.classList.add(
    "relative",
    "min-h-screen",
    "w-full",
    "bg-surface",
  );
}

if (typeof document !== "undefined") {
  applyPreviewChrome();
}

const DetailPreviewShell: React.FC<{
  children: React.ReactNode;
  mainClassName?: string;
}> = ({ children, mainClassName }) => (
  <div className="relative flex min-h-screen w-full flex-col bg-surface text-text font-sans antialiased">
    <div className="relative m-auto flex min-h-screen w-full flex-1 max-w-6xl">
      <div className="relative m-auto w-full max-w-5xl grow">
        <div className="m-auto grid min-h-screen grid-rows-[1fr_auto] px-4 md:px-8">
          <main className={`relative flex-grow ${mainClassName ?? ""}`}>
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  </div>
);

const LoadingPreview = () => (
  <DetailPreviewShell>
    <div className="p-6 text-sm text-color-700">Loading preview…</div>
  </DetailPreviewShell>
);

type PreviewProps = {
  entry: any;
  widgetFor: (field: string) => React.ReactNode;
  getAsset: (path: string) => any;
};

function safeData(entry: any) {
  if (entry?.getIn) {
    const val = entry.getIn(["data"]);
    if (val?.toJS) return val.toJS();
    return val ?? {};
  }
  return {};
}

function toAssetUrl(getAsset: PreviewProps["getAsset"], value?: string) {
  if (!value) return undefined;
  const rewriteLegacyPath = (p: string) => {
    if (p.includes("/assets/images/people/")) {
      return p.replace("/assets/images/people/", "/assets/images/avatars/");
    }
    if (p.includes("/assets/images/organizations/")) {
      const file = p.split("/").pop() || "";
      if (file.toLowerCase().includes("hero")) {
        return p.replace(
          "/assets/images/organizations/",
          "/assets/images/heroes/",
        );
      }
      return p.replace(
        "/assets/images/organizations/",
        "/assets/images/logos/",
      );
    }
    if (p.includes("/assets/images/events/")) {
      return p.replace("/assets/images/events/", "/assets/images/logos/");
    }
    if (p.includes("/assets/images/hardware/")) {
      const file = p.split("/").pop() || "";
      if (file.toLowerCase().includes("hero")) {
        return p.replace("/assets/images/hardware/", "/assets/images/heroes/");
      }
    }
    if (p.includes("/assets/images/software/")) {
      const file = p.split("/").pop() || "";
      if (file.toLowerCase().includes("hero")) {
        return p.replace("/assets/images/software/", "/assets/images/heroes/");
      }
      if (
        file.toLowerCase().includes("icon") ||
        file.toLowerCase().includes("logo")
      ) {
        return p.replace("/assets/images/software/", "/assets/images/logos/");
      }
    }
    return p;
  };

  // Rewrite Vite-style alias to a path the preview iframe can serve.
  const normalized = rewriteLegacyPath(
    value.startsWith("@/") ? value.replace(/^@\//, "/src/") : value,
  );

  // For source assets, serve /@fs in dev and the copied /admin/src/assets/ in build.
  if (normalized.startsWith("/src/assets/")) {
    if (import.meta.env.DEV && typeof __CMS_ROOT__ === "string") {
      return `/@fs${__CMS_ROOT__}${normalized}`;
    }
    return `/admin${normalized}`;
  }

  try {
    const asset = getAsset(normalized);
    const url = asset ? asset.toString() : normalized;
    if (
      url &&
      !url.startsWith("/@fs") &&
      normalized.startsWith("/src/") &&
      typeof __CMS_ROOT__ === "string"
    ) {
      return `/@fs${__CMS_ROOT__}${normalized}`;
    }
    return url;
  } catch (err) {
    if (normalized.startsWith("/src/") && typeof __CMS_ROOT__ === "string") {
      return `/@fs${__CMS_ROOT__}${normalized}`;
    }
    return normalized;
  }
}

const PeoplePreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const images = {
    avatar: toAssetUrl(getAsset, data?.images?.avatar || data?.avatar),
    hero: toAssetUrl(getAsset, data?.images?.hero || data?.hero),
  };
  const name = data?.honorific ? `${data.honorific} ${data.name}` : data?.name;
  const links = data?.links || {};
  const affiliations = (data?.affiliations || []) as Array<{
    organizationId?: string;
    role?: string;
    department?: string;
    endDate?: string | null;
  }>;

  const badges: DetailHeroBadge[] = [];
  if (data?.pronouns) {
    badges.push({
      text: data.pronouns,
      color: "gray" as const,
      variant: "outline" as const,
    });
  }
  if (data?.featured) {
    badges.push({ text: "Featured", color: "accent" as const });
  }

  const expertise = data?.expertise || [];
  const bio = data?.bio;
  const currentAffiliations: AffiliationDisplay[] = affiliations
    .filter((aff) => !aff?.endDate)
    .map((aff) => ({
      organizationId: aff.organizationId || "Organization",
      organizationName: aff.organizationId,
      organizationImages: undefined,
      role: aff.role,
      department: aff.department,
    }));
  const pastAffiliations: AffiliationDisplay[] = affiliations
    .filter((aff) => aff?.endDate)
    .map((aff) => ({
      organizationId: aff.organizationId || "Organization",
      organizationName: aff.organizationId,
      organizationImages: undefined,
      role: aff.role,
      department: aff.department,
    }));

  return (
    <DetailPreviewShell>
      <PersonDetail
        data={{
          ...data,
          images: {
            ...data.images,
            avatar: images.avatar,
            hero: images.hero,
          },
        }}
        fullName={name || "Person"}
        badges={badges}
        links={links}
        bio={bio}
        expertise={expertise}
        currentAffiliations={currentAffiliations}
        pastAffiliations={pastAffiliations}
        relatedContent={undefined}
        relatedPeople={[]}
      />
    </DetailPreviewShell>
  );
};

const EventPreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const gallery =
    data?.images?.gallery?.map((img: string) => toAssetUrl(getAsset, img)) ||
    undefined;

  const normalizedData = {
    ...data,
    images: {
      ...data?.images,
      logo,
      hero,
      gallery,
    },
  };

  return (
    <DetailPreviewShell>
      <EventDetail data={normalizedData} relatedEvents={[]} />
    </DetailPreviewShell>
  );
};

const OrganizationPreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const gallery =
    data?.images?.gallery?.map((img: string) => toAssetUrl(getAsset, img)) ||
    undefined;

  const normalizedData = {
    ...data,
    images: { ...data.images, logo, hero, gallery },
  };

  return (
    <DetailPreviewShell>
      <OrganizationDetail
        data={normalizedData}
        relatedContent={{
          research: [],
          hardware: [],
          software: [],
          events: [],
        }}
        relatedOrganizations={[]}
        keyContacts={[]}
      />
    </DetailPreviewShell>
  );
};

const HardwarePreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const gallery = ((data?.images?.gallery || []) as string[])
    .map((img) => toAssetUrl(getAsset, img))
    .filter(Boolean) as string[];
  const features = data?.features || [];
  const topics = data?.topics || [];

  return (
    <DetailPreviewShell>
      <BaseDetailLayout
        hero={
          <DetailHero
            title={data?.name || "Hardware"}
            subtitle={data?.category}
            image={hero}
            logo={logo}
            entityType="hardware"
            logoText={data?.name}
            badges={
              [
                data?.status
                  ? { text: data.status, color: "gray" as const }
                  : null,
              ].filter(Boolean) as DetailHeroBadge[]
            }
          />
        }
        description={
          data?.description || data?.shortDescription ? (
            <ContentSection
              title="DESCRIPTION"
              content={data?.description || data?.shortDescription}
            />
          ) : null
        }
        features={
          features.length > 0 ? (
            <FeaturesList title="KEY FEATURES" features={features} />
          ) : null
        }
        tags={
          topics.length > 0 ? (
            <ChipsList title="TOPICS" items={topics} variant="primary" />
          ) : null
        }
        related={
          gallery.length > 0 ? (
            <InfoCard title="GALLERY">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((img, idx) =>
                  img ? (
                    <img
                      key={idx}
                      src={img}
                      alt={data?.name || "Hardware"}
                      className="rounded-lg border border-accent-one/20"
                    />
                  ) : null,
                )}
              </div>
            </InfoCard>
          ) : null
        }
      />
    </DetailPreviewShell>
  );
};

const SoftwarePreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const features = data?.features || [];
  const topics = data?.topics || [];
  const languages = data?.language || [];
  const platforms = data?.platform || [];

  return (
    <DetailPreviewShell>
      <BaseDetailLayout
        hero={
          <DetailHero
            title={data?.name || "Software"}
            subtitle={data?.category}
            image={hero}
            logo={logo}
            entityType="software"
            logoText={data?.name}
            badges={
              [
                data?.status
                  ? { text: data.status, color: "gray" as const }
                  : null,
              ].filter(Boolean) as DetailHeroBadge[]
            }
          />
        }
        description={
          data?.description || data?.shortDescription ? (
            <ContentSection
              title="DESCRIPTION"
              content={data?.description || data?.shortDescription}
            />
          ) : null
        }
        metadata={
          (languages.length > 0 || platforms.length > 0) && (
            <ChipsList
              title="TECHNOLOGIES"
              groups={[
                ...(languages.length > 0
                  ? [
                      {
                        title: "LANGUAGES",
                        items: languages,
                        variant: "primary" as const,
                      },
                    ]
                  : []),
                ...(platforms.length > 0
                  ? [
                      {
                        title: "PLATFORMS",
                        items: platforms,
                        variant: "secondary" as const,
                      },
                    ]
                  : []),
              ]}
            />
          )
        }
        features={
          features.length > 0 ? (
            <FeaturesList title="KEY FEATURES" features={features} />
          ) : null
        }
        tags={
          topics.length > 0 ? (
            <ChipsList title="TOPICS" items={topics} variant="primary" />
          ) : null
        }
      />
    </DetailPreviewShell>
  );
};

const ResearchPreview: React.FC<PreviewProps> = ({ entry }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const topics = data?.topics || [];
  const hasLinks = data?.links && Object.keys(data.links || {}).length > 0;
  const badges =
    data?.publishDate && String(data.publishDate)
      ? [
          {
            text: String(data.publishDate).slice(0, 10),
            color: "gray" as const,
            variant: "outline" as const,
          },
        ]
      : [];

  return (
    <DetailPreviewShell>
      <BaseDetailLayout
        hero={
          <DetailHero
            title={data?.title || "Research"}
            subtitle={data?.type}
            entityType="research"
            logoText={data?.title}
            badges={badges}
          />
        }
        description={
          data?.description || hasLinks ? (
            <>
              <ContentSection title="SUMMARY" content={data?.description} />
              {hasLinks ? (
                <div className="mt-6">
                  <LinkSection links={data.links} size="md" className="gap-1" />
                </div>
              ) : null}
            </>
          ) : null
        }
        tags={
          topics.length > 0 ? (
            <ChipsList title="TOPICS" items={topics} variant="primary" />
          ) : null
        }
      />
    </DetailPreviewShell>
  );
};

// Inline the compiled site CSS so the preview iframe matches live spacing/borders.
CMS.registerPreviewStyle(previewStyles, { raw: true });
const safeTemplate =
  (Component: React.FC<PreviewProps>) => (props: PreviewProps) => {
    try {
      if (!props?.entry || !props.entry.get) {
        return <LoadingPreview />;
      }
      return <Component {...props} />;
    } catch (err) {
      console.error("Preview render error", err);
      return (
        <div style={{ padding: "1rem", color: "#b91c1c" }}>
          Preview error: {(err as Error)?.message ?? String(err)}
        </div>
      );
    }
  };

CMS.registerPreviewTemplate("people", safeTemplate(PeoplePreview));
CMS.registerPreviewTemplate("events", safeTemplate(EventPreview));
CMS.registerPreviewTemplate("organizations", safeTemplate(OrganizationPreview));
CMS.registerPreviewTemplate("hardware", safeTemplate(HardwarePreview));
CMS.registerPreviewTemplate("software", safeTemplate(SoftwarePreview));
CMS.registerPreviewTemplate("research", safeTemplate(ResearchPreview));

// Boot the CMS when bundled (needed when not using the CDN auto-init script).
CMS.init();
