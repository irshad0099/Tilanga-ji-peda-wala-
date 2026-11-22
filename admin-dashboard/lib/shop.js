// Talking to the shop site (tilangaji.com).
//
// Env: SHOP_URL (default https://tilangaji.com) and REVALIDATE_SECRET — the
// same value as REVALIDATE_SECRET on the shop's Vercel project.

export const SHOP_URL = (process.env.SHOP_URL || "https://tilangaji.com").replace(/\/$/, "");

/**
 * The shop caches the menu and settings for a few minutes. After an edit
 * here, ask it to drop those caches so the change shows at once. Failure is
 * not fatal — the cache expires on its own within 5 minutes.
 */
export async function refreshShop(tags) {
  if (!process.env.REVALIDATE_SECRET) return false;
  try {
    const res = await fetch(`${SHOP_URL}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": process.env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Photo paths in the DB are relative to the shop site. */
export function shopImage(src) {
  if (!src) return null;
  return /^https?:/.test(src) ? src : `${SHOP_URL}${src}`;
}
