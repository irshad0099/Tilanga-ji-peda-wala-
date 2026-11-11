"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

// The menu: the products we deliver, with a search box. The header's search
// lands here with ?q= already set. Cards sit centred so a short menu (today
// it is just the Classic Khoya Peda) doesn't hug the left edge.
export default function MenuGrid({ products }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => !q || `${p.name} ${p.hindiName || ""} ${p.category}`.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div>
      <div className="mx-auto flex max-w-md items-center rounded-2xl border-2 border-leaf/20 bg-cream px-4 focus-within:border-leaf">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-leaf" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search peda…"
          aria-label="Search the menu"
          className="w-full bg-transparent px-3 py-3 text-[15px] font-semibold outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-[15px] font-semibold text-ink/60">Nothing matches that — try another name.</p>
      ) : (
        <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-5">
          {filtered.map((product) => (
            <div key={product.slug} className="w-[calc(50%-6px)] sm:w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
