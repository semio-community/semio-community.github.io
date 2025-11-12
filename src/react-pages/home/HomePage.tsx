import React from "react";

export interface HomePageProps {
  projectCount: number;
  featuredEventCount: number;
  /**
   * Optional count to display for services (if not provided, a sensible default is used).
   */
  servicesCount?: number;
}

/**
 * A minimal, SSR-only React page component that demonstrates how to render
 * page-level UI from an Astro route using the shared BaseLayout.
 *
 * - Do not perform data fetching in this component.
 * - Keep it pure and deterministic; receive all data via props.
 * - Hydrate only leaf components that truly require interactivity (none here).
 */
export default function HomePage({
  projectCount,
  featuredEventCount,
  servicesCount = 18,
}: HomePageProps) {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative pt-10 md:pt-14 lg:pt-4 mb-2">
        <div className="text-center mx-auto max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4">
            <span className="text-accent-three font-semibold uppercase tracking-wide">
              Reproducible
            </span>{" "}
            <span className="text-accent-one font-semibold uppercase tracking-wide">
              Robot
            </span>{" "}
            <span className="text-accent-two font-semibold uppercase tracking-wide">
              Science
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-color-600 dark:text-color-400 leading-relaxed px-3 sm:px-0">
            A nonprofit supporting the{" "}
            <span className="font-medium text-foreground">
              science and systems
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              human-centered robotics
            </span>{" "}
            and{" "}
            <span className="font-medium text-foreground">
              artificial intelligence
            </span>
            .
          </p>

          {/* Quick CTAs (static links; no hydration required) */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-accent-one/30 bg-accent-one/10 px-4 py-2 text-accent-one hover:bg-accent-one/15 transition"
            >
              Active Projects
              <span className="inline-flex items-center justify-center rounded-full bg-accent-one/20 px-2 py-0.5 text-xs text-accent-one">
                {projectCount}
              </span>
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-accent-two/30 bg-accent-two/10 px-4 py-2 text-accent-two hover:bg-accent-two/15 transition"
            >
              Available Services
              <span className="inline-flex items-center justify-center rounded-full bg-accent-two/20 px-2 py-0.5 text-xs text-accent-two">
                {servicesCount}
              </span>
            </a>
            <a
              href="/events"
              className="inline-flex items-center gap-2 rounded-lg border border-accent-three/30 bg-accent-three/10 px-4 py-2 text-accent-three hover:bg-accent-three/15 transition"
            >
              Upcoming Events
              <span className="inline-flex items-center justify-center rounded-full bg-accent-three/20 px-2 py-0.5 text-xs text-accent-three">
                {featuredEventCount}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Program stats */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Active Projects"
            value={projectCount}
            hint="Hardware · Software · Research"
          />
          <StatCard
            title="Upcoming Events"
            value={featuredEventCount}
            hint="Conferences · Meetups"
          />
          <StatCard
            title="Available Services"
            value={servicesCount}
            hint="Consulting · Infrastructure"
          />
        </div>
      </section>

      {/* Programs overview */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Our Programs
          </h2>
          <p className="text-sm text-color-600 dark:text-color-400 mt-2">
            Discover community-driven robotics hardware, open-source AI
            software, and reproducible research.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <LinkTile
            title="Hardware"
            description="Community-driven robotics platforms"
            links={[
              { label: "Projects", href: "/projects#hardware" },
              { label: "Services", href: "/services#hardware" },
            ]}
          />
          <LinkTile
            title="Software"
            description="Open-source AI tools and frameworks"
            links={[
              { label: "Projects", href: "/projects#software" },
              { label: "Services", href: "/services#software" },
            ]}
          />
          <LinkTile
            title="Research"
            description="Replicable science and studies"
            links={[
              { label: "Projects", href: "/projects#research" },
              { label: "Services", href: "/services#research" },
            ]}
          />
        </div>
      </section>

      {/* Partners teaser */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-0">
        <div className="rounded-lg border border-special bg-special-lighter p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground text-center mb-3">
            Our Partners
          </h2>
          <p className="text-center text-color-600 dark:text-color-400">
            We collaborate across academia, industry, and the public sector to
            drive ethical, accessible, and impactful robotics and AI.
          </p>
          <div className="flex justify-center mt-6">
            <a
              href="/contributors#partners"
              className="inline-flex items-center rounded-md border border-accent-one/30 px-4 py-2 text-accent-one hover:bg-accent-one/10 transition"
            >
              Meet our partners
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-color-200/50 dark:border-color-800/60 bg-surface/60 p-5">
      <div className="text-sm text-color-600 dark:text-color-400">{title}</div>
      <div className="text-3xl font-semibold text-foreground mt-1">{value}</div>
      {hint ? (
        <div className="text-xs text-color-500 dark:text-color-500 mt-1">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function LinkTile({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="rounded-lg border border-color-200/50 dark:border-color-800/60 bg-surface/60 p-5 h-full">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-color-600 dark:text-color-400 mt-1">
        {description}
      </p>
      <div className="flex flex-wrap gap-3 mt-4">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm inline-flex items-center gap-1 text-accent-two hover:underline"
          >
            {l.label}
            <span aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
