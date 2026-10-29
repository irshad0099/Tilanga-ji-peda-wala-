import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ProcessSteps from "@/components/ProcessSteps";
import Testimonials from "@/components/Testimonials";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import LocationSection from "@/components/LocationSection";
import { getAllProducts } from "@/lib/db/products.server";
import { getSettings } from "@/lib/db/settings.server";
import { formatRupees } from "@/lib/format";

// Only the shop's own photos appear on the home page — stock shots made
// the site look generic. Swap files in /public/images/photos/ to update.
const shopPhotos = [
  { src: "/images/photos/gur-peda.jpg", caption: "गुड़ पेड़ा", note: "Gur peda" },
  { src: "/images/photos/litti-chokha.jpg", caption: "लिट्टी-चोखा", note: "Straight off the coals" },
  { src: "/images/photos/milk-cake.jpg", caption: "मिल्क केक", note: "Milk cake" },
];

export default async function HomePage() {
  const [products, { shop }] = await Promise.all([getAllProducts(), getSettings()]);
  const deliverable = products.filter((p) => p.deliverable && p.inStock !== false);
  const featured = products.find((p) => p.featured) || products[0];
  const [deliveryItem] = deliverable;

  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div>
            <p className="text-sm font-medium tracking-wide text-ink/70">
              सकड्डी, आरा–पटना हाईवे · Bhojpur, Bihar
            </p>
            <h1 className="isolate mt-3 font-display text-5xl leading-[1.15] text-maroon sm:text-6xl lg:text-7xl">
              बिहार का <span className="brush">मशहूर</span> पेड़ा
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/85">
              Tilanga Ji ka khoya peda — the same recipe since 1975. Travellers on the highway plan
              their stop around it. Now we courier it to your door.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={deliveryItem ? `/product/${deliveryItem.slug}` : "/menu"}
                className="rounded-md bg-saffron px-7 py-3.5 text-base font-semibold text-cream shadow-[0_3px_0_var(--maroon-dark)] transition-transform hover:-translate-y-0.5"
              >
                पेड़ा मंगाइए →
              </Link>
              <Link
                href="/gallery"
                className="text-[15px] font-semibold text-maroon underline decoration-gold decoration-2 underline-offset-4 hover:decoration-saffron"
              >
                Dukaan ki photos dekhein
              </Link>
            </div>

            <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/70">
              {shop.googleMapsUrl ? (
                <a
                  href={shop.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-maroon hover:text-saffron"
                >
                  <span className="text-saffron">★</span> 3,100+ Google reviews
                </a>
              ) : (
                <span className="font-semibold text-maroon">3,100+ Google reviews</span>
              )}
              <span aria-hidden="true" className="text-gold">✦</span>
              <span>रोज़ ताज़ा, हाथ से बना</span>
              <span aria-hidden="true" className="text-gold">✦</span>
              <span>Pan-India delivery</span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mr-0">
            {/* Offset frame behind the photo, like a print pinned to a wall */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm border-2 border-gold" aria-hidden="true" />
            <Image
              src="/images/photos/peda-platter.jpg"
              alt="Fresh Classic Khoya Peda from Tilanga Ji's shop"
              width={900}
              height={1000}
              className="relative aspect-4/5 w-full rounded-sm object-cover"
              priority
            />
            <span className="stamp absolute -left-2 -top-7 h-24 w-24 bg-cream/90 text-maroon sm:-left-10 sm:h-28 sm:w-28">
              <span className="text-[10px] font-semibold tracking-[0.2em]">स्थापित</span>
              <span className="font-display text-3xl">1975</span>
              <span className="text-[10px] font-semibold tracking-[0.2em]">सकड्डी</span>
            </span>
            {featured && (
              <Link
                href={`/product/${featured.slug}`}
                className="absolute -bottom-8 right-4 rotate-2 rounded-sm bg-cream px-5 py-3 shadow-[0_6px_20px_rgba(58,42,28,0.18)] transition-transform hover:rotate-0"
              >
                <span className="block text-sm font-semibold text-ink/80">{featured.name}</span>
                <span className="font-display text-2xl text-maroon">{formatRupees(featured.price)}</span>
                {featured.mrp > featured.price && (
                  <span className="ml-2 text-sm text-ink/45 line-through">{formatRupees(featured.mrp)}</span>
                )}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Order online */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <h2 className="font-display text-4xl text-maroon sm:text-5xl">घर बैठे मंगाइए</h2>
            <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-ink/85">
              We ship just one thing — our Classic Khoya Peda — so it always travels well and
              reaches you soft. Everything else on the menu is made through the day and eaten hot at
              the shop.
            </p>
            <ul className="mt-6 space-y-2.5 text-[15px] text-ink/85">
              <li className="flex gap-3"><span className="text-saffron">—</span>Packed the same day it&apos;s made</li>
              <li className="flex gap-3"><span className="text-saffron">—</span>UPI or cash on delivery, invoice with every order</li>
              <li className="flex gap-3"><span className="text-saffron">—</span>Bhojpur same day · Bihar 1–2 days · rest of India 3–5 days</li>
            </ul>

            <div className="mt-9 max-w-lg border-l-2 border-gold pl-5">
              <p className="text-sm font-semibold text-maroon">Kab tak pahunchega? Pincode daalein</p>
              <div className="mt-3">
                <DeliveryEstimate />
              </div>
            </div>
          </div>

          {deliveryItem && (
            <div className="w-full max-w-sm justify-self-center lg:justify-self-end">
              <ProductCard product={deliveryItem} />
            </div>
          )}
        </div>
      </section>

      {/* Story — the one dark band on the page */}
      <section className="scallop-top mt-10 bg-maroon text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <figure className="relative mx-auto w-full max-w-sm -rotate-2">
            <Image
              src="/images/photos/kulhad-chai.jpg"
              alt="Kulhad chai at the shop, where it all began"
              width={800}
              height={900}
              className="aspect-8/9 w-full rounded-sm border-[6px] border-cream object-cover"
            />
            <figcaption className="mt-3 text-center text-sm text-cream/75">
              1975: a chai stall on the highway. The peda came later.
            </figcaption>
          </figure>

          <div>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">पचास साल, एक ही सड़क</h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-cream/85">
              Tilanga Ji started this shop as a small tea stall on the Ara–Patna highway in 1975.
              The peda became so popular that the shop grew around it, purely on word of mouth from
              one traveller to the next — and the recipe hasn&apos;t changed since.
            </p>
            <p className="mt-6 font-display text-xl text-gold">
              1975 से · 3,100+ Google reviews · रोज़ ताज़ा
            </p>

            <div className="mt-10 border-t border-cream/20 pt-8">
              <p className="text-sm font-semibold tracking-wide text-cream/70">कैसे बनता है</p>
              <div className="mt-4">
                <ProcessSteps />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Only-at-the-shop photo strip */}
      <section className="py-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
          <div>
            <h2 className="font-display text-4xl text-maroon sm:text-5xl">दुकान पर और भी है</h2>
            <p className="mt-3 max-w-md text-[15px] text-ink/80">
              Litti-chokha, fresh mithai and kulhad chai — these don&apos;t travel, so come eat
              them hot.
            </p>
          </div>
          <Link
            href="/menu"
            className="text-[15px] font-semibold text-maroon underline decoration-gold decoration-2 underline-offset-4 hover:decoration-saffron"
          >
            Poora menu dekhein →
          </Link>
        </div>

        <div className="photo-strip mt-10 flex gap-5 overflow-x-auto px-4 pb-2 sm:px-6 lg:mx-auto lg:max-w-6xl lg:overflow-visible">
          {shopPhotos.map((photo, i) => (
            <figure
              key={photo.src}
              className={`w-[75%] shrink-0 sm:w-[45%] lg:w-auto lg:flex-1 ${i === 1 ? "lg:mt-10" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.note}
                width={700}
                height={850}
                className="aspect-4/5 w-full rounded-sm object-cover"
              />
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="font-display text-xl text-maroon">{photo.caption}</span>
                <span className="text-sm text-ink/65">{photo.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-y border-gold/40 bg-cream-dark/45 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-4xl text-maroon sm:text-5xl">लोग क्या कहते हैं</h2>
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </section>


      {/* Visit */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <LocationSection />
      </section>
    </div>
  );
}
