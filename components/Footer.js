import Link from "next/link";
import Image from "next/image";
import LogoBadge from "@/components/LogoBadge";
import Reveal from "@/components/Reveal";
import VillageScene from "@/components/brand/VillageScene";
import HomeIllustration from "@/components/brand/HomeIllustration";
import { getSettings } from "@/lib/db/settings.server";
import { fssaiLicence } from "@/lib/content";

const columns = [
  {
    title: "Products",
    links: [
      { href: "/product/classic-khoya-peda", label: "Classic Khoya Peda" },
      { href: "/menu", label: "Order online" },
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
    <footer data-anim className="relative overflow-hidden text-ink">
      {/* Two drifting waves where the page meets the footer. Each path is two
          wavelengths of the same curve, so sliding it by half loops cleanly. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 overflow-hidden">
        <svg className="ft-wave ft-wave-back" viewBox="0 0 2880 40" preserveAspectRatio="none">
          <path d="M0 0 H2880 V14 C2760 30 2640 30 2520 14 C2400 -2 2280 -2 2160 14 C2040 30 1920 30 1800 14 C1680 -2 1560 -2 1440 14 C1320 30 1200 30 1080 14 C960 -2 840 -2 720 14 C600 30 480 30 360 14 C240 -2 120 -2 0 14 Z" />
        </svg>
        <svg className="ft-wave ft-wave-front" viewBox="0 0 2880 40" preserveAspectRatio="none">
          <path d="M0 0 H2880 V8 C2760 22 2640 22 2520 8 C2400 -6 2280 -6 2160 8 C2040 22 1920 22 1800 8 C1680 -6 1560 -6 1440 8 C1320 22 1200 22 1080 8 C960 -6 840 -6 720 8 C600 22 480 22 360 8 C240 -6 120 -6 0 8 Z" />
        </svg>
      </div>
      <VillageScene className="absolute inset-x-0 bottom-9 hidden h-80 w-full sm:block" />
      <VillageScene compact className="absolute inset-x-0 bottom-9 aspect-[600/320] w-full sm:hidden" />
      <div className="absolute inset-x-0 bottom-[290px] top-0 bg-gradient-to-b from-cream to-[#FFF4D6] sm:bottom-[350px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-64 pt-14 sm:px-6 sm:pb-80 lg:grid-cols-[1fr_1.4fr_1fr]">
        <Reveal>
          {/* Logo with the animated home beside it, both on one baseline. */}
          <div className="flex items-end gap-3">
            <LogoBadge size={150} className="h-[140px] w-auto sm:h-[150px]" />
            <HomeIllustration className="w-[150px] shrink-0 sm:w-[170px]" />
          </div>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.2em] text-mustard">Mashahur Peda · Since 1975</p>
          <p className="mt-5 max-w-xs text-[15px] font-semibold text-ink/75">
            Bihar&apos;s mashahur peda from the Ara–Patna highway — pure khoya, hand-shaped daily, delivered fresh across Bihar.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-center font-display text-2xl font-black uppercase tracking-wide text-leaf">
            Tilanga Ji parivaar se judiye
          </p>
          <p className="mt-2 text-center text-[15px] font-semibold text-ink/70">Offers, new batches and festival boxes — straight on WhatsApp.</p>
          <a
            href={`https://wa.me/${whatsapp.number}?text=${encodeURIComponent("Hi! Please add me to Tilanga Ji updates.")}`}
            target="_blank"
            rel="noreferrer"
            className="btn-3d ft-shine ft-pulse mx-auto mt-5 flex w-fit items-center gap-2 overflow-hidden rounded-xl bg-leaf px-6 py-3 text-[15px] font-extrabold text-cream"
          >
            Join on WhatsApp <span className="ft-nudge inline-block">→</span>
          </a>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center sm:text-left">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="ft-heading text-sm font-black uppercase tracking-wider text-leaf-dark">{c.title}</p>
                <ul className="mt-2 space-y-1.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="ft-link text-[14px] font-semibold text-ink/75 hover:text-leaf">
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
              <Image key={p.alt} src={p.src} alt={p.alt} width={p.w} height={20} className="ft-chip" style={{ height: 20, width: "auto" }} />
            ))}
            {["UPI", "CARDS", "COD"].map((t) => (
              <span key={t} className="ft-chip rounded border border-ink/20 px-1.5 text-[11px] font-black text-ink/60">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={240} className="text-[14px] font-semibold text-ink/80">
          <p className="ft-heading font-black uppercase tracking-wide text-ink">{shop.legalName}</p>
          {shop.gstin ? (
            <p className="mt-2">GST: {shop.gstin}</p>
          ) : (
            <p className="mt-2 w-fit rounded border border-dashed border-leaf/40 px-2 py-0.5 text-xs text-ink/50">GSTIN — add in /admin → Settings</p>
          )}
          {fssaiLicence && <p className="mt-1">FSSAI Lic. No.: {fssaiLicence}</p>}
          <p className="mt-2">{shop.address}</p>
          <p className="mt-2">{shop.hours}</p>
          <p className="mt-4 font-black text-ink">For any query:</p>
          <ul className="mt-1 space-y-1">
            {phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/[^\d+]/g, "")}`} className="ft-contact inline-flex items-center gap-2 hover:text-leaf">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ft-ring text-leaf" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  </svg>
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a href={`https://wa.me/${whatsapp.number}`} target="_blank" rel="noreferrer" className="ft-contact inline-flex items-center gap-2 hover:text-leaf">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ft-ring text-leaf" aria-hidden="true">
                  <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
                </svg>
                WhatsApp the shop
              </a>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="relative flex flex-col items-center justify-between gap-2 border-t border-leaf-dark/20 bg-leaf-dark/90 px-4 py-3 text-xs font-bold text-cream/85 sm:flex-row sm:pl-6 sm:pr-24">
        <span>© {new Date().getFullYear()} {shop.legalName}. All rights reserved.</span>
        <span>
          Made with <span className="ft-heart inline-block text-[#FF8FA3]">♥</span> in Sakaddi, Bihar
        </span>
        <a href="#" className="inline-flex items-center gap-1.5 rounded-full border border-cream/30 px-3 py-1 transition hover:border-haldi hover:text-haldi">
          Back to top
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ft-up" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
