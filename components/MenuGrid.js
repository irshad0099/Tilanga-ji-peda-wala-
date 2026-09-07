"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function MenuGrid({ products, categories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search sweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "border-teal bg-teal text-cream"
                  : "border-teal/30 text-teal hover:bg-cream-dark"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-ink/60">
          Nothing matches that search. Try a different name or category.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
