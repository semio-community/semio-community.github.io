#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const hubRoot = path.join(root, "../semio-content-hub/content");
const collectionKeys = ["people", "software", "hardware", "research"];
const sourceRoots = {
  semio: path.join(root, "src/content"),
  quori: path.join(root, "../quori-robot.github.io/src/content"),
  vizij: path.join(root, "../vizij-ai.github.io/src/content"),
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

function getContentFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter(
      (name) =>
        (name.endsWith(".md") || name.endsWith(".mdx")) && name !== "README.md",
    );
}

let totalImported = 0;

for (const collectionKey of collectionKeys) {
  const hubDir = path.join(hubRoot, collectionKey);
  fs.mkdirSync(hubDir, { recursive: true });

  const fileNames = new Set();
  for (const sourceRoot of Object.values(sourceRoots)) {
    for (const fileName of getContentFiles(path.join(sourceRoot, collectionKey))) {
      fileNames.add(fileName);
    }
  }

  const written = new Set();
  for (const fileName of [...fileNames].sort()) {
    const availableSites = siteOrder.filter((siteKey) =>
      fs.existsSync(path.join(sourceRoots[siteKey], collectionKey, fileName)),
    );
    if (availableSites.length === 0) continue;

    const canonicalSite =
      availableSites.find((siteKey) => siteKey === "semio") || availableSites[0];
    const canonicalPath = path.join(
      sourceRoots[canonicalSite],
      collectionKey,
      fileName,
    );
    const canonicalRaw = fs.readFileSync(canonicalPath, "utf8");
    const { data, body } = parseFrontmatter(canonicalRaw);

    const mergedData = {
      ...data,
      sites: availableSites,
    };
    delete mergedData.visibility;
    delete mergedData.overrides;

    const targetPath = path.join(hubDir, fileName);
    fs.writeFileSync(targetPath, stringifyFrontmatter(mergedData, body), "utf8");
    written.add(fileName);
    totalImported += 1;
  }

  for (const existingName of getContentFiles(hubDir)) {
    if (written.has(existingName)) continue;
    fs.unlinkSync(path.join(hubDir, existingName));
  }
}

console.log(
  `Imported ${totalImported} entries across collections: ${collectionKeys.join(", ")}.`,
);
