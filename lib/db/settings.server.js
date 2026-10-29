// Server-only shop-settings persistence in MongoDB Atlas. Falls back to the
// static defaults in lib/config.js whenever the database isn't configured,
// isn't reachable, or has no settings document yet.

import { getDb, isDbConfigured } from "@/lib/mongodb";
import {
  shop as defaultShop,
  whatsapp as defaultWhatsapp,
  phones as defaultPhones,
  retail as defaultRetail,
} from "@/lib/config";

const COLLECTION = "settings";
const DOC_ID = "shop";

export function defaultSettings() {
  return {
    shop: { hours: "Open daily, 7:00 AM – 9:30 PM", ...defaultShop },
    whatsapp: { ...defaultWhatsapp },
    phones: [...defaultPhones],
    retail: { ...defaultRetail },
  };
}

function merge(stored) {
  const d = defaultSettings();
  if (!stored) return d;
  return {
    shop: { ...d.shop, ...stored.shop },
    whatsapp: { ...d.whatsapp, ...stored.whatsapp },
    phones: Array.isArray(stored.phones) && stored.phones.length ? stored.phones : d.phones,
    retail: { ...d.retail, ...stored.retail },
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

/** Deep-merge patch (admin only) — e.g. { retail: { flatShippingFee: 59 } }. */
export async function updateSettings(patch) {
  const current = await getSettings();
  const next = {
    shop: { ...current.shop, ...patch.shop },
    whatsapp: { ...current.whatsapp, ...patch.whatsapp },
    phones: Array.isArray(patch.phones) ? patch.phones : current.phones,
    retail: { ...current.retail, ...patch.retail },
  };
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne(
      { _id: DOC_ID },
      {
        $set: { ...next, updatedAt: new Date().toISOString() },
        // Leftovers from the removed manual-UPI and bulk-order features.
        $unset: { upi: "", bulk: "" },
      },
      { upsert: true }
    );
  return next;
}
