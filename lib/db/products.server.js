// Server-only product persistence in MongoDB Atlas. Falls back to the
// static list in lib/products.js whenever the database isn't configured,
// isn't reachable, or is simply empty (before the first seed) — the menu
// keeps working either way.

import { getDb, isDbConfigured } from "@/lib/mongodb";
import { products as defaultProducts } from "@/lib/products";

const COLLECTION = "products";

function fromDoc(doc) {
  const { _id, _order, ...rest } = doc;
  return { slug: _id, ...rest };
}

/** Full menu, in display order. */
export async function getAllProducts() {
  if (!isDbConfigured()) return defaultProducts;
  try {
    const db = await getDb();
    const docs = await db.collection(COLLECTION).find({}).sort({ _order: 1 }).toArray();
    if (!docs.length) return defaultProducts;
    return docs.map(fromDoc);
  } catch {
    return defaultProducts;
  }
}

export async function getProductBySlug(slug) {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

/** Create or fully replace one product (admin only). */
export async function upsertProduct(slug, data, order) {
  const db = await getDb();
  const patch = { ...data, slug };
  delete patch._id;
  await db.collection(COLLECTION).updateOne(
    { _id: slug },
    {
      $set: { ...patch, updatedAt: new Date().toISOString() },
      $setOnInsert: { _order: order ?? Date.now() },
    },
    { upsert: true }
  );
  return getProductBySlug(slug);
}

/** Partial update (admin only) — price, stock, badge, etc. */
export async function patchProduct(slug, patch) {
  const db = await getDb();
  const safe = { ...patch };
  delete safe._id;
  delete safe.slug;
  const res = await db
    .collection(COLLECTION)
    .updateOne({ _id: slug }, { $set: { ...safe, updatedAt: new Date().toISOString() } });
  if (res.matchedCount === 0) return null;
  return getProductBySlug(slug);
}

/**
 * One-time (idempotent) seed: if the products collection is empty, populate
 * it from lib/products.js so /admin has something to edit immediately.
 */
export async function seedProductsIfEmpty() {
  const db = await getDb();
  const count = await db.collection(COLLECTION).estimatedDocumentCount();
  if (count > 0) return { seeded: false, count };
  const docs = defaultProducts.map((p, i) => ({ ...p, _id: p.slug, _order: i }));
  await db.collection(COLLECTION).insertMany(docs);
  return { seeded: true, count: docs.length };
}
