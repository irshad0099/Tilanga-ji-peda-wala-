"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { logout } from "@/app/actions";

const NAV = [
  { href: "/", label: "Dashboard", icon: "home" },
  { href: "/orders", label: "Orders", icon: "orders" },
  { href: "/customers", label: "Customers", icon: "users" },
  { href: "/products", label: "Products", icon: "box" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

// Fixed sidebar on desktop; on phones a top bar with a slide-in menu.
export default function Sidebar({ email, openCount, shopUrl }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="h-12 w-auto rounded-xl bg-cream p-1" />
        <div>
          <p className="text-lg font-black leading-tight text-cream">Tilangaji</p>
          <p className="text-xs font-semibold text-cream/60">Shop admin</p>
        </div>
      </div>
      <ul className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-bold transition ${
                active(n.href) ? "bg-cream text-leaf-dark shadow" : "text-cream/80 hover:bg-white/10 hover:text-cream"
              }`}
            >
              <Icon name={n.icon} />
              {n.label}
              {n.href === "/orders" && openCount > 0 && (
                <span className="ml-auto rounded-full bg-haldi px-2 py-0.5 text-xs font-black text-leaf-dark">{openCount}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <a href={shopUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-cream/70 hover:bg-white/10 hover:text-cream">
          <Icon name="external" size={16} />
          View shop
        </a>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-cream/70 hover:bg-white/10 hover:text-cream">
            <Icon name="logout" size={16} />
            Sign out
          </button>
        </form>
        <p className="truncate px-3 pt-1 text-xs text-cream/40">{email}</p>
      </div>
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-leaf-dark lg:block">{nav}</aside>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-leaf-dark px-4 py-3 text-cream lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-1.5 hover:bg-white/10">
          <Icon name="menu" size={22} />
        </button>
        <p className="font-black">Tilangaji Admin</p>
        <span className="w-8" />
      </header>
      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-leaf-dark transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>{nav}</aside>
    </>
  );
}
