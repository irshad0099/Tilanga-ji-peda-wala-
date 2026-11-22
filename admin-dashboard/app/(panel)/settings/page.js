import { getShopSettings } from "@/lib/data";
import { isDbConfigured } from "@/lib/mongodb";
import { SHOP_URL } from "@/lib/shop";
import { PageHeader, DbMissing } from "@/components/ui";
import SettingsForm from "@/components/SettingsForm";

export const metadata = { title: "Settings" };

// What the shop is showing now (its built-in defaults merged with saved
// settings), overlaid with the saved document so a fresh edit always shows.
async function loadSettings() {
  let live = {};
  try {
    const res = await fetch(`${SHOP_URL}/api/settings`, { cache: "no-store" });
    if (res.ok) live = (await res.json()).settings || {};
  } catch {
    // Fall back to the database alone.
  }
  const saved = (await getShopSettings()) || {};
  const shop = { ...live.shop, ...saved.shop };
  // An en dash once got saved as U+FFFD by a wrongly-encoded request.
  if (shop.hours) shop.hours = shop.hours.replace(/�/g, "–");
  return {
    shop,
    whatsapp: { ...live.whatsapp, ...saved.whatsapp },
    phones: saved.phones?.length ? saved.phones : live.phones || [],
    retail: { ...live.retail, ...saved.retail },
  };
}

export default async function SettingsPage() {
  if (!isDbConfigured()) return <DbMissing />;
  const settings = await loadSettings();
  return (
    <>
      <PageHeader title="Settings" subtitle="Shop details, contact numbers and delivery charges." />
      <SettingsForm s={settings} />
    </>
  );
}
