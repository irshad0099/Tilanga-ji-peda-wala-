import { getSettings } from "@/lib/db/settings.server";
import { formatRupees } from "@/lib/format";

function Diya() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d="M12 3c1.6 2.2 2.4 3.8 2.4 5a2.4 2.4 0 0 1-4.8 0c0-1.2.8-2.8 2.4-5z" fill="#FFD36B" />
      <path d="M3 13h18c-.6 4-4.4 7-9 7s-8.4-3-9-7z" fill="#EBC64C" />
      <path d="M6 13c1.5 1.4 3.6 2.2 6 2.2s4.5-.8 6-2.2" fill="none" stroke="#B8892E" strokeWidth="1.2" />
    </svg>
  );
}

// Scrolling marquee strip. The list is rendered twice so the CSS loop
// (.marquee-track → translateX(-50%)) is seamless; pauses on hover.
export default async function AnnouncementBar() {
  const { retail } = await getSettings();
  const messages = [
    "Fresh peda since 1975",
    `Free delivery above ${formatRupees(retail.freeShippingAbove)}`,
    "Order before 4 PM for same-day dispatch",
    "Pay online or cash on delivery",
  ];
  const loop = [...messages, ...messages, ...messages];
  return (
    <div className="marquee overflow-hidden bg-leaf-dark py-2 text-cream">
      <p className="sr-only">{messages.join(" · ")}</p>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {loop.map((m, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-3 px-5 text-xs font-bold uppercase tracking-[0.14em] sm:text-sm">
                <Diya />
                {m}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
