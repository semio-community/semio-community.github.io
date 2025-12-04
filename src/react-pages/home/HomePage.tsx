import React from "react";
import HeroSection from "@/react-pages/home/sections/HeroSection";
import MissionSection from "@/react-pages/home/sections/MissionSection";
import ProgramsSection from "@/react-pages/home/sections/ProgramsSection";
import PartnersSection from "@/react-pages/home/sections/PartnersSection";
import ConnectSection from "@/react-pages/home/sections/ConnectSection";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { url } from "@/utils/url";

export interface HomePageProps {
  projectCount: number;
  featuredEventCount: number;
}

export default function HomePage({
  projectCount,
  featuredEventCount,
}: HomePageProps) {
  return (
    <div className="space-y-12">
      <div
        className="relative pt-16 md:pt-20 lg:pt-4 mb-8 sm:mb-12"
        style={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <HeroSection
          projectCount={projectCount}
          upcomingEventCount={featuredEventCount}
        />
      </div>

      <MissionSection />

      <ProgramsSection
        items={[
          {
            title: "Hardware",
            description: "Community-driven robotics hardware platforms",
            links: [
              { label: "Projects", href: "/projects#hardware" },
              { label: "Services", href: "/services#hardware" },
            ],
          },
          {
            title: "Software",
            description: "Open-source AI software tools and frameworks",
            links: [
              { label: "Projects", href: "/projects#software" },
              { label: "Services", href: "/services#software" },
            ],
          },
          {
            title: "Research",
            description: "Reproducible scientific research and studies",
            links: [
              { label: "Projects", href: url("/projects#research") },
              { label: "Services", href: url("/services#research") },
            ],
          },
        ]}
      >
        <p className="text-center text-color-600 dark:text-color-400 mb-4">
          Gather with the community at our events, which explore on a broad
          range of topics, including, but not limited to, human-centered robot
          hardware, software, and research that, with reasonable effort, can be
          incorporated into the design, development, or deployment of an HRI
          system.
        </p>
        <CallToActionButton
          href={url("/events")}
          size="large"
          variant="default"
        >
          Upcoming Events
        </CallToActionButton>
      </ProgramsSection>

      <PartnersSection />
      <ConnectSection />
    </div>
  );
}
