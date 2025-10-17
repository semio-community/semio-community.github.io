import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import {
  CalendarMark,
  DocumentText,
  Global,
  Letter,
  PlayCircle,
  UserPlusRounded,
  VideoLibrary,
  CodeSquare,
  DownloadMinimalistic,
  Cart3,
  Ticket,
  LinkRound,
  PhoneCalling,
  ClipboardCheck,
  SquareAcademicCap,
  Database,
  Passport,
} from "@solar-icons/react-perf/LineDuotone";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

const GithubIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 20.568c-3.429 1.157-6.286 0-8-3.568" />
    <path d="M10 22v-3.242c0-.598.184-1.118.48-1.588c.204-.322.064-.78-.303-.88C7.134 15.452 5 14.107 5 9.645c0-1.16.38-2.25 1.048-3.2c.166-.236.25-.354.27-.46c.02-.108-.015-.247-.085-.527c-.283-1.136-.264-2.343.16-3.43c0 0 .877-.287 2.874.96c.456.285.684.428.885.46s.469-.035 1.005-.169A9.5 9.5 0 0 1 13.5 3a9.6 9.6 0 0 1 2.343.28c.536.134.805.2 1.006.169c.2-.032.428-.175.884-.46c1.997-1.247 2.874-.96 2.874-.96c.424 1.087.443 2.294.16 3.43c-.07.28-.104.42-.084.526s.103.225.269.461c.668.95 1.048 2.04 1.048 3.2c0 4.462-2.134 5.807-5.177 6.643c-.367.101-.507.559-.303.88c.296.47.48.99.48 1.589V22" />
  </svg>
);

const LinkedInIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v7m4-4v4m0-4a3 3 0 1 1 6 0v4m-6-4v-3M7.008 7h-.009" />
    <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
  </svg>
);

const TwitterIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 21l7.548-7.548M21 3l-7.548 7.548m0 0L8 3H3l7.548 10.452m2.904-2.904L21 21h-5l-5.452-7.548" />
  </svg>
);

const BlueskyIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15.492 22.082c-1.58 0-2.78-1.8-3.5-3.28c-.72 1.47-1.92 3.28-3.5 3.28c-2.43 0-5.25-2.87-5.25-4.75c0-1.2.66-2.02 1.48-2.59c-1.55-.6-2.57-1.87-2.96-3.76c-.44-2.22-1-6.17.26-7.7c.38-.46.89-.7 1.48-.7c3.45 0 6.97 5.18 8.5 7.74c1.53-2.55 5.05-7.74 8.5-7.74c.59 0 1.1.24 1.48.7c1.26 1.53.7 5.48.26 7.7c-.39 1.89-1.41 3.16-2.96 3.76c.82.56 1.48 1.39 1.48 2.59c0 1.88-2.82 4.75-5.25 4.75zm-3.5-6c.32 0 .61.21.71.51c.54 1.61 1.8 3.98 2.79 3.98c1.65 0 3.75-2.2 3.75-3.25c0-1.78-3.31-2.25-3.34-2.26a.744.744 0 0 1-.65-.83c.05-.41.41-.7.83-.66c2.68.3 4.21-.65 4.68-2.91c.62-3.13.65-5.72.05-6.45a.37.37 0 0 0-.32-.15c-2.71 0-6.2 5.08-7.83 8.08c-.13.24-.39.4-.66.4s-.53-.14-.66-.38l-.01-.02c-1.63-3-5.12-8.08-7.83-8.08c-.14 0-.23.04-.32.15c-.59.73-.57 3.32.05 6.45c.47 2.25 2 3.2 4.68 2.9c.42-.04.78.25.83.66s-.24.78-.65.83c-.03 0-3.34.48-3.34 2.26c0 1.05 2.1 3.25 3.75 3.25c.99 0 2.25-2.38 2.79-3.98c.1-.31.39-.51.71-.51z" />
  </svg>
);

const MastodonIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fillRule="evenodd"
      d="M4.552 20.855c2.17 2.04 5.18 2.22 6.14 2.22l.01-.01h.31c2.69 0 4.34-1.07 4.41-1.12c.21-.13.34-.37.34-.62v-1c0-.24-.12-.47-.31-.61a.76.76 0 0 0-.67-.11c-.02.01-1.44.46-3.77.46c-1.43 0-2.41-.35-2.92-1.03c-.4-.54-.46-1.21-.43-1.73c3.4 1.04 7.75.99 11.07-.12c1.83-.61 3.02-2.42 3.02-4.63v-4.71c0-2.69-1.54-4.92-3.83-5.53c-3.61-.97-8.24-.97-11.85 0c-2.29.61-3.83 2.83-3.83 5.53v6.97c0 2.57.78 4.6 2.31 6.04m1.91-17.09c1.677-.449 3.594-.689 5.53-.69c1.937.001 3.853.241 5.53.69c1.87.5 2.71 2.41 2.71 4.08v4.71c0 1.55-.79 2.81-2 3.21c-3.29 1.1-7.72 1.04-10.93-.15a.74.74 0 0 0-.97.48c-.03.09-.66 2.22.53 3.83c.81 1.09 2.2 1.64 4.13 1.64h-.047c-.17.007-3.32.125-5.373-1.81c-1.21-1.14-1.82-2.8-1.82-4.94v-6.97c0-1.67.83-3.58 2.71-4.08m9.79 10.06c0 .41.34.75.75.75s.75-.34.75-.75v-5.5c0-1.79-1.46-3.25-3.25-3.25c-1 0-1.9.46-2.5 1.18c-.6-.72-1.5-1.18-2.5-1.18c-1.79 0-3.25 1.46-3.25 3.25v5.5c0 .41.34.75.75.75s.75-.34.75-.75v-5.5c0-.96.79-1.75 1.75-1.75s1.75.79 1.75 1.75v3.5c0 .41.34.75.75.75s.75-.34.75-.75v-3.5c0-.96.79-1.75 1.75-1.75s1.75.79 1.75 1.75z"
    />
  </svg>
);

const PythonIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M11 5.49976V5.50976" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" />
    <path d="M13 18.4898V18.4998" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" />
    <path d="M17.498 8.5H15.4989V6.5C15.4989 5.09554 15.4989 4.39331 15.1618 3.88886C15.0159 3.67048 14.8284 3.48298 14.61 3.33706C14.1056 3 13.4033 3 11.9989 3C10.5944 3 9.89218 3 9.38773 3.33706C9.16935 3.48298 8.98185 3.67048 8.83593 3.88886C8.49887 4.39331 8.49887 5.09554 8.49887 6.5V8.5H6.49805C5.09358 8.5 4.39135 8.5 3.88691 8.83706C3.66853 8.98298 3.48103 9.17048 3.33511 9.38886C2.99805 9.89331 2.99805 10.5955 2.99805 12C2.99805 13.4045 2.99805 14.1067 3.33511 14.6111C3.48102 14.8295 3.66853 15.017 3.88691 15.1629C4.39135 15.5 5.09358 15.5 6.49805 15.5H8.49887V17.5C8.49887 18.9045 8.49887 19.6067 8.83593 20.1111C8.98185 20.3295 9.16935 20.517 9.38773 20.6629C9.89218 21 10.5944 21 11.9989 21C13.4033 21 14.1056 21 14.61 20.6629C14.8284 20.517 15.0159 20.3295 15.1618 20.1111C15.4989 19.6067 15.4989 18.9045 15.4989 17.5V15.5H17.498C18.9025 15.5 19.6047 15.5 20.1092 15.1629C20.3276 15.017 20.5151 14.8295 20.661 14.6111C20.998 14.1067 20.998 13.4045 20.998 12C20.998 10.5955 20.998 9.89331 20.661 9.38886C20.5151 9.17048 20.3276 8.98298 20.1092 8.83706C19.6047 8.5 18.9025 8.5 17.498 8.5Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15.5 8.5V12H8.5V15.5M12 15.5H15.5M8.5 8.5H12" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
)

const NpmIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7h18v10h-6V9h-4v8H3z" />
  </svg>
);

type CanonicalLinkType =
  | "website"
  | "documentation"
  | "demo"
  | "github"
  | "email"
  | "linkedin"
  | "twitter"
  | "bluesky"
  | "mastodon"
  | "scheduling"
  | "orcid"
  | "googleScholar"
  | "registration"
  | "npm"
  | "pypi"
  | "video"
  | "code"
  | "data"
  | "download"
  | "purchase"
  | "rental"
  | "program"
  | "proceedings"
  | "recordings"
  | "ticket"
  | "phone"
  | "generic";

