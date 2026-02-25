#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
function resolveHubContentRoot() {
  const candidates = [
    path.join(root, "../ecosystem-content-hub/content"),
    path.join(root, "../semio-content-hub/content"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const hubRoot = resolveHubContentRoot();
const siteRoot = path.join(root, "src/content");
const collectionKeys = ["people", "software", "hardware", "research"];
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

function getContentFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter(
      (name) =>
        (name.endsWith(".md") || name.endsWith(".mdx")) && name !== "README.md",
    );
}

let importedCount = 0;
let skippedCount = 0;

if (!hubRoot) {
  console.error(
    `Content hub folder not found. Checked ../ecosystem-content-hub/content and ../semio-content-hub/content from ${root}.`,
  );
  process.exit(1);
}

for (const collectionKey of collectionKeys) {
  const sourceDir = path.join(hubRoot, collectionKey);
  const targetDir = path.join(siteRoot, collectionKey);
  if (!fs.existsSync(sourceDir)) continue;
  fs.mkdirSync(targetDir, { recursive: true });

  const importedFiles = new Set();
  for (const fileName of getContentFiles(sourceDir)) {
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

    fs.writeFileSync(
      targetPath,
      stringifyFrontmatter(mergedData, body),
      "utf8",
    );
    importedFiles.add(fileName);
    importedCount += 1;
  }

  for (const existingName of getContentFiles(targetDir)) {
    if (importedFiles.has(existingName)) continue;
    fs.unlinkSync(path.join(targetDir, existingName));
  }
}

console.log(
  `Synced ${importedCount} entries for site '${siteKey}' across collections: ${collectionKeys.join(", ")} (${skippedCount} skipped).`,
);
