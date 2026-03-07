import React from "react";
import { EventsPage as SharedEventsPage, PageSection as Section, CallToActionButton } from "@semio-community/ecosystem-site-core";
import { Calendar } from "@solar-icons/react-perf/LineDuotone";

export type { EventsPageProps } from "@semio-community/ecosystem-site-core";

const footerSection = (
  <Section id="events-contribute" title="Partner for an Event">
    <div className="max-w-4xl mx-auto text-center">
      <p className="mb-8 -mt-6 md:-mt-8">
        Planning a conference, workshop, or other community gathering?
        <br />
        <br className="md:hidden" />
        Partner with Semio Community to reach a broader robotics/AI audience.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <CallToActionButton href="https://forms.gle/5iiaThSsGUMzXWsu6" size="large">
          Request Event Services
        </CallToActionButton>
      </div>
    </div>
  </Section>
);

export default function EventsPage({ children }: { children?: React.ReactNode }) {
  return (
    <SharedEventsPage
      title="Events"
      description="Gather with the Semio Community at conferences, workshops, and training events focused on human-centered robotics and AI."
      heroIcon={<Calendar className="w-16 h-16 text-accent-two" />}
      footerSection={footerSection}
    >
      {children}
    </SharedEventsPage>
  );
}