type LinkAlias = "docs" | "documentation" | "google-scholar" | "paper" | "pdf" | "arxiv" | "doi";

export type LinkType = CanonicalLinkType | LinkAlias;

type IconComponent = React.ComponentType<IconProps>;

interface LinkDisplayMeta {
  label: string;
  description?: string;
  icon: IconComponent;
  prefers?: "solar" | "huge";
}

const linkMeta: Record<CanonicalLinkType, LinkDisplayMeta> = {
  website: {
    label: "Website",
    description: "Open website",
    icon: Global,
    prefers: "solar",
  },
  documentation: {
    label: "Documentation",
    description: "View documentation",
    icon: DocumentText,
    prefers: "solar",
  },
  demo: {
    label: "Demo",
    description: "Watch demo",
    icon: PlayCircle,
    prefers: "solar",
  },
  github: {
    label: "GitHub",
    description: "Open GitHub",
    icon: GithubIcon,
    prefers: "huge",
  },
  email: {
    label: "Email",
    description: "Send email",
    icon: Letter,
    prefers: "solar",
  },
  linkedin: {
    label: "LinkedIn",
    description: "Open LinkedIn",
    icon: LinkedInIcon,
    prefers: "huge",
  },
  pypi: {
    label: "PyPi",
    description: "Open PyPi",
    icon: PythonIcon,
    prefers: "huge" 
  },
  twitter: {
    label: "X (Twitter)",
    description: "Open X (Twitter)",
    icon: TwitterIcon,
    prefers: "huge",
  },
  bluesky: {
    label: "Bluesky",
    description: "Open Bluesky",
    icon: BlueskyIcon,
    prefers: "huge",
  },
  mastodon: {
    label: "Mastodon",
    description: "Open Mastodon",
    icon: MastodonIcon,
    prefers: "huge",
  },
  scheduling: {
    label: "Scheduling",
    description: "Schedule a meeting",
    icon: CalendarMark,
    prefers: "solar",
  },
  orcid: {
    label: "ORCID",
    description: "View ORCID profile",
    icon: Passport,
    prefers: "solar",
  },
  googleScholar: {
    label: "Google Scholar",
    description: "View Google Scholar profile",
    icon: SquareAcademicCap,
    prefers: "solar",
  },
  registration: {
    label: "Registration",
    description: "Register or sign up",
    icon: UserPlusRounded,
    prefers: "solar",
  },
  npm: {
    label: "npm",
    description: "View npm package",
    icon: NpmIcon,
    prefers: "huge",
  },
  video: {
    label: "Video",
    description: "Open video",
    icon: VideoLibrary,
    prefers: "solar",
  },
  code: {
    label: "Source Code",
    description: "View source code",
    icon: CodeSquare,
    prefers: "solar",
  },
  data: {
    label: "Dataset",
    description: "View dataset",
    icon: Database,
    prefers: "solar",
  },
  download: {
    label: "Download",
    description: "Download resource",
    icon: DownloadMinimalistic,
    prefers: "solar",
  },
  purchase: {
    label: "Purchase",
    description: "View purchasing options",
    icon: Cart3,
    prefers: "solar",
  },
  rental: {
    label: "Rental",
    description: "View rental options",
    icon: CalendarMark,
    prefers: "solar",
  },
  program: {
    label: "Program",
    description: "View program",
    icon: ClipboardCheck,
    prefers: "solar",
  },
  proceedings: {
    label: "Proceedings",
    description: "View proceedings",
    icon: DocumentText,
    prefers: "solar",
  },
  recordings: {
    label: "Recordings",
    description: "View recordings",
    icon: VideoLibrary,
    prefers: "solar",
  },
  ticket: {
    label: "Tickets",
    description: "Buy tickets",
    icon: Ticket,
    prefers: "solar",
  },
  phone: {
    label: "Phone",
    description: "Call phone number",
    icon: PhoneCalling,
    prefers: "solar",
  },
  generic: {
    label: "Open link",
    description: "Open external link",
    icon: LinkRound,
    prefers: "solar",
  },
};

