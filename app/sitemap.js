import { getMenuProducts } from "@/lib/db/products.server";
import { SITE_URL } from "@/lib/seo";

// /sitemap.xml — every public page, so Google finds them all.
export default async function sitemap() {
  const products = await getMenuProducts();
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 })),
    { url: `${SITE_URL}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/track-order`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
