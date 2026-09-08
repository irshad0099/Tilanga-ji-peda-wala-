"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import LogoBadge from "@/components/LogoBadge";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/bulk-order", label: "Bulk Order" },
  { href: "/gallery", label: "Gallery" },
  { href: "/track-order", label: "Track Order" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <LogoBadge size={46} />
          <span className="font-display leading-tight text-teal">
            <span className="block text-lg sm:text-xl">Tilanga Ji</span>
            <span className="block text-[11px] font-body font-medium tracking-wide text-maroon">
              Mashahur Peda Dukan
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-medium transition-colors hover:text-maroon ${
                pathname === link.href ? "text-maroon" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-[15px] font-medium text-ink hover:text-maroon sm:inline"
          >
            Login
          </Link>
          <Link href="/cart" className="relative inline-flex items-center" aria-label="View cart">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="text-teal"
            >
              <circle cx="9" cy="21" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="18" cy="21" r="1.5" fill="currentColor" stroke="none" />
              <path d="M2.5 3h2l2.2 12.1a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-maroon text-[11px] font-semibold text-cream">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-teal/30 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gold/30 bg-cream px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 text-[15px] font-medium ${
                pathname === link.href ? "bg-cream-dark text-maroon" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-[15px] font-medium text-ink">
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
