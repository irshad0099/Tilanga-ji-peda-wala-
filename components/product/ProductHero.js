import Link from "next/link";
import { packsFor } from "@/lib/packs";
import { productPhotos } from "@/lib/content";
import Gallery from "@/components/product/Gallery";
import BuyBox from "@/components/product/BuyBox";
import TrustBadges from "@/components/product/TrustBadges";
import Branch from "@/components/Branch";

// Split product hero: photos on a dark-green field, buying on cream. Used at
// the top of the home page (for the product that ships) and of every
// product page. `onHome` swaps the breadcrumb for a "full details" link.
export default function ProductHero({ product, shop, onHome = false }) {
  const canBuy = product.deliverable && product.inStock !== false;
  const savePct = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const images = productPhotos[product.slug] || [product.image];

  return (
    <section className="grid lg:min-h-[calc(100vh-124px)] lg:grid-cols-[1.4fr_1fr]">
      {/* overflow-clip (not -hidden): hidden would make this the sticky
          photo's scroll container and push it 132px down the panel. */}
      <div data-anim className="relative flex justify-center overflow-clip bg-leaf-dark px-4 pb-8 pt-6 sm:px-8 lg:items-start lg:px-12 lg:py-8">
        <Branch className="absolute -bottom-2 -left-6 hidden w-72 rotate-[-18deg] opacity-90 lg:block" />
        <div className="relative w-full lg:sticky lg:top-[132px]">
          <Gallery images={images} name={product.name} savePct={canBuy ? savePct : 0} />
        </div>
      </div>

      <div className="bg-cream px-4 pb-14 pt-6 sm:px-8 lg:px-7 lg:pt-5 xl:pr-10">
        {onHome ? (
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-mustard">Sakaddi ka mashahur · Since 1975</p>
        ) : (
          <nav className="mb-2 text-xs font-semibold text-ink/50">
            <Link href="/menu" className="hover:text-leaf">Menu</Link>
            <span className="mx-1.5">/</span>
            <span>{product.name}</span>
          </nav>
        )}
        <h1 className="font-display text-[28px] font-bold leading-tight text-leaf-dark sm:text-[32px]">
          {product.name}
          {product.weight && <span className="font-semibold"> – {product.weight}</span>}
        </h1>
        {product.hindiName && <p className="mt-0.5 text-[17px] font-bold text-olive">{product.hindiName}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {shop.googleMapsUrl && (
            <a href={shop.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink hover:text-leaf">
              <span className="text-[17px] text-[#F2A93B]">★</span>
              3,100+ reviews on Google
            </a>
          )}
          {onHome && (
            <Link href={`/product/${product.slug}`} className="text-[13px] font-bold text-leaf underline decoration-haldi decoration-2 underline-offset-4">
              View full details →
            </Link>
          )}
        </div>

        {canBuy ? (
          <BuyBox product={product} packs={packsFor(product)} badges={<TrustBadges />} />
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
    </section>
  );
}
