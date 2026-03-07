#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(ROOT, "content");
const OUTPUT_FILE = path.join(ROOT, "content-index.js");
const NAME_PATTERN = /^(\d{4})-([A-Z]{3})-(\d{2})_(.+)\.md$/;
const MONTH = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

function formatLabel(value) {
  return value.replace(/_/g, " ").trim();
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseDateToEpoch(dateText) {
  const match = dateText.match(/^(\d{4})-([A-Z]{3})-(\d{2})$/);
  if (!match) return 0;

  const year = Number(match[1]);
  const month = MONTH[match[2]];
  const day = Number(match[3]);
  if (!Number.isInteger(month)) return 0;

  return Date.UTC(year, month, day);
}

function listSectionDirectories() {
  if (!fs.existsSync(CONTENT_ROOT)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("."))
    .filter((name) => !name.endsWith("BKP"))
    .sort((a, b) => a.localeCompare(b));
}

function buildEntries(sectionName) {
  const dir = path.join(CONTENT_ROOT, sectionName);

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const match = fileName.match(NAME_PATTERN);
      if (!match) {
        throw new Error(
          `Invalid filename in ${sectionName}: ${fileName} (expected YYYY-MON-DD_name.md)`
        );
      }

      const date = `${match[1]}-${match[2]}-${match[3]}`;
      const stem = match[4];
      const content = fs.readFileSync(path.join(dir, fileName), "utf8").trim();
      const summaryLine = content.split(/\r?\n/).find((line) => line.trim()) || "";

      return {
        id: `${date}-${stem}`.toLowerCase(),
        date,
        title: formatLabel(stem),
        summary: summaryLine.replace(/^#+\s*/, "").trim(),
        content,
        sourceFile: `content/${sectionName}/${fileName}`,
        sortKey: parseDateToEpoch(date),
      };
    })
    .sort(
      (a, b) =>
        b.sortKey - a.sortKey || b.sourceFile.localeCompare(a.sourceFile)
    )
    .map(({ sortKey, ...entry }) => entry);
}

function buildIndex() {
  const sections = listSectionDirectories().map((sectionName) => ({
    name: sectionName,
    slug: slugify(sectionName),
    label: formatLabel(sectionName),
    entries: buildEntries(sectionName),
  }));

  const payload = [
    "// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.",
    "// Source markdown lives in content/<section-name>/.",
    `window.CONTENT_INDEX = ${JSON.stringify({ sections }, null, 2)};`,
    "",
  ].join("\n");

  fs.writeFileSync(OUTPUT_FILE, payload);
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)}`);
}

buildIndex();
