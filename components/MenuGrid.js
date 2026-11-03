"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CategoryPills from "@/components/CategoryPills";

// Full menu with category pills and search. The header's dropdown and search
// box land here with ?category=, ?deliver=1 or ?q= already set.
export default function MenuGrid({ products, categories }) {
  const params = useSearchParams();
  const initial = params.get("deliver") === "1" ? "ships" : params.get("category") || "all";
  const [filter, setFilter] = useState(categories.includes(initial) || initial === "ships" ? initial : "all");
  const [query, setQuery] = useState(params.get("q") || "");

  const options = [
    { id: "all", label: "All", icon: "all" },
    { id: "ships", label: "Ships pan-India", icon: "ships" },
    ...categories.map((c) => ({ id: c, label: c, icon: c })),
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const byFilter = filter === "all" || (filter === "ships" ? p.deliverable : p.category === filter);
      const byQuery = !q || `${p.name} ${p.hindiName || ""} ${p.category}`.toLowerCase().includes(q);
      return byFilter && byQuery;
    });
  }, [products, filter, query]);

  return (
    <div>
      <CategoryPills options={options} value={filter} onChange={setFilter} />

      <div className="mx-auto mt-6 flex max-w-md items-center rounded-2xl border-2 border-leaf/20 bg-cream px-4 focus-within:border-leaf">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-leaf" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search peda, sweets, chai…"
          aria-label="Search the menu"
          className="w-full bg-transparent px-3 py-3 text-[15px] font-semibold outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-[15px] font-semibold text-ink/60">Nothing matches that — try another name or category.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
