"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";
import { packLabel } from "@/lib/packs";
import { flyToCart } from "@/lib/flyToCart";
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

  function handleAdd(e) {
    addItem(product, qty, boxes);
    flyToCart(e.currentTarget, product.image);
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
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3">
        {pack.mrp > pack.price && (
          <span className="text-[15px] font-semibold text-ink/45 line-through">{formatRupees(pack.mrp)}</span>
        )}
        <span key={pack.price} className="animate-[fadeIn_.35s_ease] font-display text-[34px] font-extrabold leading-none text-[#6E9A2A]">
          {formatRupees(pack.price)}
        </span>
        {save > 0 && (
          <span className="wood-sign ml-1 rounded-[5px] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-[#fff3d6]">
            You save {formatRupees(save)}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-bold text-ink">MRP (Incl. of all taxes)</p>

      {badges && <div className="mt-6">{badges}</div>}

      {/* Packs */}
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70">Select your quantity</p>
      <div role="radiogroup" aria-label="Pack size" className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-3">
        {packs.map((p) => {
          const selected = p.boxes === boxes;
          const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
          return (
            <button
              key={p.boxes}
              role="radio"
              aria-checked={selected}
              onClick={() => setBoxes(p.boxes)}
              className={`relative rounded-lg border-2 text-left transition-all duration-200 ${
                selected ? "border-leaf-dark shadow-[0_10px_20px_-12px_rgba(40,61,16,0.7)]" : "border-olive/60 hover:-translate-y-0.5"
              }`}
            >
              {p.tag && (
                <span className="absolute -top-2.5 right-3 z-10 rounded border border-leaf-dark/40 bg-cream px-2 py-px text-[9px] font-extrabold uppercase tracking-wide text-leaf-dark">
                  {p.tag}
                </span>
              )}
              {/* The shine sweep lives on the strip, not the card — the card
                  must not clip the tag that sits over its top edge. */}
              <span className={`block rounded-t-[5px] px-3 py-1.5 text-[15px] font-extrabold text-cream ${selected ? "shine bg-leaf-dark" : "bg-olive/80"}`}>
                {packLabel(p.boxes)}
              </span>
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-b-[5px] bg-cream px-3 py-2.5">
                <span className="whitespace-nowrap text-[13px] font-bold text-ink">{formatRupees(p.price)}</span>
                {p.mrp > p.price && <span className="whitespace-nowrap text-[11px] text-ink/45 line-through">{formatRupees(p.mrp)}</span>}
                {off > 0 && (
                  <span className="whitespace-nowrap rounded-full bg-[#6E9A2A] px-2 py-0.5 text-[10px] font-extrabold text-cream sm:ml-auto">{off}% Off</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quantity + actions */}
      <div ref={actionsRef} className="mt-6 flex gap-2.5">
        <div className="flex items-stretch overflow-hidden rounded-lg border-2 border-leaf-dark">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 bg-leaf-dark text-xl font-bold text-cream transition hover:bg-leaf" aria-label="Decrease quantity">
            −
          </button>
          <span className="flex w-16 items-center justify-center bg-cream text-lg font-bold" aria-live="polite">
            {qty}
          </span>
          <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="w-11 bg-leaf-dark text-xl font-bold text-cream transition hover:bg-leaf" aria-label="Increase quantity">
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 rounded-lg border-2 border-leaf/50 bg-cream py-3 text-[15px] font-bold text-leaf transition hover:border-leaf-dark hover:bg-leaf-dark hover:text-cream"
        >
          {added ? "✓ Added to cart" : "Add To Cart"}
        </button>
      </div>
      <button
        onClick={handleBuy}
        className="buy-pulse shine mt-3 w-full [--pulse-base:0_4px_0_#1c2f10] rounded-lg bg-leaf-dark py-3.5 text-[15px] font-extrabold uppercase tracking-wider text-cream shadow-[0_4px_0_#1c2f10] transition hover:-translate-y-0.5 hover:bg-leaf active:translate-y-1 active:shadow-none"
      >
        Abhi order karein · {formatRupees(pack.price * qty)}
      </button>
      <p className="mt-3 text-center text-[13px] font-semibold text-ink">
        Since 1975 | Secure checkout | UPI, cards or cash on delivery
      </p>

      <div className="mt-6">
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
        <button
          onClick={handleAdd}
          aria-label={added ? "Added to cart" : "Add to cart"}
          className="flex h-[46px] w-12 shrink-0 items-center justify-center rounded-xl bg-leaf-dark text-cream"
        >
          {added ? (
            <span className="text-lg font-black">✓</span>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5.5 8h13l-1 12.5h-11z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8M12 12v5M9.5 14.5h5" />
            </svg>
          )}
        </button>
        <button onClick={handleBuy} className="buy-pulse flex-1 rounded-xl bg-haldi py-3 text-sm font-extrabold uppercase tracking-wide text-leaf-dark">
          Order now · {formatRupees(pack.price * qty)}
        </button>
      </div>
    </div>
  );
}
