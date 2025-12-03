#!/usr/bin/env node

/**
 * Best-effort Decap CMS config generator from Astro content collections.
 * It parses src/content.config.ts, maps common Zod patterns to Decap widgets,
 * and writes public/admin/config.generated.yml.
 */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import YAML from "yaml";

const root = process.cwd();
const contentConfigPath = path.join(root, "src/content.config.ts");
const baseConfigPath = path.join(root, "public/admin/config.yml");
const outputGeneratedPath = path.join(
  root,
  "public/admin/config.generated.yml",
);

const sourceText = fs.readFileSync(contentConfigPath, "utf8");
const sourceFile = ts.createSourceFile(
  contentConfigPath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
);

const schemaDefs = new Map();

const relationHints = {
  organizationIdSchema: {
    collection: "organizations",
    value_field: "id",
    display_fields: ["name", "id"],
    search_fields: ["name", "id"],
  },
  personIdSchema: {
    collection: "people",
    value_field: "id",
    display_fields: ["name", "id"],
    search_fields: ["name", "id"],
  },
  hardwareIdSchema: {
    collection: "hardware",
    value_field: "id",
    display_fields: ["name", "id"],
    search_fields: ["name", "id"],
  },
  softwareIdSchema: {
    collection: "software",
    value_field: "id",
    display_fields: ["name", "id"],
    search_fields: ["name", "id"],
  },
};

/**
 * Utility: unwrap parentheses and type assertions.
 */
function unwrap(expr) {
  let current = expr;
  while (ts.isParenthesizedExpression(current)) current = current.expression;
  if (ts.isAsExpression(current) || ts.isTypeAssertionExpression(current)) {
    current = current.expression;
  }
  return current;
}

function cloneNode(node) {
  return node ? JSON.parse(JSON.stringify(node)) : node;
}

function getPropName(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
    return nameNode.text;
  }
  return nameNode.getText(sourceFile);
}

