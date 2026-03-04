#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = path.join(ROOT, 'content');
const OUTPUT_FILE = path.join(ROOT, 'content-index.js');
const SECTIONS = ['projects', 'tech', 'writings'];
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

function toTitle(stem) {
  return stem
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDateToEpoch(dateText) {
  const m = dateText.match(/^(\d{4})-([A-Z]{3})-(\d{2})$/);
  if (!m) return 0;
  const year = Number(m[1]);
  const month = MONTH[m[2]];
  const day = Number(m[3]);
  if (!Number.isInteger(month)) return 0;
  return Date.UTC(year, month, day);
}

function buildSection(section) {
  const dir = path.join(CONTENT_ROOT, section);
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => d.name)
    .map((fileName) => {
      const m = fileName.match(NAME_PATTERN);
      if (!m) {
        throw new Error(
          `Invalid filename in ${section}: ${fileName} (expected YYYY-MON-DD_name.md)`
        );
      }

      const date = `${m[1]}-${m[2]}-${m[3]}`;
      const slugPart = m[4];
      const id = `${date}-${slugPart}`.toLowerCase();
      const title = toTitle(slugPart);
      const content = fs.readFileSync(path.join(dir, fileName), 'utf8').trim();
      const summaryLine = content.split(/\r?\n/).find((line) => line.trim());
      const summary = summaryLine ? summaryLine.replace(/^#+\s*/, '').trim() : '';

      return {
        id,
        date,
        title,
        summary,
        content,
        sourceFile: `content/${section}/${fileName}`,
        sortKey: parseDateToEpoch(date),
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey || b.sourceFile.localeCompare(a.sourceFile))
    .map(({ sortKey, ...rest }) => rest);

  return entries;
}

function main() {
  const output = {
    projects: buildSection('projects'),
    tech: buildSection('tech'),
    writings: buildSection('writings'),
  };

  const banner =
    '// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n' +
    '// Source markdown lives in content/projects, content/tech, content/writings.\n';

  const payload =
    banner +
    'window.CONTENT_INDEX = ' +
    JSON.stringify(output, null, 2) +
    ';\n';

  fs.writeFileSync(OUTPUT_FILE, payload);
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main();
