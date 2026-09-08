import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessSteps from "@/components/ProcessSteps";
import Testimonials from "@/components/Testimonials";
import FAQAccordion from "@/components/FAQAccordion";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import SectionDivider from "@/components/SectionDivider";
import LegacyStats from "@/components/LegacyStats";
import LocationSection from "@/components/LocationSection";
import GalleryGrid from "@/components/GalleryGrid";
import { products, getFeaturedProduct } from "@/lib/products";
import { formatRupees } from "@/lib/format";

export default function HomePage() {
  const featured = getFeaturedProduct();
  const menuPreview = products.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-body text-sm font-semibold text-maroon">
              सकड्डी, आरा-पटना हाईवे · स्थापित 1975
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-teal sm:text-5xl">
              Bihar&apos;s mashahur peda, since 1975.
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink/80">
              What began as a small tea stall on the Ara–Patna highway is now
              the peda travellers plan their stops around. Pure khoya, hand
              shaped daily — now shipped fresh across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="rounded-lg bg-maroon px-6 py-3 text-[15px] font-semibold text-cream hover:bg-maroon/90"
              >
                Order online
              </Link>
              <Link
                href="/gallery"
                className="rounded-lg border-2 border-teal px-6 py-3 text-[15px] font-semibold text-teal hover:bg-teal hover:text-cream"
              >
                See the shop
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/75">
              <span>Fresh daily batches</span>
              <span>Pure khoya, no additives</span>
              <span>Shipped pan-India</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="arch-top overflow-hidden rounded-3xl border-2 border-gold/50">
              <Image
                src="/images/photos/peda-platter.jpg"
                alt="A plate of fresh khoya peda garnished with pistachio"
                width={900}
                height={1000}
                className="aspect-4/5 w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border-2 border-gold/50 bg-cream p-4 text-center shadow-none">
              <p className="text-xs font-semibold uppercase tracking-wide text-maroon/80">
                {featured.badge}
              </p>
              <h2 className="font-display text-lg text-teal">{featured.name}</h2>
              <p className="mt-1 text-base font-semibold text-maroon">
                {formatRupees(featured.price)}{" "}
                <span className="text-sm font-normal text-ink/40 line-through">
                  {formatRupees(featured.mrp)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy stats */}
      <section className="bg-cream-dark/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-maroon">Our Legacy</p>
            <h2 className="mt-1 font-display text-3xl text-teal">
              Fifty Years On The Same Highway
            </h2>
            <SectionDivider />
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-ink/75">
              Tilanga Ji started this shop as a small tea stall in 1975. The
              peda became so popular that the shop grew around it — and the
              recipe hasn&apos;t changed since.
            </p>
          </div>
          <div className="mt-10">
            <LegacyStats />
          </div>
        </div>
      </section>

      {/* Menu preview */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-maroon">Our Menu</p>
            <h2 className="mt-1 font-display text-3xl text-teal">Peda, Barfi &amp; Gift Boxes</h2>
            <SectionDivider />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuPreview.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/menu"
              className="rounded-lg border-2 border-teal px-6 py-3 text-[15px] font-semibold text-teal hover:bg-teal hover:text-cream"
            >
              View full menu
            </Link>
          </div>
        </div>
      </section>

      {/* Bulk orders */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl border-2 border-gold/40 bg-cream-dark/40 p-8 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-maroon">Bulk &amp; Wholesale</p>
            <h2 className="mt-1 font-display text-3xl text-teal">
              Ordering For A Wedding Or Festival?
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/80">
              Order peda and barfi by the kilo at wholesale rates. Choose your mix and date,
              pay a small advance online, and we deliver it fresh to your home or venue across
              Bihar.
            </p>
            <Link
              href="/bulk-order"
              className="mt-6 inline-block rounded-lg bg-maroon px-6 py-3 text-[15px] font-semibold text-cream hover:bg-maroon/90"
            >
              Start a bulk order
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border-2 border-gold/40">
            <Image
              src="/images/photos/laddu.jpg"
              alt="Trays of sweets prepared for a large order"
              width={900}
              height={700}
              className="aspect-4/3 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it's made */}
      <section className="bg-cream-dark/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-maroon">How It&apos;s Made</p>
            <h2 className="mt-1 font-display text-3xl text-teal">From Kadhai To Your Table</h2>
            <SectionDivider />
          </div>
          <div className="mt-10">
            <ProcessSteps />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-maroon">Why Choose Us</p>
          <h2 className="mt-1 font-display text-3xl text-teal">A Highway Favourite, Made Simple</h2>
          <SectionDivider />
        </div>
        <div className="mt-10">
          <WhyChooseUs />
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-cream-dark/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-maroon">Gallery</p>
            <h2 className="mt-1 font-display text-3xl text-teal">A Look Inside The Shop</h2>
            <SectionDivider />
          </div>
          <div className="mt-10">
            <GalleryGrid />
          </div>
          <div className="mt-8 text-center">
            <Link href="/gallery" className="text-sm font-semibold text-teal hover:text-maroon">
              View full gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery estimate */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <p className="text-sm font-semibold text-maroon">Shipping</p>
        <h2 className="mt-1 font-display text-3xl text-teal">Delivered Fresh, Pan-India</h2>
        <SectionDivider />
        <p className="mx-auto mt-4 max-w-xl text-[15px] text-ink/75">
          Enter your pincode to get an estimated delivery window before you order.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-lg text-left">
            <DeliveryEstimate />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-cream-dark/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-maroon">Find Us</p>
            <h2 className="mt-1 font-display text-3xl text-teal">The Original Shop</h2>
            <SectionDivider />
          </div>
          <div className="mt-10">
            <LocationSection />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-maroon">Customer Reviews</p>
            <h2 className="mt-1 font-display text-3xl text-teal">Loved On The Highway And Beyond</h2>
            <SectionDivider />
          </div>
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-dark/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-maroon">FAQ</p>
            <h2 className="mt-1 font-display text-3xl text-teal">Before You Order</h2>
            <SectionDivider />
          </div>
          <div className="mt-10">
            <FAQAccordion />
          </div>
        </div>
      </section>
    </div>
  );
}
