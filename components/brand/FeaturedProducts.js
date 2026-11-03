"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryPills from "@/components/CategoryPills";

// Home-page "Featured products" grid with "shop by category" pills.
export default function FeaturedProducts({ products }) {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const options = [
    { id: "ships", label: "Ghar Mangaayein", icon: "ships" },
    ...categories.map((c) => ({ id: c, label: c, icon: c })),
  ];
  const [filter, setFilter] = useState("ships");

  // "Ghar mangaayein" leads with what ships, then fills the row with the
  // rest of the peda range so the grid never looks empty.
  const list =
    filter === "ships"
      ? [...products.filter((p) => p.deliverable), ...products.filter((p) => !p.deliverable && p.category === "Peda")]
      : products.filter((p) => p.category === filter);

  return (
    <div>
      <CategoryPills options={options} value={filter} onChange={setFilter} />
      <div key={filter} className="mt-10 grid animate-[fadeIn_.4s_ease] grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {list.slice(0, 4).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/menu" className="btn-3d inline-block rounded-xl bg-leaf px-8 py-3.5 text-[15px] font-extrabold text-cream">
          View More
        </Link>
      </div>
    </div>
  );
}
