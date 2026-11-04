import Link from "next/link";
import Image from "next/image";
import LogoBadge from "@/components/LogoBadge";
import VillageScene from "@/components/brand/VillageScene";
import { getSettings } from "@/lib/db/settings.server";

const columns = [
  {
    title: "Products",
    links: [
      { href: "/product/classic-khoya-peda", label: "Classic Khoya Peda" },
      { href: "/menu?category=Peda", label: "All peda" },
      { href: "/menu?category=Sweets", label: "Sweets" },
      { href: "/menu", label: "Full menu" },
    ],
  },
  {
    title: "General",
    links: [
      { href: "/#story", label: "Our story" },
      { href: "/gallery", label: "Gallery" },
      { href: "/track-order", label: "Track order" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms" },
      { href: "/refund-policy", label: "Refund policy" },
    ],
  },
];

const payApps = [
  { src: "/images/payment-icons/google-pay.png", alt: "Google Pay", w: 38 },
  { src: "/images/payment-icons/phonepe.png", alt: "PhonePe", w: 20 },
  { src: "/images/payment-icons/paytm.png", alt: "Paytm", w: 26 },
];

export default async function Footer() {
  const { shop, phones, whatsapp } = await getSettings();
  return (
    <footer className="relative overflow-hidden border-t border-leaf/10 text-ink">
      <VillageScene className="absolute inset-x-0 bottom-9 hidden h-80 w-full sm:block" />
      <VillageScene compact className="absolute inset-x-0 bottom-9 aspect-[600/320] w-full sm:hidden" />
      <div className="absolute inset-x-0 bottom-[290px] top-0 bg-gradient-to-b from-cream to-[#FFF4D6] sm:bottom-[350px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-64 pt-14 sm:px-6 sm:pb-80 lg:grid-cols-[1fr_1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoBadge size={60} />
            <span>
              <span className="block font-display text-3xl font-black text-leaf-dark">Tilanga Ji</span>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-mustard">Mashahur Peda · Since 1975</span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-[15px] font-semibold text-ink/75">
            Bihar&apos;s mashahur peda from the Ara–Patna highway — pure khoya, hand-shaped daily, shipped fresh across India.
          </p>
        </div>

        <div>
          <p className="text-center font-display text-2xl font-black uppercase tracking-wide text-leaf">
            Tilanga Ji parivaar se judiye
          </p>
          <p className="mt-2 text-center text-[15px] font-semibold text-ink/70">Offers, new batches and festival boxes — straight on WhatsApp.</p>
          <a
            href={`https://wa.me/${whatsapp.number}?text=${encodeURIComponent("Hi! Please add me to Tilanga Ji updates.")}`}
            target="_blank"
            rel="noreferrer"
            className="btn-3d mx-auto mt-5 flex w-fit items-center gap-2 rounded-xl bg-leaf px-6 py-3 text-[15px] font-extrabold text-cream"
          >
            Join on WhatsApp →
          </a>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center sm:text-left">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-black uppercase tracking-wider text-leaf-dark">{c.title}</p>
                <ul className="mt-2 space-y-1.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[14px] font-semibold text-ink/75 transition hover:text-leaf">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            {payApps.map((p) => (
              <Image key={p.alt} src={p.src} alt={p.alt} width={p.w} height={20} style={{ height: 20, width: "auto" }} />
            ))}
            <span className="rounded border border-ink/20 px-1.5 text-[11px] font-black text-ink/60">UPI</span>
            <span className="rounded border border-ink/20 px-1.5 text-[11px] font-black text-ink/60">CARDS</span>
            <span className="rounded border border-ink/20 px-1.5 text-[11px] font-black text-ink/60">COD</span>
          </div>
        </div>

        <div className="text-[14px] font-semibold text-ink/80">
          <p className="font-black uppercase tracking-wide text-ink">{shop.legalName}</p>
          {shop.gstin ? (
            <p className="mt-2">GST: {shop.gstin}</p>
          ) : (
            <p className="mt-2 w-fit rounded border border-dashed border-leaf/40 px-2 py-0.5 text-xs text-ink/50">GSTIN — add in /admin → Settings</p>
          )}
          <p className="mt-2">{shop.address}</p>
          <p className="mt-2">{shop.hours}</p>
          <p className="mt-4 font-black text-ink">For any query:</p>
          <ul className="mt-1 space-y-1">
            {phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 hover:text-leaf">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-leaf" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  </svg>
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a href={`https://wa.me/${whatsapp.number}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-leaf">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-leaf" aria-hidden="true">
                  <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
                </svg>
                WhatsApp the shop
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-leaf-dark/20 bg-leaf-dark/85 px-4 py-3 text-center text-xs font-bold text-cream/85">
        © {new Date().getFullYear()} {shop.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