function labelFromName(name) {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function mergeObjectNodes(a, b) {
  const merged = { kind: "object", fields: [] };
  const seen = new Map();
  for (const entry of [...a.fields, ...b.fields]) {
    if (seen.has(entry.name)) continue;
    seen.set(entry.name, entry);
    merged.fields.push(entry);
  }
  return merged;
}

/**
 * Parse common Zod constructs into a minimal intermediary representation.
 */
function parseZodExpression(rawExpr) {
  const expr = unwrap(rawExpr);

  if (ts.isIdentifier(expr)) {
    if (relationHints[expr.text]) {
      return { kind: "relation", ...relationHints[expr.text] };
    }
    const ref = schemaDefs.get(expr.text);
    if (ref) return cloneNode(ref);
  }

  if (ts.isCallExpression(expr)) {
    const callee = unwrap(expr.expression);

    if (ts.isIdentifier(callee)) {
      if (callee.text === "image") {
        return { kind: "image" };
      }
      const ref = schemaDefs.get(callee.text);
      if (ref) return cloneNode(ref);
    }

    if (ts.isPropertyAccessExpression(callee)) {
      const method = callee.name.text;
      const target = unwrap(callee.expression);

      if (ts.isIdentifier(target) && target.text === "z") {
        switch (method) {
          case "string":
            return { kind: "string" };
          case "boolean":
            return { kind: "boolean" };
          case "number":
            return { kind: "number" };
          case "date":
            return { kind: "date" };
          case "enum": {
            const arg = expr.arguments[0];
            const options =
              arg && ts.isArrayLiteralExpression(arg)
                ? arg.elements
                    .map((el) =>
                      ts.isStringLiteral(el) ||
                      ts.isNoSubstitutionTemplateLiteral(el)
                        ? el.text
                        : null,
                    )
                    .filter(Boolean)
                : [];
            return { kind: "enum", options };
          }
          case "array": {
            const itemExpr = expr.arguments[0];
            return { kind: "array", item: parseZodExpression(itemExpr) };
          }
          case "object": {
            const objLiteral = expr.arguments[0];
            if (ts.isObjectLiteralExpression(objLiteral)) {
              const fields = [];
              for (const prop of objLiteral.properties) {
                if (!ts.isPropertyAssignment(prop)) continue;
                const name = getPropName(prop.name);
                fields.push({
                  name,
                  node: parseZodExpression(prop.initializer),
                });
              }
              return { kind: "object", fields };
            }
            return { kind: "object", fields: [] };
          }
          default:
            return { kind: "unknown", note: `z.${method}` };
        }
      }

      const base = parseZodExpression(target);
      if (!base) return { kind: "unknown", note: expr.getText(sourceFile) };

      switch (method) {
        case "optional":
          return { ...base, optional: true };
        case "default":
          return { ...base, default: expr.arguments[0]?.getText(sourceFile) };
        case "nullable":
          return { ...base, optional: true };
        case "transform":
        case "refine":
          return base; // ignore transform for widget mapping
        case "or": {
          const rhs = parseZodExpression(expr.arguments[0]);
          return { kind: "union", options: [base, rhs] };
        }
        case "merge": {
          const rhs = parseZodExpression(expr.arguments[0]);
          if (base.kind === "object" && rhs?.kind === "object") {
            return mergeObjectNodes(base, rhs);
          }
          return base;
        }
        default:
          return base;
      }
    }
  }

  return { kind: "unknown", note: expr.getText(sourceFile) };
}

/**
 * Convert parsed nodes into Decap field definitions.
 */
function toDecapField(name, node, ctx) {
  const requiredFlag = node.optional ? false : undefined;
  const label = labelFromName(name);

  // Do not turn primary ids into relations; those should stay free-form.
  if (node.kind === "relation" && name === "id") {
    return { label, name, widget: "string", required: requiredFlag };
  }

  switch (node.kind) {
    case "relation":
      return {
        label,
        name,
        widget: "relation",
        collection: node.collection,
        value_field: node.value_field || "id",
        display_fields: node.display_fields || [node.value_field || "id"],
        search_fields: node.search_fields ||
          node.display_fields || [node.value_field || "id"],
        required: requiredFlag,
      };
    case "string":
      return { label, name, widget: "string", required: requiredFlag };
    case "boolean":
      return { label, name, widget: "boolean", required: requiredFlag };
    case "number":
      return { label, name, widget: "number", required: requiredFlag };
    case "date":
      return { label, name, widget: "datetime", required: requiredFlag };
    case "image":
      return {
        label,
        name,
        widget: "image",
        required: requiredFlag,
        media_folder: ctx?.mediaFolder,
        public_folder: ctx?.publicFolder,
      };
    case "enum":
      return {
        label,
        name,
        widget: "select",
        options: node.options || [],
        required: requiredFlag,
      };
    case "array": {
      const item = node.item || { kind: "string" };
      if (item.kind === "object") {
        return {
          label,
          name,
          widget: "list",
          required: requiredFlag,
          fields: item.fields.map((entry) =>
            toDecapField(entry.name, entry.node, ctx),
          ),
        };
      }
      if (item.kind === "enum") {
        return {
          label,
          name,
          widget: "select",
          options: item.options || [],
          multiple: true,
          required: requiredFlag,
        };
      }
      return {
        label,
        name,
        widget: "list",
        required: requiredFlag,
        field: toDecapField("item", item, ctx),
      };
    }
    case "object":
      return {
        label,
        name,
        widget: "object",
        required: requiredFlag,
        fields: node.fields.map((entry) =>
          toDecapField(entry.name, entry.node, ctx),
        ),
      };
    case "union": {
      const optionKinds = node.options?.map((opt) => opt?.kind);
      const hasDate = optionKinds?.includes("date");

      // If the union is just string|date (plus potential unknown transforms), map to datetime.
      if (
        hasDate &&
        optionKinds?.every(
          (k) => k === "date" || k === "string" || k === "unknown",
        )
      ) {
        return { label, name, widget: "datetime", required: requiredFlag };
      }

      return {
        label,
        name,
        widget: "string",
        required: requiredFlag,
        hint: "Unmapped union type",
      };
    }
    default:
      return {
        label,
        name,
        widget: "string",
        required: requiredFlag,
        hint: node.note ? `Unmapped schema: ${node.note}` : "Unmapped schema",
      };
  }
}

function parseCollections() {
  const collections = [];

  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;

    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;

      const init = unwrap(decl.initializer);

      if (
        ts.isCallExpression(init) &&
        ts.isIdentifier(init.expression) &&
        init.expression.text === "defineCollection"
      ) {
        const name = decl.name.text;
        const collection = parseCollection(name, init);
        if (collection) collections.push(collection);
        continue;
      }

      // Record shared schema fragments for later lookups.
      const parsed = parseZodExpression(init);
      if (parsed && parsed.kind !== "unknown") {
        schemaDefs.set(decl.name.text, parsed);
      }
    }
  });

  return collections;
}

