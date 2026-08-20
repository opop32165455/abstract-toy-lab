import { buildCatalog } from "./catalog-lib.mjs";

const catalog = await buildCatalog();
console.log(`Catalog generated: ${catalog.items.length} design asset(s).`);
