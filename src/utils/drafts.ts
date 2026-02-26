import {
  isDraftVisible as resolveDraftVisibility,
  shouldShowDrafts as resolveDraftFlag,
} from "@semio-community/ecosystem-site-core";

type SiteKey = "semio" | "quori" | "vizij";

const SITE_KEY: SiteKey = "semio";

export function shouldShowDrafts(): boolean {
  return resolveDraftFlag({
    isProd: import.meta.env.PROD,
    env: {
      SHOW_DRAFTS: process.env.SHOW_DRAFTS ?? import.meta.env["SHOW_DRAFTS"],
      PUBLIC_SHOW_DRAFTS:
        process.env.PUBLIC_SHOW_DRAFTS ?? import.meta.env["PUBLIC_SHOW_DRAFTS"],
    },
  });
}

export function isDraftVisible(
  draft?: boolean,
  sites?: readonly SiteKey[],
): boolean {
  if (sites && sites.length > 0 && !sites.includes(SITE_KEY)) {
    return false;
  }

  return resolveDraftVisibility(draft, shouldShowDrafts());
}
