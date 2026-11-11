"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import LogoBadge from "@/components/LogoBadge";

// The "Products" dropdown. The site sells the Classic Khoya Peda only,
// delivered within Bihar.
const productLinks = [
  { href: "/product/classic-khoya-peda", label: "Classic Khoya Peda" },
  { href: "/menu", label: "Order online (Bihar delivery)" },
];

const pageLinks = [
  { href: "/#story", label: "Our story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/track-order", label: "Track order" },
];

function Icon({ name, size = 22 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "home") return <svg {...p}><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" /></svg>;
  if (name === "user") return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>;
  if (name === "search") return <svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>;
  if (name === "bag") return <svg {...p}><path d="M5.5 8h13l-1 12.5h-11z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>;
  if (name === "grid") return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 4v4h6V4" /></svg>;
  return null;
}

export default function Navbar() {
  const [drawer, setDrawer] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const dropRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    }
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  function search(e) {
    e.preventDefault();
    setDrawer(false);
    router.push(q.trim() ? `/menu?q=${encodeURIComponent(q.trim())}` : "/menu");
  }

  const cart = (
    <Link
      href="/cart"
      aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
      className="flex h-12 min-w-14 items-center justify-center gap-1.5 rounded-2xl bg-leaf px-3.5 text-cream shadow-[0_6px_14px_-4px_rgba(47,74,29,0.5)] transition hover:-translate-y-0.5 hover:bg-leaf-dark"
    >
      <Icon name="bag" />
      <span key={totalItems} className="animate-[fadeIn_.3s_ease] text-[16px] font-extrabold">{totalItems}</span>
    </Link>
  );

  const logo = (
    // The logo carries the shop name itself, so no text beside it.
    <Link href="/" aria-label="Telangaji Peda — home" className="flex items-center transition-transform hover:scale-105" onClick={() => setDrawer(false)}>
      <LogoBadge size={64} priority className="h-[60px] w-auto lg:h-[76px]" />
    </Link>
  );

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-leaf/10 bg-gradient-to-r from-cream via-cream to-butter/70 backdrop-blur">
      {/* Desktop */}
      <div className="mx-auto hidden h-[88px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 lg:grid">
        <nav className="flex items-center gap-5">
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setDropdown((v) => !v)}
              aria-expanded={dropdown}
              className="flex items-center gap-2 rounded-xl bg-leaf-dark px-4 py-2.5 text-sm font-extrabold text-cream transition hover:bg-leaf"
            >
              <Icon name="grid" size={17} />
              Products
              <svg width="12" height="12" viewBox="0 0 12 12" className={`transition-transform ${dropdown ? "rotate-180" : ""}`} aria-hidden="true">
                <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            {dropdown && (
              <ul className="absolute left-0 top-full mt-2 w-64 animate-[fadeIn_.2s_ease] overflow-hidden rounded-2xl border border-leaf/15 bg-cream py-2 shadow-[0_18px_40px_-12px_rgba(47,74,29,0.45)]">
                {productLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setDropdown(false)} className="block px-4 py-2.5 text-[15px] font-semibold text-ink hover:bg-butter hover:text-leaf-dark">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/" aria-label="Home" className={`text-leaf-dark transition hover:text-leaf ${pathname === "/" ? "" : "opacity-80"}`}>
            <Icon name="home" />
          </Link>
          <Link href="/login" aria-label="Login" className="text-leaf-dark opacity-80 transition hover:text-leaf hover:opacity-100">
            <Icon name="user" />
          </Link>
          {pageLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[15px] font-bold text-leaf-dark transition hover:text-leaf">
              {l.label}
            </Link>
          ))}
        </nav>

        {logo}

        <div className="flex items-center justify-end gap-4">
          <form onSubmit={search} className="flex w-56 items-center border-b-2 border-leaf/25 focus-within:border-leaf">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full bg-transparent py-2 text-[15px] font-semibold text-ink outline-none placeholder:text-ink/45"
            />
            <button type="submit" aria-label="Search" className="text-leaf-dark">
              <Icon name="search" size={20} />
            </button>
          </form>
          {cart}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-[72px] items-center justify-between px-4 lg:hidden">
        <button onClick={() => setDrawer(true)} aria-label="Open menu" className="flex h-11 w-11 items-center justify-center text-leaf-dark">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6.5h18M3 12h18M3 17.5h18" />
          </svg>
        </button>
        {logo}
        {cart}
      </div>
    </header>

    {/* Mobile drawer — outside <header>: its backdrop-blur would otherwise
        trap these fixed layers inside the header's box. */}
      <div
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity lg:hidden ${drawer ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setDrawer(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 lg:hidden ${drawer ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!drawer}
      >
        <div className="flex items-center justify-between bg-leaf-dark px-5 py-4 text-cream">
          <span className="font-display text-xl font-black">Menu</span>
          <button onClick={() => setDrawer(false)} aria-label="Close menu" className="text-3xl leading-none">
            ×
          </button>
        </div>
        <form onSubmit={search} className="mx-5 mt-5 flex items-center rounded-xl border-2 border-leaf/25 px-3 focus-within:border-leaf">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" className="w-full bg-transparent py-2.5 text-[15px] outline-none" />
          <button type="submit" aria-label="Search" className="text-leaf-dark">
            <Icon name="search" size={20} />
          </button>
        </form>
        <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-6">
          <p className="px-2 pb-1 pt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-mustard">Products</p>
          {productLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setDrawer(false)} className="block rounded-xl px-3 py-2.5 text-[16px] font-bold text-ink hover:bg-butter">
              {l.label}
            </Link>
          ))}
          <p className="px-2 pb-1 pt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-mustard">Tilanga Ji</p>
          {[{ href: "/", label: "Home" }, ...pageLinks, { href: "/login", label: "Login" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setDrawer(false)} className="block rounded-xl px-3 py-2.5 text-[16px] font-bold text-ink hover:bg-butter">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
