"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";

// Shop-grid card: photo with a "Sale" ribbon and size pill, name, struck MRP,
// price and % off, then one full-width action button.
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const dineIn = product.deliverable === false;
  const soldOut = product.inStock === false;
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-leaf/15 bg-cream p-2.5 shadow-[0_2px_0_rgba(47,74,29,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-18px_rgba(47,74,29,0.45)] sm:p-3">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* One ribbon, most important first: sold out › shop only › sale. */}
        {soldOut ? (
          <span className="absolute right-0 top-2.5 rounded-l-full bg-wood px-3 py-1 text-xs font-extrabold text-cream shadow">Sold out</span>
        ) : dineIn ? (
          <span className="absolute right-0 top-2.5 rounded-l-full bg-wood px-3 py-1 text-xs font-extrabold text-cream shadow">Shop only</span>
        ) : (
          off > 0 && <span className="absolute right-0 top-2.5 rounded-l-full bg-leaf px-3 py-1 text-xs font-extrabold text-cream shadow">Sale</span>
        )}
        {product.weight && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-leaf px-2.5 py-1 text-[11px] font-extrabold text-cream shadow">
            {product.weight.replace(/ box$/i, "")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col items-center px-1 pt-3 text-center">
        {product.hindiName && <p className="text-[13px] font-semibold text-olive">{product.hindiName}</p>}
        <Link href={`/product/${product.slug}`} className="mt-0.5 text-[14px] font-extrabold uppercase leading-snug tracking-wide text-ink transition-colors hover:text-leaf sm:text-[15px]">
          {product.name}
        </Link>
        <div className="mt-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-3">
          {off > 0 && <span className="text-[13px] font-semibold text-ink/45 line-through">{formatRupees(product.mrp)}</span>}
          <span className="text-[17px] font-extrabold text-ink">{formatRupees(product.price)}/-</span>
          {off > 0 && <span className="rounded-full bg-leaf px-2 py-0.5 text-[11px] font-extrabold text-cream">-{off}% OFF</span>}
        </div>
      </div>

      {soldOut ? (
        <span className="mt-3 block rounded-xl bg-ink/10 py-3 text-center text-[13px] font-extrabold uppercase tracking-wider text-ink/50">Sold out today</span>
      ) : dineIn ? (
        <Link
          href={`/product/${product.slug}`}
          className="mt-3 block rounded-xl border-2 border-leaf py-2.5 text-center text-[13px] font-extrabold uppercase tracking-wider text-leaf transition hover:bg-leaf hover:text-cream"
        >
          Visit shop to try
        </Link>
      ) : (
        <button
          onClick={handleAdd}
          className="btn-3d mt-3 w-full rounded-xl bg-leaf py-3 text-[13px] font-extrabold uppercase tracking-wider text-cream sm:text-sm"
        >
          {added ? "✓ Added" : "Add to cart"}
        </button>
      )}
    </div>
  );
}
