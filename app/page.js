import { getMenuProducts } from "@/lib/db/products.server";
import { getSettings } from "@/lib/db/settings.server";
import Reveal from "@/components/Reveal";
import ProductHero from "@/components/product/ProductHero";
import JourneyTimeline from "@/components/brand/JourneyTimeline";
import FaqFounder from "@/components/brand/FaqFounder";
import ReviewsCarousel from "@/components/brand/ReviewsCarousel";
import VisitBar from "@/components/brand/VisitBar";

const STORY =
  "Tilanga Ji started this shop as a small tea stall on the Ara–Patna highway in 1975. The peda became so popular that the shop grew around it, purely on word of mouth from one traveller to the next — and the recipe hasn't changed since.";

export default async function HomePage() {
  const [products, { shop }] = await Promise.all([getMenuProducts(), getSettings()]);
  // The hero shows the peda even on a sold-out day (it then says so).
  const heroItem = products.find((p) => p.inStock !== false) || products[0];

  return (
    <div className="overflow-x-clip">
      {/* Hero: the peda we deliver, ready to buy straight from the home page. */}
      {heroItem && <ProductHero product={heroItem} shop={shop} onHome />}

      <JourneyTimeline story={STORY} />
      <FaqFounder />

      {/* Reviews */}
      <section className="bg-cream pb-6 pt-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-black text-leaf-dark sm:text-5xl">Customer Reviews</h2>
          </Reveal>
          <div className="mt-8">
            <ReviewsCarousel googleUrl={shop.googleMapsUrl} />
          </div>
        </div>
      </section>

      <VisitBar />
    </div>
  );
}
