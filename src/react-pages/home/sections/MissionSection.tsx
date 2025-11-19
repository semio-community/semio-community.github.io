import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import SectionBlock from "@/components/sections/SectionBlock";
import { CpuBolt } from "@solar-icons/react-perf/LineDuotone";

export interface MissionFeature {
  title: string;
  description: string;
  /**
   * Optional icon (React element). Pass an icon component already styled
   * (e.g., with width/height/text color classes).
   */
  icon?: React.ReactNode;
  /**
   * Optional className for this feature tile (rarely needed).
   */
  className?: string;
}

export interface MissionSectionProps {
  /**
   * Section id. Defaults to "mission".
   */
  id?: string;
  /**
   * Section heading. Defaults to "Our Mission".
   */
  title?: string;
  /**
   * Section subheading displayed under the title.
   */
  subtitle?: string;
  /**
   * aria-label for the section element. If omitted, title is used.
   */
  ariaLabel?: string;
  /**
   * Wrapper className for the outer section element.
   */
  className?: string;
  /**
   * Optional className applied to the inner card wrapper.
   */
  cardClassName?: string;
  /**
   * Primary copy rendered inside a bordered card at the top of the section.
   * Typically a short paragraph describing the mission.
   */
  primaryCopy?: React.ReactNode;
  /**
   * A row of features with icons/titles/descriptions rendered inside the card
   * under the primary copy.
   */
  features?: MissionFeature[];
  /**
   * Secondary copy rendered below the card in a prose block (centered).
   * Useful for an extended intro paragraph.
   */
  secondaryCopy?: React.ReactNode;
}

/**
 * MissionSection
 *
 * Renders the "Our Mission" block composed of:
 * - Section heading/subheading (via SectionBlock)
 * - A bordered card that includes:
 *   - Primary copy paragraph
 *   - A 3-column features grid with icons and short descriptions
 * - An optional prose block paragraph beneath the card
 *
 * This component is intentionally icon-agnostic. Pass whatever icon components
 * you prefer as React nodes on each feature.
 */
export default function MissionSection({
  id = "mission",
  title = "Our Mission",
  subtitle = "Advancing human-centered robotics and AI through community collaboration",
  ariaLabel,
  className,
  cardClassName,
  primaryCopy = (
    <>
      Semio Community is a{" "}
      <span className="font-semibold">501(c)(3) nonprofit organization</span>{" "}
      facilitating community-driven robotics hardware, software, and research to
      foster reproducible, replicable, and generalizable science and reusable
      systems within human-robot interaction (HRI).
    </>
  ),
  features = [
    {
      title: "Community-Driven",
      icon: (
        <HugeiconsIcon
          icon={UserMultipleIcon}
          className="w-12 h-12 mx-auto mb-3 text-accent-two"
        />
      ),
      description:
        "Fostering collaboration and knowledge-sharing across disciplines",
    },
    {
      title: "Human-Centered",
      icon: <CpuBolt className="w-12 h-12 mx-auto mb-3 text-accent-two" />,
      description:
        "Prioritizing ethical and accessible robotics and AI technologies",
    },
    {
      title: "Replicable",
      icon: (
        <HugeiconsIcon
          icon={BookOpen01Icon}
          className="w-12 h-12 mx-auto mb-3 text-accent-two"
        />
      ),
      description:
        "Promoting reproducible scientific research and reusable systems",
    },
  ],
  secondaryCopy = (
    <>
      Founded with the belief that the future of robotics lies in collaborative
      innovation, we work to break down barriers between research and
      application, making cutting-edge robotics technology accessible to
      researchers, developers, and educators worldwide.
    </>
  ),
}: MissionSectionProps) {
  return (
    <SectionBlock
      id={id}
      title={title}
      subtitle={subtitle}
      ariaLabel={ariaLabel || title}
      variant="primary"
      className={className}
    >
      <div className="max-w-4xl mx-auto">
        {/* Primary card with copy and icon row */}
        <div
          className={`bg-special-lighter rounded-lg p-8 border border-special mb-8 backdrop-blur-lg ${
            cardClassName || ""
          }`}
        >
          {primaryCopy ? (
            <div className="text-lg leading-relaxed text-center mb-6">
              {typeof primaryCopy === "string" ? (
                <p>{primaryCopy}</p>
              ) : (
                primaryCopy
              )}
            </div>
          ) : null}

          {features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, idx) => (
                <div
                  key={`${f.title}-${idx}`}
                  className={`text-center ${f.className || ""}`}
                >
                  {f.icon ? (
                    <div className="w-12 h-12 mx-auto mb-3 text-accent-two flex items-center justify-center">
                      {f.icon}
                    </div>
                  ) : null}

                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-accent-base/50">{f.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Secondary prose copy */}
        {secondaryCopy ? (
          <div className="prose prose-citrus max-w-none">
            <div className="text-center text-color-600 dark:text-color-400">
              {typeof secondaryCopy === "string" ? (
                <p>{secondaryCopy}</p>
              ) : (
                secondaryCopy
              )}
            </div>
          </div>
        ) : null}
      </div>
    </SectionBlock>
  );
}
