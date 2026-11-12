"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      {show && <div aria-hidden className="h-[76px] sm:hidden" />}
      {product && !hidden && (
        <div
          className={`fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-2xl bg-leaf py-2 pl-2 pr-2 shadow-[0_10px_30px_rgba(40,61,16,0.45)] transition-all duration-300 sm:hidden ${
            show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
          }`}
        >
          <Image src={product.image} alt="" width={96} height={96} className="h-12 w-12 shrink-0 rounded-xl border-2 border-cream/80 object-cover" />
          <div className="min-w-0 flex-1 text-cream">
            <p className="truncate text-xs font-semibold text-cream/75">{product.name}</p>
            <p className="font-display text-lg font-extrabold leading-tight">{formatRupees(product.price)}</p>
          </div>
          <button
            onClick={handleOrder}
            disabled={adding}
            className="buy-pulse shrink-0 rounded-xl bg-haldi px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-leaf-dark disabled:opacity-60"
          >
            {adding ? "Adding…" : "Order now"}
          </button>
        </div>
      )}
    </>
  );
}
