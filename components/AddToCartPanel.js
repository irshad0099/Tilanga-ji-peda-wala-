"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartPanel({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(product, qty);
    router.push("/checkout");
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-teal/30">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-lg text-teal" aria-label="Decrease quantity">
            −
          </button>
          <span className="w-8 text-center text-[15px] font-medium">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-lg text-teal" aria-label="Increase quantity">
            +
          </button>
        </div>
        <span className="text-sm text-ink/60">{product.weight}</span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button onClick={handleAdd} className="flex-1 rounded-lg bg-teal py-3 text-[15px] font-semibold text-cream hover:bg-teal-dark">
          {added ? "Added to cart" : "Add to cart"}
        </button>
        <button onClick={handleBuyNow} className="flex-1 rounded-lg bg-maroon py-3 text-[15px] font-semibold text-cream hover:bg-maroon/90">
          Buy now
        </button>
      </div>
    </div>
  );
}
