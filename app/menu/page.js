import MenuGrid from "@/components/MenuGrid";
import { getAllProducts } from "@/lib/db/products.server";

export const metadata = {
  title: "Menu - Tilanga Ji Ka Mashahur Peda Dukan",
  description: "Classic Khoya Peda ships pan-India. Every other peda, our gift boxes, litti-chokha, fresh sweets and kulhad chai are served at the shop.",
};

export default async function MenuPage() {
  const products = await getAllProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-maroon">Our Menu</p>
        <h1 className="mt-1 font-display text-4xl text-teal">Peda, Sweets &amp; Dhaba Plates</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink/75">
          Only <span className="font-medium text-ink">Classic Khoya Peda</span> ships pan-India —
          add it to the cart and check out. Every other peda flavour, our gift boxes,{" "}
          <span className="font-medium text-ink">litti-chokha, fresh sweets and chai</span> are made
          through the day and served at the shop only — please visit us for these.
        </p>
      </div>
      <div className="mt-10">
        <MenuGrid products={products} categories={categories} />
      </div>
    </div>
  );
}
