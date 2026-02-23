import {
  isDraftVisible as resolveDraftVisibility,
  shouldShowDrafts as resolveDraftFlag,
} from "@semio-community/site-core";

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

export function isDraftVisible(draft?: boolean): boolean {
  return resolveDraftVisibility(draft, shouldShowDrafts());
}
