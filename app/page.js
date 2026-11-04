import { getAllProducts } from "@/lib/db/products.server";
import { getSettings } from "@/lib/db/settings.server";
import Reveal from "@/components/Reveal";
import ProductHero from "@/components/product/ProductHero";
import FeaturedProducts from "@/components/brand/FeaturedProducts";
import JourneyTimeline from "@/components/brand/JourneyTimeline";
import MediaSection from "@/components/brand/MediaSection";
import ReelsSection from "@/components/brand/ReelsSection";
import FaqFounder from "@/components/brand/FaqFounder";
import ReviewsCarousel from "@/components/brand/ReviewsCarousel";
import VisitBar from "@/components/brand/VisitBar";

const STORY =
  "Tilanga Ji started this shop as a small tea stall on the Ara–Patna highway in 1975. The peda became so popular that the shop grew around it, purely on word of mouth from one traveller to the next — and the recipe hasn't changed since.";

export default async function HomePage() {
  const [products, { shop }] = await Promise.all([getAllProducts(), getSettings()]);
  const shipItem = products.find((p) => p.deliverable && p.inStock !== false);
  // The hero shows the shipping peda even on a sold-out day (it then says so).
  const heroItem = shipItem || products.find((p) => p.deliverable) || products[0];

  return (
    <div className="overflow-x-clip">
      {/* Hero: the peda that ships, ready to buy straight from the home page. */}
      {heroItem && <ProductHero product={heroItem} shop={shop} onHome />}

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-black text-leaf-dark sm:text-5xl">Featured Products</h2>
          <p className="mt-2 text-[16px] font-bold text-ink/70">Shop by category</p>
        </Reveal>
        <div className="mt-8">
          <FeaturedProducts products={products} />
        </div>
      </section>

      <JourneyTimeline story={STORY} />
      <MediaSection />
      <ReelsSection product={shipItem} />
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
