import Image from "next/image";
import { notFound } from "next/navigation";
import { products as defaultProducts } from "@/lib/products";
import { getMenuProducts, getMenuProductBySlug } from "@/lib/db/products.server";
import { getSettings } from "@/lib/db/settings.server";
import { certifications, fssaiLicence, productDetails } from "@/lib/content";
import ProductHero from "@/components/product/ProductHero";
import BoxContents from "@/components/product/BoxContents";
import ProductTabs from "@/components/product/ProductTabs";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import PromiseBand from "@/components/product/PromiseBand";
import Branch from "@/components/Branch";
import FaqFounder from "@/components/brand/FaqFounder";
import ReviewsCarousel from "@/components/brand/ReviewsCarousel";
import { JsonLd, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

// Pre-render the default menu's slugs at build time; any DB-only product
// (created later from the admin dashboard) still renders fine on first request.
export function generateStaticParams() {
  return defaultProducts.filter((p) => p.deliverable).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getMenuProductBySlug(slug);
  if (!product) return {};
  // The price leads the description so WhatsApp / Google previews show it.
  const price = `₹${product.price}${product.weight ? ` · ${product.weight}` : ""}`;
  const title = `${product.name} — ${price}`;
  const description = `${price} · ${productDetails[product.slug]?.about || product.description}`;
  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    // A page-level openGraph replaces the root one, so name the share card again.
    openGraph: {
      title: `${title} | Tilangaji Peda`,
      description,
      url: `/product/${product.slug}`,
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: `${product.name} from Tilangaji, Sakaddi` }],
    },
  };
}

function SectionHeading({ children, sub, light = false }) {
  return (
    <div className="text-center">
      <h2 className={`font-display text-3xl font-extrabold sm:text-4xl ${light ? "text-cream" : "text-leaf"}`}>{children}</h2>
      {sub && <p className={`mx-auto mt-2 max-w-lg text-[15px] ${light ? "text-cream/80" : "text-ink/70"}`}>{sub}</p>}
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const [product, settings, all] = await Promise.all([getMenuProductBySlug(slug), getSettings(), getMenuProducts()]);
  if (!product) notFound();
  const { shop } = settings;

  const canBuy = product.deliverable && product.inStock !== false;
  const details = productDetails[product.slug] || {};
  const tabs = [
    { id: "about", label: "Description", content: details.about || product.description },
    { id: "making", label: "Kaise banta hai", content: details.making },
    { id: "ingredients", label: "Ingredients", content: details.ingredients },
    { id: "serve", label: "Kaise khayein", content: details.serve },
    { id: "storage", label: "Storage", content: details.storage },
  ].filter((t) => t.content);
  const hasCerts = Boolean(fssaiLicence) || certifications.length > 0;
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 8);

  return (
    <div className="overflow-x-clip">
      <JsonLd data={productJsonLd(product, settings)} />
      <JsonLd data={breadcrumbJsonLd([["Home", "/"], ["Menu", "/menu"], [product.name, `/product/${product.slug}`]])} />
      <ProductHero product={product} shop={shop} />
      <BoxContents product={product} />

      {/* ---- Details tabs on a haldi band ------------------------------- */}
      <section className="relative bg-haldi pb-20 pt-16">
        <Branch className="absolute -top-6 left-0 w-48 sm:w-72" />
        <Branch className="absolute -top-6 right-0 w-40 sm:w-60" flip />
        <Reveal className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <ProductTabs tabs={tabs} />
        </Reveal>
      </section>

      <FaqFounder />

      {/* ---- Reviews ------------------------------------------------------- */}
      <section className="bg-cream pb-16 pt-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-black text-leaf-dark sm:text-5xl">Customer Reviews</h2>
          </Reveal>
          <div className="mt-8">
            <ReviewsCarousel googleUrl={shop.googleMapsUrl} />
          </div>
        </div>
      </section>

      {/* ---- Related (only once there's more than one product) ------------- */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <SectionHeading sub="More from the shop, delivered across Bihar.">Related Products</SectionHeading>
            </Reveal>
            <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
              {related.map((p) => (
                <div key={p.slug} className="w-60 shrink-0 snap-start sm:w-72">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <PromiseBand />

      {/* ---- Certifications (only once there are real ones) ------------------ */}
      {hasCerts && (
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading>Certifications &amp; trust marks</SectionHeading>
          </Reveal>
          <Reveal delay={100} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {fssaiLicence && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-olive/30 bg-cream p-4 text-center">
                <span className="font-display text-xl font-extrabold text-leaf">FSSAI</span>
                <span className="mt-1 font-mono text-xs text-ink/70">Lic. {fssaiLicence}</span>
              </div>
            )}
            {certifications.map((c) => (
              <div key={c.name} className="flex items-center justify-center rounded-2xl border-2 border-olive/30 bg-cream p-4">
                <Image src={c.logo} alt={c.name} width={120} height={60} className="h-12 w-auto object-contain" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      )}
    </div>
  );
}
