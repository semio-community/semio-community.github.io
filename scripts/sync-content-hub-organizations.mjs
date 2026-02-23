#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const sourceDir = path.join(root, "../semio-content-hub/content/organizations");
const targetDir = path.join(root, "src/content/organizations");
const siteKey = "semio";

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) {
    return { data: {}, body: raw };
  }

  const endIndex = raw.indexOf("\n---\n", 4);
  if (endIndex < 0) {
    return { data: {}, body: raw };
  }

  const frontmatterRaw = raw.slice(4, endIndex);
  const body = raw.slice(endIndex + 5);
  const data = YAML.parse(frontmatterRaw) || {};
  return { data, body };
}

function stringifyFrontmatter(data, body) {
  return `---\n${YAML.stringify(data)}---\n${body}`;
}

if (!fs.existsSync(sourceDir)) {
  console.error(`Content hub organizations folder not found: ${sourceDir}`);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const sourceFiles = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".mdx"));

let importedCount = 0;
let skippedCount = 0;

for (const fileName of sourceFiles) {
  const sourcePath = path.join(sourceDir, fileName);
  const targetPath = path.join(targetDir, fileName);
  const raw = fs.readFileSync(sourcePath, "utf8");
  const { data, body } = parseFrontmatter(raw);

  const sites = Array.isArray(data.sites) ? data.sites : undefined;
  if (sites && !sites.includes(siteKey)) {
    skippedCount += 1;
    continue;
  }

  const siteOverride =
    data.overrides && typeof data.overrides === "object"
      ? data.overrides[siteKey]
      : undefined;

  const mergedData = {
    ...data,
    ...(siteOverride && typeof siteOverride === "object" ? siteOverride : {}),
  };

  delete mergedData.sites;
  delete mergedData.overrides;

  fs.writeFileSync(targetPath, stringifyFrontmatter(mergedData, body), "utf8");
  importedCount += 1;
}

console.log(
  `Synced ${importedCount} organization entries for site '${siteKey}' from ${sourceDir} to ${targetDir} (${skippedCount} skipped).`,
);
