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

const hubContentRoot = resolveHubContentRoot();
const hubEventsDir = hubContentRoot ? path.join(hubContentRoot, "events") : "";
const siteSourceDirs = {
  semio: path.join(root, "src/content/events"),
  quori: path.join(root, "../quori-robot.github.io/src/content/events"),
  vizij: path.join(root, "../vizij-ai.github.io/src/content/events"),
};
const siteOrder = ["semio", "quori", "vizij"];

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

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) return undefined;
  return fs.readFileSync(filePath, "utf8");
}

if (!hubContentRoot) {
  console.error(
    `Content hub folder not found. Checked ../ecosystem-content-hub/content and ../semio-content-hub/content from ${root}.`,
  );
  process.exit(1);
}

if (!fs.existsSync(hubEventsDir)) {
  fs.mkdirSync(hubEventsDir, { recursive: true });
}

const fileNames = new Set();
for (const sourceDir of Object.values(siteSourceDirs)) {
  if (!fs.existsSync(sourceDir)) continue;
  for (const fileName of fs.readdirSync(sourceDir)) {
    if (fileName.endsWith(".mdx")) {
      fileNames.add(fileName);
    }
  }
}

const canonicalFiles = [...fileNames].sort();
const written = new Set();

for (const fileName of canonicalFiles) {
  const availableSites = siteOrder.filter((siteKey) =>
    fs.existsSync(path.join(siteSourceDirs[siteKey], fileName)),
  );

  if (availableSites.length === 0) {
    continue;
  }

  const canonicalSite =
    availableSites.find((siteKey) => siteKey === "semio") || availableSites[0];
  const canonicalPath = path.join(siteSourceDirs[canonicalSite], fileName);
  const canonicalRaw = readIfExists(canonicalPath);

  if (!canonicalRaw) {
    continue;
  }

  const { data, body } = parseFrontmatter(canonicalRaw);
  const mergedData = {
    ...data,
    sites: availableSites,
  };
  delete mergedData.visibility;
  delete mergedData.overrides;

  const targetPath = path.join(hubEventsDir, fileName);
  fs.writeFileSync(targetPath, stringifyFrontmatter(mergedData, body), "utf8");
  written.add(fileName);
}

for (const existingName of fs.readdirSync(hubEventsDir)) {
  if (!existingName.endsWith(".mdx")) continue;
  if (written.has(existingName)) continue;
  fs.unlinkSync(path.join(hubEventsDir, existingName));
}

console.log(`Imported ${written.size} event entries into ${hubEventsDir}.`);