function parseCollection(name, callExpr) {
  const arg = callExpr.arguments[0];
  if (!ts.isObjectLiteralExpression(arg)) return null;

  let folder;
  let schemaNode;

  for (const prop of arg.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const propName = getPropName(prop.name);

    if (propName === "loader") {
      const loaderExpr = unwrap(prop.initializer);
      if (
        ts.isCallExpression(loaderExpr) &&
        ts.isIdentifier(loaderExpr.expression)
      ) {
        const configArg = loaderExpr.arguments[0];
        if (ts.isObjectLiteralExpression(configArg)) {
          for (const loaderProp of configArg.properties) {
            if (
              ts.isPropertyAssignment(loaderProp) &&
              getPropName(loaderProp.name) === "base" &&
              ts.isStringLiteral(loaderProp.initializer)
            ) {
              folder = loaderProp.initializer.text.replace(/^\.\//, "");
            }
          }
        }
      }
    }

    if (propName === "schema") {
      const schemaExpr = unwrap(prop.initializer);
      schemaNode = parseSchemaNode(schemaExpr);
    }
  }

  if (!folder) {
    folder = `src/content/${name}`;
  }

  const fields = schemaNode?.kind === "object" ? schemaNode.fields : [];

  return { name, folder, fields };
}

function parseSchemaNode(schemaExpr) {
  if (ts.isArrowFunction(schemaExpr) || ts.isFunctionExpression(schemaExpr)) {
    const body = schemaExpr.body;
    if (ts.isBlock(body)) {
      for (const stmt of body.statements) {
        if (ts.isReturnStatement(stmt) && stmt.expression) {
          return parseZodExpression(stmt.expression);
        }
      }
    } else {
      return parseZodExpression(body);
    }
  }
  return parseZodExpression(schemaExpr);
}

const collections = parseCollections();

const baseConfig = fs.existsSync(baseConfigPath)
  ? YAML.parse(fs.readFileSync(baseConfigPath, "utf8"))
  : {};

const decapCollections = collections.map((collection) => {
  const idField =
    collection.fields.find((f) => f.name === "id")?.name ||
    collection.fields.find((f) => f.name === "name")?.name ||
    "slug";
  const mediaFolder = `/src/assets/images/${collection.name}`;
  const publicFolder = `@/assets/images/${collection.name}`;

  return {
    name: collection.name,
    label: labelFromName(collection.name),
    label_singular: labelFromName(collection.name).replace(/s$/, ""),
    folder: collection.folder,
    identifier_field: idField,
    extension: "mdx",
    format: "frontmatter",
    slug: `{{${idField}}}`,
    create: true,
    fields: collection.fields.map((entry) =>
      toDecapField(entry.name, entry.node, {
        mediaFolder,
        publicFolder,
      }),
    ),
  };
});

// Preserve any top-level settings from the base config, replacing only collections.
const { collections: _ignoredCollections, ...baseSettings } = baseConfig || {};
const outputConfig = {
  ...baseSettings,
  media_folder: "/src/assets/images",
  public_folder: "@/assets/images",
  collections: decapCollections,
};

fs.writeFileSync(
  outputGeneratedPath,
  YAML.stringify(outputConfig, { lineWidth: 0 }),
  "utf8",
);

console.log(
  `Generated Decap config with ${decapCollections.length} collections at ${outputGeneratedPath}`,
);

// Also write to the live config.yml so the CMS uses the latest mapping.
fs.writeFileSync(
  baseConfigPath,
  YAML.stringify(outputConfig, { lineWidth: 0 }),
  "utf8",
);
console.log(`Wrote updated config.yml at ${baseConfigPath}`);
