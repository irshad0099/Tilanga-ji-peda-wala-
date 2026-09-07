import MenuGrid from "@/components/MenuGrid";
import { products, getCategories } from "@/lib/products";

export const metadata = {
  title: "Menu - Tilanga Ji Ka Mashahur Peda Dukan",
  description: "Browse pure khoya peda, kesar peda, barfi and gift boxes from Tilanga Ji.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-maroon">Our Menu</p>
        <h1 className="mt-1 font-display text-4xl text-teal">Peda, Barfi &amp; Gift Boxes</h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-ink/75">
          Everything is made fresh in small batches. Search by name or filter
          by category to find what you're craving.
        </p>
      </div>
      <div className="mt-10">
        <MenuGrid products={products} categories={getCategories()} />
      </div>
    </div>
  );
}
