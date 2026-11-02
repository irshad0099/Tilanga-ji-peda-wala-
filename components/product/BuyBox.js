"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";
import { packLabel } from "@/lib/packs";
import DeliveryTimeline from "@/components/product/DeliveryTimeline";

// Price, pack picker, quantity, add-to-cart / buy-now, delivery dates and the
// sticky mobile bar for one deliverable product. `packs` comes from
// lib/packs.js on the server so the numbers match what checkout charges.
export default function BuyBox({ product, packs, badges }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [boxes, setBoxes] = useState(packs[0].boxes);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const actionsRef = useRef(null);

  const pack = packs.find((p) => p.boxes === boxes) || packs[0];
  const save = pack.mrp - pack.price;

  // Show the sticky bar once the real buttons have scrolled out of view.
  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function handleAdd() {
    addItem(product, qty, boxes);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuy() {
    addItem(product, qty, boxes);
    router.push("/checkout");
  }

  return (
    <div>
      {/* Price */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        {pack.mrp > pack.price && (
          <span className="text-lg text-ink/45 line-through decoration-2">{formatRupees(pack.mrp)}</span>
        )}
        <span key={pack.price} className="animate-[fadeIn_.35s_ease] font-display text-4xl font-extrabold text-leaf">
          {formatRupees(pack.price)}
        </span>
        {save > 0 && (
          <span className="wood-sign ml-1 rounded-md px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-[#fff3d6]">
            You save {formatRupees(save)}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm font-semibold text-ink/70">MRP (incl. of all taxes)</p>

      {badges && <div className="mt-6">{badges}</div>}

      {/* Packs */}
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-ink/60">Select your pack</p>
      <div role="radiogroup" aria-label="Pack size" className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        {packs.map((p) => {
          const selected = p.boxes === boxes;
          const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
          return (
            <button
              key={p.boxes}
              role="radio"
              aria-checked={selected}
              onClick={() => setBoxes(p.boxes)}
              className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 ${
                selected
                  ? "shine -translate-y-1 border-leaf shadow-[0_12px_24px_-8px_rgba(40,61,16,0.45)]"
                  : "border-olive/40 hover:-translate-y-0.5 hover:border-olive"
              }`}
            >
              {p.tag && (
                <span className={`absolute right-0 top-0 rounded-bl-xl px-2 py-0.5 text-[10px] font-bold uppercase ${selected ? "bg-haldi text-leaf-dark" : "bg-cream-dark text-ink/60"}`}>
                  {p.tag}
                </span>
              )}
              <span className={`block px-2.5 pb-1.5 pt-4 font-display text-base font-bold sm:px-3 sm:text-lg ${selected ? "bg-leaf text-cream" : "bg-olive/15 text-leaf"}`}>
                {packLabel(p.boxes)}
              </span>
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-cream px-2.5 py-2.5 sm:px-3">
                <span className="text-[15px] font-bold text-ink">{formatRupees(p.price)}</span>
                {p.mrp > p.price && <span className="text-xs text-ink/45 line-through">{formatRupees(p.mrp)}</span>}
                {off > 0 && <span className="rounded-full bg-olive px-1.5 py-0.5 text-[10px] font-bold text-cream">{off}% off</span>}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quantity + actions */}
      <div ref={actionsRef} className="mt-7 flex gap-3">
        <div className="flex items-stretch overflow-hidden rounded-xl border-2 border-leaf">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="bg-leaf px-4 text-xl font-bold text-cream hover:bg-leaf-dark" aria-label="Decrease quantity">
            −
          </button>
          <span className="flex w-12 items-center justify-center bg-cream text-lg font-bold" aria-live="polite">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="bg-leaf px-4 text-xl font-bold text-cream hover:bg-leaf-dark" aria-label="Increase quantity">
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 rounded-xl border-2 border-leaf bg-cream py-3.5 text-[15px] font-bold text-leaf transition hover:bg-leaf hover:text-cream"
        >
          {added ? "✓ Added to cart" : "Add to cart"}
        </button>
      </div>
      <button onClick={handleBuy} className="btn-3d mt-4 w-full rounded-xl bg-leaf py-4 text-base font-extrabold uppercase tracking-wider text-cream">
        Buy it now · {formatRupees(pack.price * qty)}
      </button>
      <p className="mt-3 text-center text-sm font-semibold text-ink/70">
        Secure checkout · UPI, cards or cash on delivery · Invoice with every order
      </p>

      <div className="mt-8">
        <DeliveryTimeline />
      </div>

      {/* Sticky bar (phones) */}
      <div
        className={`fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-2xl bg-leaf p-2 shadow-[0_10px_30px_rgba(40,61,16,0.45)] transition-all duration-300 lg:hidden ${
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
        }`}
      >
        <label className="relative">
          <span className="sr-only">Pack size</span>
          <select
            value={boxes}
            onChange={(e) => setBoxes(Number(e.target.value))}
            className="appearance-none rounded-xl bg-leaf-dark py-3 pl-3 pr-8 text-sm font-bold text-cream outline-none"
          >
            {packs.map((p) => (
              <option key={p.boxes} value={p.boxes}>
                {packLabel(p.boxes)}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cream">▲</span>
        </label>
        <button onClick={handleAdd} className="flex-1 rounded-xl bg-cream py-3 text-sm font-extrabold uppercase tracking-wide text-leaf">
          {added ? "✓ Added" : `Add to cart · ${formatRupees(pack.price * qty)}`}
        </button>
      </div>
    </div>
  );
}
