import type { LinkType } from "@/components/ui/IconButton";

export const linkPriority: LinkType[] = [
  "website",
  "linkedin",
  "github",
  "email",
  "scheduling",
  "googleScholar",
  "orcid",
  "documentation",
  "paper",
  "purchase",
  "rental",
  "demo",
  "pypi",
  "npm",
  "pdf",
  "doi",
  "arxiv",
  "code",
  "data",
  "video",
  "registration",
  "program",
  "proceedings",
  "recordings",
  "twitter",
  "bluesky",
  "mastodon",
  "phone",
];

export function normalizeLinkHref(type: LinkType, value: string): string {
  if (!value) return "";
  const v = value.trim();
  const isUrl = /^https?:\/\//i.test(v);

  switch (type) {
    case "email":
      return v.startsWith("mailto:") ? v : `mailto:${v}`;
    case "phone":
      return v.startsWith("tel:") ? v : `tel:${v.replace(/[^+\d]/g, "")}`;
    case "github":
      return isUrl ? v : `https://github.com/${v.replace(/^@/, "")}`;
    case "linkedin":
      return isUrl ? v : `https://linkedin.com/in/${v}`;
    case "twitter":
      return isUrl ? v : `https://twitter.com/${v.replace(/^@/, "")}`;
    case "bluesky":
      return isUrl ? v : `https://bsky.app/profile/${v.replace(/^@/, "")}`;
    case "pypi":
      return isUrl ? v : `https://pypi.org/project/${v}`;
    case "npm":
      return isUrl ? v : `https://www.npmjs.com/package/${v}`;
    case "googleScholar":
      return isUrl ? v : `https://scholar.google.com/citations?user=${v}`;
    case "orcid":
      return isUrl ? v : `https://orcid.org/${v}`;
    case "arxiv":
      return isUrl ? v : `https://arxiv.org/abs/${v}`;
    case "doi":
      return isUrl ? v : `https://doi.org/${v}`;

    // Pass-through types; add https:// if it looks like a bare domain
    case "website":
    case "documentation":
    case "demo":
    case "registration":
    case "ticket":
    case "program":
    case "proceedings":
    case "recordings":
    case "video":
    case "code":
    case "data":
    case "download":
    case "purchase":
    case "rental":
    case "scheduling":
    case "generic":
    case "paper":
    case "pdf": {
      if (isUrl) return v;
      if (/^[\w.-]+\.[a-z]{2,}/i.test(v)) return `https://${v}`;
      return v;
    }

    default: {
      if (isUrl) return v;
      if (/^[\w.-]+\.[a-z]{2,}/i.test(v)) return `https://${v}`;
      return v;
    }
  }
}
