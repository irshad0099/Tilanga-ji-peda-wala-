// Structured data (schema.org JSON-LD) so Google understands the shop and
// its product: name, address, hours, phone, price and stock. No ratings —
// Google ignores self-published review stars and can penalise them.

export const SITE_URL = "https://tilangaji.com";

const abs = (path) => (path?.startsWith("http") ? path : `${SITE_URL}${path || ""}`);

/** "Open daily, 7:00 AM – 9:30 PM" → "Mo-Su 07:00-21:30" (null if unclear). */
function openingHours(text) {
  const m = String(text || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM).*?(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  const t = (h, min, ap) => `${String((Number(h) % 12) + (/pm/i.test(ap) ? 12 : 0)).padStart(2, "0")}:${min}`;
  return `Mo-Su ${t(m[1], m[2], m[3])}-${t(m[4], m[5], m[6])}`;
}

export function shopJsonLd({ shop, phones }) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FoodEstablishment"],
    "@id": `${SITE_URL}/#shop`,
    name: shop.legalName,
    alternateName: ["Tilangaji Peda", "Tilanga Ji Peda", "Sakaddi Peda"],
    url: SITE_URL,
    logo: abs("/images/brand/logo-tilangaji.png"),
    image: abs("/images/peda/tilangaji-khoya-peda-box.jpg"),
    description: "Sakaddi ka mashahur peda since 1975 — pure khoya and desi ghee, hand-made daily.",
    telephone: phones?.[0],
    foundingDate: "1975",
    servesCuisine: "Indian sweets",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sakaddi Bazaar, Ara–Patna Highway",
      addressLocality: "Sakaddi, Bhojpur",
      addressRegion: "Bihar",
      postalCode: "802160",
      addressCountry: "IN",
    },
    areaServed: { "@type": "State", name: "Bihar" },
    ...(openingHours(shop.hours) ? { openingHours: openingHours(shop.hours) } : {}),
    ...(shop.googleMapsUrl ? { hasMap: shop.googleMapsUrl, sameAs: [shop.googleMapsUrl] } : {}),
  };
}

export function productJsonLd(product, { shop }) {
  const url = `${SITE_URL}/product/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name}${product.weight ? ` (${product.weight})` : ""}`,
    image: [abs(product.image)],
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: "Tilangaji" },
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#shop`, "@type": "LocalBusiness", name: shop.legalName },
      areaServed: { "@type": "State", name: "Bihar" },
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

/** Renders JSON-LD safely ("<" escaped so the JSON can't close the tag). */
export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
