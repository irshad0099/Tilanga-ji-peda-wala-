import MenuGrid from "@/components/MenuGrid";
import { products, getCategories } from "@/lib/products";

export const metadata = {
  title: "Menu - Tilanga Ji Ka Mashahur Peda Dukan",
  description: "Pure khoya peda (shipped across India), plus litti-chokha, fresh sweets and kulhad chai served at the shop.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-maroon">Our Menu</p>
        <h1 className="mt-1 font-display text-4xl text-teal">Peda, Sweets &amp; Dhaba Plates</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink/75">
          <span className="font-medium text-ink">Peda and gift boxes</span> ship across India — add
          them to the cart and check out. <span className="font-medium text-ink">Litti-chokha,
          fresh sweets and chai</span> are made through the day and served at the shop only.
        </p>
      </div>
      <div className="mt-10">
        <MenuGrid products={products} categories={getCategories()} />
      </div>
    </div>
  );
}
