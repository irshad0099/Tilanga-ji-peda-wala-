// Server-only product persistence in MongoDB Atlas. Falls back to the
// static list in lib/products.js whenever the database isn't configured,
// isn't reachable, or is simply empty (before the first seed) — the menu
// keeps working either way.

import { unstable_cache } from "next/cache";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { products as defaultProducts } from "@/lib/products";
import { productPhotos } from "@/lib/content";

const COLLECTION = "products";

function fromDoc(doc) {
  const { _id, _order, ...rest } = doc;
  return { slug: _id, ...rest };
}

// The shop's own photos (lib/content.js) replace whatever image is stored.
function withPhotos(list) {
  return list.map((p) => (productPhotos[p.slug] ? { ...p, image: productPhotos[p.slug][0] } : p));
}

async function readProducts() {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ _order: 1 }).toArray();
  return docs.map(fromDoc);
}

// Cached so pages don't wait on MongoDB every request. The admin dashboard
// (Telanga-admin-dashboard) writes products directly and then calls
// /api/revalidate, so edits show on the next page load. A failed read
// throws, which unstable_cache doesn't store — the fallback is never cached.
const readProductsCached = unstable_cache(readProducts, ["products"], { tags: ["products"], revalidate: 300 });

/** Full menu, in display order. */
export async function getAllProducts() {
  if (!isDbConfigured()) return withPhotos(defaultProducts);
  try {
    const list = await readProductsCached();
    return withPhotos(list.length ? list : defaultProducts);
  } catch {
    return withPhotos(defaultProducts);
  }
}

export async function getProductBySlug(slug) {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

/**
 * What the public site shows: only items we deliver (the Classic Khoya
 * Peda). Shop-only items stay in the database and in the admin dashboard, so flipping
 * `deliverable` back on brings one back without re-entering it.
 */
export async function getMenuProducts() {
  const all = await getAllProducts();
  return all.filter((p) => p.deliverable);
}

export async function getMenuProductBySlug(slug) {
  const menu = await getMenuProducts();
  return menu.find((p) => p.slug === slug);
}