const linkAliases: Record<LinkAlias, CanonicalLinkType> = {
  docs: "documentation",
  documentation: "documentation",
  "google-scholar": "googleScholar",
  paper: "documentation",
  pdf: "documentation",
  arxiv: "documentation",
  doi: "documentation"
};

export interface LinkButtonConfig {
  href: string;
  type?: LinkType;
  label?: string;
  description?: string;
  external?: boolean;
}

export const resolveLinkMeta = (
  type?: LinkType,
): LinkDisplayMeta | undefined => {
  if (!type) return undefined;
  const canonical = ((): CanonicalLinkType | undefined => {
    if (type in linkMeta) return type as CanonicalLinkType;
    return linkAliases[type as LinkAlias];
  })();
  return canonical ? linkMeta[canonical] : undefined;
};

export const buildLinkButtonConfigs = (
  links: Record<string, string | undefined> | undefined,
  allowed?: LinkType[],
): LinkButtonConfig[] => {
  if (!links) return [];
  const entries: LinkButtonConfig[] = [];

  Object.entries(links).forEach(([rawType, href]) => {
    if (!href) return;
    const type = rawType as LinkType;
    if (allowed && !allowed.includes(type)) return;
    entries.push({ href, type });
  });

  return entries;
};

export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps {
  type?: LinkType;
  href?: string;
  label?: string;
  description?: string;
  icon?: IconComponent;
  size?: IconButtonSize;
  className?: string;
  external?: boolean;
  as?: "button" | "link";
  onClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  stopPropagation?: boolean;
  disabled?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

const buttonSizes: Record<IconButtonSize, string> = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

const iconSizes: Record<IconButtonSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const IconButton: React.FC<IconButtonProps> = ({
  type,
  href,
  label,
  description,
  icon,
  size = "md",
  className,
  external,
  as,
  onClick,
  stopPropagation = false,
  disabled = false,
  target,
  rel,
}) => {
  const resolvedMeta = resolveLinkMeta(type);
  const finalLabel = label ?? resolvedMeta?.label ?? "Open link";
  const finalDescription =
    description ?? resolvedMeta?.description ?? finalLabel;
  const IconComponent =
    icon ?? resolvedMeta?.icon ?? linkMeta.generic.icon;

  const isExternal =
    external ?? Boolean(href && /^https?:\/\//.test(href));

  const elementType: "button" | "link" =
    as ?? (href && !stopPropagation ? "link" : "button");

  const baseClasses =
    "inline-flex items-center justify-center rounded-full text-accent-base transition-colors duration-200 focus:outline-none hover:text-accent-two";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const buttonClassName = clsx(
    baseClasses,
    buttonSizes[size],
    className,
    disabledClasses,
  );

  const iconClassName = iconSizes[size];

  const handleClick = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (stopPropagation) {
      event.stopPropagation();
      if (elementType === "button") {
        event.preventDefault();
      }
    }
    if (onClick) {
      onClick(event);
      return;
    }
    if (elementType === "button" && href && !disabled) {
      if (isExternal) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    }
  };

  const content = (
    <IconComponent
      aria-hidden
      focusable="false"
      className={iconClassName}
    />
  );

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {elementType === "link" ? (
            <a
              href={href}
              className={buttonClassName}
              aria-label={finalLabel}
              target={target ?? (isExternal ? "_blank" : undefined)}
              rel={
                rel ??
                (isExternal ? "noopener noreferrer" : undefined)
              }
              onClick={handleClick}
              data-prefers={resolvedMeta?.prefers ?? "solar"}
            >
              {content}
            </a>
          ) : (
            <button
              type="button"
              className={buttonClassName}
              aria-label={finalLabel}
              onClick={handleClick}
              disabled={disabled}
              data-prefers={resolvedMeta?.prefers ?? "solar"}
            >
              {content}
            </button>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="rounded-md bg-accent-base px-2 py-1 text-xs font-medium text-surface shadow-lg data-[state=delayed-open]:animate-in data-[state=open]:fade-in z-100"
          >
            {finalDescription}
            <Tooltip.Arrow className="fill-accent-base" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

IconButton.displayName = "IconButton";
