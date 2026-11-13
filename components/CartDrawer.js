"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/lib/useSettings";
import { formatRupees } from "@/lib/format";

// Slide-in cart from the right: opens from the navbar cart button and after
// "Add to cart", so shoppers can check what's in it without leaving the
// page. Shows a free-delivery progress bar, the items with +/− and remove,
// and the way on to checkout. Closes on Esc, the backdrop, or navigation.
export default function CartDrawer() {
  const { items, subtotal, totalItems, updateQty, removeItem, drawerOpen, closeCart } = useCart();
  const { settings } = useSettings();
  const pathname = usePathname();
  const closeRef = useRef(null);
  const freeAbove = settings.retail.freeShippingAbove;
  const left = Math.max(0, freeAbove - subtotal);
  const progress = Math.min(100, (subtotal / freeAbove) * 100);

  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        className={`fixed inset-y-0 right-0 z-[61] flex w-[92%] max-w-md flex-col bg-cream shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.45)] transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between bg-leaf-dark px-5 py-4 text-cream">
          <p className="font-display text-xl font-black">
            Aapka cart <span className="ml-1 rounded-full bg-haldi px-2.5 py-0.5 text-sm text-leaf-dark">{totalItems}</span>
          </p>
          <button ref={closeRef} onClick={closeCart} aria-label="Close cart" className="flex h-10 w-10 items-center justify-center rounded-full text-3xl leading-none transition hover:rotate-90 hover:bg-cream/10">
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="cd-empty text-6xl" aria-hidden="true">🛍️</span>
            <p className="mt-5 font-display text-2xl font-black text-leaf-dark">Cart khaali hai</p>
            <p className="mt-2 text-[15px] text-ink/65">Sakaddi ke mashahur pede bas ek click door hain.</p>
            <Link href="/product/classic-khoya-peda" onClick={closeCart} className="btn-3d mt-6 rounded-xl bg-leaf px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-cream">
              Peda dekhein
            </Link>
          </div>
        ) : (
          <>
            {/* free-delivery progress */}
            <div className="border-b border-leaf/10 bg-butter/60 px-5 py-3.5">
              <p className="text-[13px] font-bold text-ink/80">
                {left > 0 ? (
                  <>
                    <span className="text-leaf-dark">{formatRupees(left)}</span> aur — phir delivery free! 🚚
                  </>
                ) : (
                  <span className="text-leaf-dark">🎉 Free delivery mil gayi!</span>
                )}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-leaf/15">
                <div className="cd-bar h-full rounded-full bg-gradient-to-r from-leaf to-haldi transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((it) => (
                <li key={it.key} className="cd-item flex gap-3 rounded-2xl border border-leaf/10 bg-white/60 p-3">
                  <Image src={it.image} alt="" width={128} height={160} className="h-20 w-16 shrink-0 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[14px] font-extrabold leading-snug text-ink">{it.name}</p>
                      <button onClick={() => removeItem(it.key)} aria-label={`Remove ${it.name}`} className="shrink-0 text-ink/40 transition hover:text-[#C23B5A]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-ink/55">{it.weight}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center overflow-hidden rounded-lg border-2 border-leaf-dark">
                        <button onClick={() => updateQty(it.key, it.qty - 1)} aria-label="Decrease quantity" className="h-8 w-8 bg-leaf-dark font-bold text-cream">
                          −
                        </button>
                        <span className="w-9 text-center text-sm font-bold" aria-live="polite">
                          {it.qty}
                        </span>
                        <button onClick={() => updateQty(it.key, Math.min(20, it.qty + 1))} aria-label="Increase quantity" className="h-8 w-8 bg-leaf-dark font-bold text-cream">
                          +
                        </button>
                      </div>
                      <p className="font-display text-lg font-extrabold text-leaf-dark">{formatRupees(it.price * it.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-leaf/10 bg-cream px-5 pb-5 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-bold text-ink/70">Subtotal</span>
                <span className="font-display text-2xl font-black text-leaf-dark">{formatRupees(subtotal)}</span>
              </div>
              <p className="mt-0.5 text-xs text-ink/50">Delivery checkout par jodi jaayegi.</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="buy-pulse shine mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-dark py-3.5 text-[15px] font-extrabold uppercase tracking-wider text-cream transition hover:bg-leaf [--pulse-base:0_4px_0_#1c2f10]"
              >
                Checkout karein →
              </Link>
              <Link href="/cart" onClick={closeCart} className="mt-2.5 block text-center text-sm font-bold text-leaf underline decoration-haldi decoration-2 underline-offset-4">
                Poora cart dekhein
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
