"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";

// Pages where a sticky "Order Now" bar would just be clutter — already
// mid-checkout, already in the cart, or an internal/admin view.
// Product pages (and the home hero) have their own sticky buy bar
// (components/product/BuyBox.js).
const HIDDEN_PREFIXES = ["/cart", "/checkout", "/admin", "/login", "/track-order", "/invoice", "/product"];

export default function MobileOrderBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const p = (data?.products || []).find((p) => p.deliverable && p.inStock !== false);
        setProduct(p || null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 360);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The home page hero is a product buy box with its own sticky bar too.
  const hidden = pathname === "/" || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
  const show = !hidden && scrolled && product;

  function handleOrder() {
    setAdding(true);
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <>
      {show && <div aria-hidden className="h-[68px] sm:hidden" />}
      {show && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gold/40 bg-leaf px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] sm:hidden">
          <div className="min-w-0 text-cream">
            <p className="truncate text-xs text-cream/70">{product.name}</p>
            <p className="font-display text-lg leading-none">{formatRupees(product.price)}</p>
          </div>
          <button
            onClick={handleOrder}
            disabled={adding}
            className="shrink-0 rounded-lg bg-haldi px-5 py-2.5 text-sm font-bold text-leaf-dark hover:brightness-95 disabled:opacity-60"
          >
            {adding ? "Adding…" : "Order Now"}
          </button>
        </div>
      )}
    </>
  );
}
