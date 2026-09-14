// Server-only shop-settings persistence in MongoDB Atlas. Falls back to the
// static defaults in lib/config.js whenever the database isn't configured,
// isn't reachable, or has no settings document yet.

import { getDb, isDbConfigured } from "@/lib/mongodb";
import {
  shop as defaultShop,
  upi as defaultUpi,
  whatsapp as defaultWhatsapp,
  phones as defaultPhones,
  retail as defaultRetail,
  bulk as defaultBulk,
} from "@/lib/config";

const COLLECTION = "settings";
const DOC_ID = "shop";

export function defaultSettings() {
  return {
    shop: { hours: "Open daily, 7:00 AM – 9:30 PM", ...defaultShop },
    upi: { ...defaultUpi },
    whatsapp: { ...defaultWhatsapp },
    phones: [...defaultPhones],
    retail: { ...defaultRetail },
    bulk: { ...defaultBulk },
  };
}

function merge(stored) {
  const d = defaultSettings();
  if (!stored) return d;
  return {
    shop: { ...d.shop, ...stored.shop },
    upi: { ...d.upi, ...stored.upi },
    whatsapp: { ...d.whatsapp, ...stored.whatsapp },
    phones: Array.isArray(stored.phones) && stored.phones.length ? stored.phones : d.phones,
    retail: { ...d.retail, ...stored.retail },
    bulk: { ...d.bulk, ...stored.bulk },
  };
}

export async function getSettings() {
  if (!isDbConfigured()) return defaultSettings();
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID });
    return merge(doc);
  } catch {
    return defaultSettings();
  }
}

/** Deep-merge patch (admin only) — e.g. { upi: { vpa: "..." } }. */
export async function updateSettings(patch) {
  const current = await getSettings();
  const next = {
    shop: { ...current.shop, ...patch.shop },
    upi: { ...current.upi, ...patch.upi },
    whatsapp: { ...current.whatsapp, ...patch.whatsapp },
    phones: Array.isArray(patch.phones) ? patch.phones : current.phones,
    retail: { ...current.retail, ...patch.retail },
    bulk: { ...current.bulk, ...patch.bulk },
  };
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: DOC_ID }, { $set: { ...next, updatedAt: new Date().toISOString() } }, { upsert: true });
  return next;
}
