// One-time (idempotent) seed: populates MongoDB Atlas `products` and
// `settings` collections from the defaults in lib/products.js and
// lib/config.js. Safe to re-run — it only fills in what's missing/empty,
// it never overwrites edits already made from /admin.
//
// Usage: node scripts/seed-db.mjs   (reads MONGODB_URI from .env.local)

import { MongoClient } from "mongodb";
import { readFileSync, existsSync } from "fs";
import { products } from "../lib/products.js";
import { shop, upi, whatsapp, phones, retail, bulk } from "../lib/config.js";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    if (!line.includes("=") || line.trim().startsWith("#")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
}
loadEnvLocal();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set (checked process.env and .env.local). Nothing to do.");
  process.exit(1);
}
const dbName = process.env.MONGODB_DB || "tilanga_ji";

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

const productsCol = db.collection("products");
const existingCount = await productsCol.estimatedDocumentCount();
if (existingCount > 0) {
  console.log(`products: already has ${existingCount} document(s) — skipping seed.`);
} else {
  const docs = products.map((p, i) => ({ ...p, _id: p.slug, _order: i }));
  await productsCol.insertMany(docs);
  console.log(`products: seeded ${docs.length} document(s).`);
}

const settingsCol = db.collection("settings");
const settingsDoc = await settingsCol.findOne({ _id: "shop" });
if (settingsDoc) {
  console.log("settings: document already exists — skipping seed.");
} else {
  await settingsCol.insertOne({
    _id: "shop",
    shop: { hours: "Open daily, 7:00 AM – 9:30 PM", ...shop },
    upi,
    whatsapp,
    phones,
    retail,
    bulk,
    updatedAt: new Date().toISOString(),
  });
  console.log("settings: seeded default document.");
}

await client.close();
console.log("Done.");
