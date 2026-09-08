"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const dineIn = product.deliverable === false;

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border-2 border-teal/15 bg-cream-dark/40">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className="h-52 w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {dineIn && (
          <span className="absolute left-3 top-3 rounded-full bg-teal/90 px-2.5 py-1 text-xs font-semibold text-cream">
            At the shop only
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.badge && (
          <span className="w-fit rounded-full bg-maroon/10 px-2.5 py-0.5 text-xs font-semibold text-maroon">
            {product.badge}
          </span>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg text-teal">{product.name}</h3>
        </Link>
        <p className="text-sm text-ink/70">{product.weight}</p>
        <p className="text-sm text-ink/80">{product.tagline}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-maroon">{formatRupees(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-ink/40 line-through">{formatRupees(product.mrp)}</span>
          )}
        </div>
        {dineIn ? (
          <p className="mt-3 rounded-lg border border-teal/25 bg-cream/60 py-2.5 text-center text-sm font-medium text-teal">
            Dine-in · no delivery
          </p>
        ) : (
          <button
            onClick={handleAdd}
            className="mt-3 w-full rounded-lg bg-teal py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-teal-dark"
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}
