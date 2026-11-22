// Server-only shop-settings persistence in MongoDB Atlas. Falls back to the
// static defaults in lib/config.js whenever the database isn't configured,
// isn't reachable, or has no settings document yet.

import { unstable_cache } from "next/cache";
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

async function readSettings() {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID });
  return merge(doc);
}

// Every page (the footer at least) needs settings, so cache the read rather
// than hitting MongoDB on each request. The admin dashboard calls
// /api/revalidate after saving, so edits still show on the next page load. A failed read throws, which
// unstable_cache doesn't store — the fallback below is never cached.
const readSettingsCached = unstable_cache(readSettings, ["settings"], { tags: ["settings"], revalidate: 300 });

export async function getSettings() {
  if (!isDbConfigured()) return defaultSettings();
  try {
    return await readSettingsCached();
  } catch {
    return defaultSettings();
  }
}
