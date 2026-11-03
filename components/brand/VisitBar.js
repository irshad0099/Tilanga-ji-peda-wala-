import { getSettings } from "@/lib/db/settings.server";

// Green band with big white tiles — directions, WhatsApp, call.
export default async function VisitBar() {
  const { shop, whatsapp, phones } = await getSettings();
  const tiles = [
    { href: "https://www.google.com/maps/search/?api=1&query=Tilanga+Ji+Ka+Mashahur+Peda+Dukan+Sakaddi", label: "Directions", sub: "Google Maps", icon: "pin", external: true },
    { href: `https://wa.me/${whatsapp.number}`, label: "WhatsApp", sub: "Chat with the shop", icon: "chat", external: true },
    { href: `tel:${(phones[0] || "").replace(/[^\d+]/g, "")}`, label: "Call", sub: phones[0], icon: "phone", external: false },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-8 rounded-[32px] bg-leaf px-6 py-10 sm:px-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="font-display text-4xl font-black text-cream sm:text-5xl">Dukaan Par Aaiye</h2>
          <p className="mt-3 max-w-sm text-[15px] font-semibold text-cream/80">{shop.address}</p>
          <p className="mt-1 text-sm font-bold text-haldi">{shop.hours}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {tiles.map((t) => (
            <a
              key={t.label}
              href={t.href}
              {...(t.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex flex-col items-center justify-center rounded-3xl bg-cream px-2 py-6 text-center transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_30px_-14px_rgba(0,0,0,0.45)] sm:py-8"
            >
              <span className="text-leaf transition-transform duration-300 group-hover:scale-110">
                <TileIcon name={t.icon} />
              </span>
              <span className="mt-3 font-display text-lg font-black text-ink sm:text-2xl">{t.label}</span>
              <span className="mt-0.5 hidden text-xs font-semibold text-ink/55 sm:block">{t.sub}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function TileIcon({ name }) {
  const p = { width: 38, height: 38, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "pin")
    return (
      <svg {...p}>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    );
  if (name === "chat")
    return (
      <svg {...p}>
        <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
        <path d="M9 10h6M9 13h4" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}
