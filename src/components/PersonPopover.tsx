import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Avatar from "@radix-ui/react-avatar";
import "./PersonPopover.css";
import {
  Letter,
  Route,
  User,
  UserBlockRounded,
} from "@solar-icons/react-perf/LineDuotone";

interface PersonPopoverProps {
  person: {
    id: string;
    name: string;
    displayName?: string;
    pronouns?: string;
    title?: string;
    bio?: string;
    expertise?: string[];
    affiliations?: Array<{
      partnerId: string;
      role: string;
      department?: string;
      startDate?: Date;
      endDate?: Date;
      current: boolean;
    }>;
    orcid?: string;
    googleScholar?: string;
    email?: string;
    website?: string;
    links?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      bluesky?: string;
      mastodon?: string;
    };
    avatar?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
  } | null;
  personId: string;
  role?: string;
  currentAffiliation?: {
    partnerId: string;
    partnerName?: string;
    role: string;
  };
}

export function PersonPopover({
  person,
  role,
  currentAffiliation,
}: PersonPopoverProps) {
  if (!person) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full">
        <UserBlockRounded className="w-5 h-5 text-neutral-400" />
        <span className="text-sm text-neutral-500">Unknown Person</span>
      </span>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 bg-surface-lighter rounded-full border-2 border-accent-one/40 hover:border-accent-one data-[state=open]:border-accent-two hover:data-[state=closed]:border-accent-one transition-all cursor-pointer focus:outline-none focus:border-accent-two">
          <Avatar.Root className="w-6 h-6">
            <Avatar.Image
              src={person.avatar?.src || ""}
              alt={person.name}
              className="w-full h-full rounded-full object-cover"
            />
            <Avatar.Fallback className="w-full h-full rounded-full bg-accent-one/20 flex items-center justify-center text-xs font-medium">
              {getInitials(person.displayName || person.name)}
            </Avatar.Fallback>
          </Avatar.Root>
          <span className="text-sm font-medium">
            {person.displayName || person.name}
          </span>
          {role && (
            <span className="text-xs text-color-600 dark:text-color-400">
              • {role}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="popover-content w-80 p-4 bg-surface rounded-lg shadow-xl border border-accent-base/50 outline-hidden"
          sideOffset={5}
          align="start"
        >
          <a
            href={`/people/${person.id}`}
            className="flex items-start gap-4 no-underline hover:opacity-90 transition-opacity"
          >
            <Avatar.Root className="w-16 h-16 flex-shrink-0">
              <Avatar.Image
                src={person.avatar?.src || ""}
                alt={person.name}
                className="w-full h-full rounded-full object-cover"
              />
              <Avatar.Fallback className="w-full h-full rounded-full bg-accent-one/20 flex items-center justify-center text-lg font-medium">
                {getInitials(person.displayName || person.name)}
              </Avatar.Fallback>
            </Avatar.Root>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base text-color">
                {person.displayName || person.name}
                {person.pronouns && (
                  <span className="ml-2 text-xs font-normal text-accent-base">
                    ({person.pronouns})
                  </span>
                )}
              </h4>
              {person.title && (
                <p className="text-sm text-accent-base">{person.title}</p>
              )}
              {currentAffiliation && (
                <p className="text-xs text-accent-base mt-1">
                  {currentAffiliation.role} at{" "}
                  {currentAffiliation.partnerName ||
                    currentAffiliation.partnerId}
                </p>
              )}
            </div>
          </a>

          {person.bio && (
            <p className="mt-3 text-sm text-accent-base line-clamp-3">
              {person.bio}
            </p>
          )}

          {person.expertise && person.expertise.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-400">
                Expertise:
              </p>
              <div className="flex flex-wrap gap-1">
                {person.expertise.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 bg-accent-two/10 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {person.expertise.length > 5 && (
                  <span className="text-xs px-2 py-0.5 text-neutral-500">
                    +{person.expertise.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-3 text-xs">
            <a
              href={`/people/${person.id}`}
              className="text-accent-one hover:text-accent-two transition-colors flex items-center gap-1 font-medium"
            >
              <User className="w-3 h-3" />
              View Profile
            </a>
            {person.links?.github && (
              <a
                href={`https://github.com/${person.links.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-one hover:text-accent-two transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {person.orcid && (
              <a
                href={`https://orcid.org/${person.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-one hover:text-accent-two transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
                </svg>
                ORCID
              </a>
            )}
            {person.website && (
              <a
                href={person.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-one hover:text-accent-two transition-colors flex items-center gap-1"
              >
                <Route className="w-3 h-3" />
                Website
              </a>
            )}
            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className="text-accent-one hover:text-accent-two transition-colors flex items-center gap-1"
              >
                <Letter className="w-3 h-3" />
                Email
              </a>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
