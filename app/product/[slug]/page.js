import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products as defaultProducts } from "@/lib/products";
import { getAllProducts, getProductBySlug } from "@/lib/db/products.server";
import { getSettings } from "@/lib/db/settings.server";
import { packsFor } from "@/lib/packs";
import { certifications, fssaiLicence, productDetails, productGallery } from "@/lib/content";
import Gallery from "@/components/product/Gallery";
import BuyBox from "@/components/product/BuyBox";
import TrustBadges from "@/components/product/TrustBadges";
import ProductTabs from "@/components/product/ProductTabs";
import ProductCard from "@/components/ProductCard";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Branch from "@/components/Branch";
import MediaSection from "@/components/brand/MediaSection";
import ReelsSection from "@/components/brand/ReelsSection";
import FaqFounder from "@/components/brand/FaqFounder";
import ReviewsCarousel from "@/components/brand/ReviewsCarousel";

// Pre-render the default menu's slugs at build time; any DB-only product
// (created later from /admin) still renders fine on first request.
export function generateStaticParams() {
  return defaultProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} - Tilanga Ji Ka Mashahur Peda Dukan`,
    description: product.description,
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
  const [product, settings, all] = await Promise.all([getProductBySlug(slug), getSettings(), getAllProducts()]);
  if (!product) notFound();
  const { shop } = settings;

  const canBuy = product.deliverable && product.inStock !== false;
  const packs = packsFor(product);
  const savePct = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const images = [product.image, ...(productGallery[product.slug] || [])];
  const details = productDetails[product.slug] || {};
  const tabs = [
    { id: "about", label: "Description", content: product.description },
    { id: "making", label: "Kaise banta hai", content: details.making },
    { id: "ingredients", label: "Ingredients", content: details.ingredients },
    { id: "serve", label: "Kaise khayein", content: details.serve },
    { id: "storage", label: "Storage", content: details.storage },
  ];
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 8);

  return (
    <div className="overflow-x-clip">
      {/* ---- Hero: gallery + buy box -------------------------------------- */}
      {/* Split hero: photos on a dark-green field, buying on cream. */}
      <section className="grid lg:min-h-[calc(100vh-124px)] lg:grid-cols-[1.4fr_1fr]">
        {/* overflow-clip (not -hidden): hidden would make this the sticky
            photo's scroll container and push it 132px down the panel. */}
        <div className="relative flex justify-center overflow-clip bg-leaf-dark px-4 pb-8 pt-6 sm:px-8 lg:items-start lg:px-12 lg:py-8">
          <Branch className="absolute -bottom-2 -left-6 hidden w-72 rotate-[-18deg] opacity-90 lg:block" />
          <div className="relative w-full lg:sticky lg:top-[132px]">
            <Gallery images={images} name={product.name} savePct={canBuy ? savePct : 0} />
          </div>
        </div>

        <div className="bg-cream px-4 pb-14 pt-6 sm:px-8 lg:px-7 lg:pt-5 xl:pr-10">
          <nav className="mb-2 text-xs font-semibold text-ink/50">
            <Link href="/menu" className="hover:text-leaf">Menu</Link>
            <span className="mx-1.5">/</span>
            <span>{product.name}</span>
          </nav>
          <div>
            <h1 className="font-display text-[28px] font-bold leading-tight text-leaf-dark sm:text-[32px]">
              {product.name}
              {product.weight && <span className="font-semibold"> – {product.weight}</span>}
            </h1>
            {product.hindiName && <p className="mt-0.5 text-[17px] font-bold text-olive">{product.hindiName}</p>}
            {shop.googleMapsUrl && (
              <a href={shop.googleMapsUrl} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink hover:text-leaf">
                <span className="text-[17px] text-[#F2A93B]">★</span>
                3,100+ reviews on Google
              </a>
            )}

            {canBuy ? (
              <BuyBox product={product} packs={packs} badges={<TrustBadges />} />
            ) : (
              <div className="mt-8 rounded-3xl border-2 border-olive/30 bg-cream p-6">
                <p className="font-display text-2xl font-bold text-leaf">
                  {product.deliverable ? "Sold out today" : "Served fresh at the shop"}
                </p>
                <p className="mt-2 text-[15px] text-ink/75">
                  {product.deliverable
                    ? "We've run out for today — check back tomorrow, or call the shop to ask when the next batch is ready."
                    : "This one is made through the day and eaten hot at the counter — we don't pack or deliver it. Come by and try it with a kulhad of chai."}
                </p>
                <p className="mt-3 text-sm text-ink/60">{shop.address}</p>
                <Link href="/menu?deliver=1" className="btn-3d mt-5 inline-block rounded-xl bg-leaf px-6 py-3 text-sm font-bold text-cream">
                  See what we deliver
                </Link>
                <div className="mt-8">
                  <TrustBadges />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---- Details tabs on a haldi band ------------------------------- */}
      <section className="relative bg-haldi pb-20 pt-16">
        <Branch className="absolute -top-6 left-0 w-48 sm:w-72" />
        <Branch className="absolute -top-6 right-0 w-40 sm:w-60" flip />
        <Reveal className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <ProductTabs tabs={tabs} />
        </Reveal>
      </section>

      <MediaSection />
      <ReelsSection product={canBuy ? product : all.find((p) => p.deliverable && p.inStock !== false)} />
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

      {/* ---- Related -------------------------------------------------------- */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading sub="Some of it ships, the rest is waiting at the shop.">Related Products</SectionHeading>
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

      {/* ---- Certifications ------------------------------------------------- */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading>Certifications &amp; trust marks</SectionHeading>
          </Reveal>
          <Reveal delay={100} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-olive/30 bg-cream p-4 text-center">
              <span className="font-display text-xl font-extrabold text-leaf">FSSAI</span>
              {fssaiLicence ? (
                <span className="mt-1 font-mono text-xs text-ink/70">Lic. {fssaiLicence}</span>
              ) : (
                <span className="mt-1 rounded border border-dashed border-leaf/40 px-2 py-0.5 text-[11px] font-semibold text-ink/50">Licence no. — add</span>
              )}
            </div>
            {(certifications.length ? certifications : [null, null, null]).map((c, i) =>
              c ? (
                <div key={c.name} className="flex items-center justify-center rounded-2xl border-2 border-olive/30 bg-cream p-4">
                  <Image src={c.logo} alt={c.name} width={120} height={60} className="h-12 w-auto object-contain" />
                </div>
              ) : (
                <Placeholder key={i} label="Certificate" className="min-h-24 !rounded-2xl" />
              )
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
