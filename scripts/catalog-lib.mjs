import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");
export const DATA_DIR = path.join(PROJECT_ROOT, "data");
export const CATALOG_PATH = path.join(DATA_DIR, "catalog.json");
export const CATALOG_SCRIPT_PATH = path.join(DATA_DIR, "catalog.js");
export const REVIEWS_PATH = path.join(DATA_DIR, "reviews.json");
export const REVIEWS_SCRIPT_PATH = path.join(DATA_DIR, "reviews.js");
export const ASSET_ROOTS = ["assets"];
export const SUPPORTED_EXTENSIONS = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);

const normalize = (value) => value.split(path.sep).join("/");
const slug = (value) => value
  .normalize("NFKD")
  .replace(/[^a-zA-Z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .toUpperCase()
  .slice(0, 18) || "ASSET";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
  }
  return files;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function buildCatalog() {
  const reviews = await readJson(REVIEWS_PATH, { schemaVersion: 1, updatedAt: null, items: {} });
  const reviewEntries = Object.entries(reviews.items || {});
  const claimedCodes = new Set();
  const items = [];

  for (const root of ASSET_ROOTS) {
    const absoluteRoot = path.join(PROJECT_ROOT, root);
    try {
      if (!(await stat(absoluteRoot)).isDirectory()) continue;
    } catch {
      continue;
    }

    for (const absolute of await walk(absoluteRoot)) {
      const relativePath = normalize(path.relative(PROJECT_ROOT, absolute));
      const buffer = await readFile(absolute);
      const contentHash = createHash("sha256").update(buffer).digest("hex").slice(0, 12);
      const extension = path.extname(relativePath).toLowerCase();
      const name = path.basename(relativePath, extension);
      const directory = normalize(path.dirname(relativePath));
      const directReview = reviews.items?.[relativePath];
      const movedReview = reviewEntries.find(([, review]) =>
        review.contentHash === contentHash && !claimedCodes.has(review.code)
      )?.[1];
      const previous = directReview || movedReview;
      const category = directory.split("/").at(-1) || "root";
      const code = previous?.code || `ATL-${slug(category)}-${slug(name)}-${contentHash.slice(0, 6).toUpperCase()}`;
      claimedCodes.add(code);
      const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");
      items.push({
        code,
        path: relativePath,
        url: `${encodedPath}?v=${contentHash}`,
        directory,
        name,
        extension: extension.slice(1),
        kind: extension === ".svg" ? "svg" : "image",
        contentHash,
        defaultTags: [category, extension === ".svg" ? "vector" : "raster"]
      });
    }
  }

  const catalog = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    roots: ASSET_ROOTS,
    items
  };
  await writeFile(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  await writeFile(CATALOG_SCRIPT_PATH, `window.ABSTRACT_TOY_LAB_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, "utf8");
  await writeFile(REVIEWS_SCRIPT_PATH, `window.ABSTRACT_TOY_LAB_REVIEWS = ${JSON.stringify(reviews, null, 2)};\n`, "utf8");
  return catalog;
}

export async function readReviews() {
  return readJson(REVIEWS_PATH, { schemaVersion: 1, updatedAt: null, items: {} });
}

export async function saveReviews(payload) {
  const safeItems = {};
  for (const [assetPath, review] of Object.entries(payload?.items || {})) {
    if (typeof assetPath !== "string" || assetPath.includes("..")) continue;
    safeItems[assetPath] = {
      code: String(review.code || ""),
      contentHash: String(review.contentHash || ""),
      status: ["pending", "approved", "changes_requested", "rejected"].includes(review.status)
        ? review.status
        : "pending",
      tags: Array.isArray(review.tags) ? review.tags.map(String).map((tag) => tag.trim()).filter(Boolean).slice(0, 30) : [],
      comment: String(review.comment || "").slice(0, 10000),
      updatedAt: new Date().toISOString()
    };
  }
  const next = { schemaVersion: 1, updatedAt: new Date().toISOString(), items: safeItems };
  await writeFile(REVIEWS_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return next;
}
