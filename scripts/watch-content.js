#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { buildIndex } = require("./build-content-index.js");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(ROOT, "content");
const POLL_MS = 1200;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function getSnapshot() {
  const dirs = [];
  if (fs.existsSync(CONTENT_ROOT)) {
    for (const entry of walkDirectories(CONTENT_ROOT)) {
      dirs.push(entry);
    }
  }

  const files = walk(CONTENT_ROOT)
    .map((filePath) => {
      const stat = fs.statSync(filePath);
      return [
        path.relative(ROOT, filePath),
        stat.size,
        Math.floor(stat.mtimeMs),
      ].join(":");
    })
    .sort();

  return [...dirs.sort(), ...files].join("\n");
}

function walkDirectories(dir, dirs = []) {
  if (!fs.existsSync(dir)) {
    return dirs;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    dirs.push(path.relative(ROOT, fullPath));
    walkDirectories(fullPath, dirs);
  }

  return dirs;
}

function rebuild(reason) {
  try {
    buildIndex();
    console.log(`[watch-content] updated from ${reason}`);
  } catch (error) {
    console.error(`[watch-content] ${error.message}`);
  }
}

function start() {
  let lastSnapshot = "";

  rebuild("startup");
  lastSnapshot = getSnapshot();

  console.log("[watch-content] watching content/ for changes");
  console.log("[watch-content] refresh the browser after saving files");

  setInterval(() => {
    const nextSnapshot = getSnapshot();
    if (nextSnapshot === lastSnapshot) {
      return;
    }

    lastSnapshot = nextSnapshot;
    rebuild("content change");
  }, POLL_MS);
}

start();
