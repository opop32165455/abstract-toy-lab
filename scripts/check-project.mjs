import { access, readFile } from "node:fs/promises";
import { buildCatalog, CATALOG_PATH, REVIEWS_PATH } from "./catalog-lib.mjs";

const required = ["index.html", "styles.css", "app.js", "DESIGN_RULES.md"];
for (const file of required) await access(new URL(`../${file}`, import.meta.url));

const catalog = await buildCatalog();
const reviews = JSON.parse(await readFile(REVIEWS_PATH, "utf8"));
const codes = new Set(catalog.items.map((item) => item.code));
if (codes.size !== catalog.items.length) throw new Error("Catalog contains duplicate design codes.");
if (reviews.schemaVersion !== 1) throw new Error("Unsupported reviews schema.");
JSON.parse(await readFile(CATALOG_PATH, "utf8"));
console.log(`Project check passed: ${catalog.items.length} assets, ${Object.keys(reviews.items).length} reviews.`);
