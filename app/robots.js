import { SITE_URL } from "@/lib/seo";

// /robots.txt — keep cart, checkout, invoices and the API out of search.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/cart", "/checkout", "/invoice/", "/login"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
