import { getSettings } from "@/lib/db/settings.server";

export default async function LocationSection() {
  const { shop } = await getSettings();
  return (
    <div className="grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-14">
      {/* Highway milestone, the kind every traveller passes on the way to the shop */}
      <svg viewBox="0 0 160 200" className="mx-auto w-36 md:w-44" aria-hidden="true">
        <path d="M20 200V70a60 60 0 0 1 120 0v130z" fill="#FBF6EA" stroke="#3A2A1C" strokeOpacity=".25" strokeWidth="2" />
        <path d="M20 78V70a60 60 0 0 1 120 0v8z" fill="#E8B23A" />
        <text x="80" y="118" textAnchor="middle" fontFamily="Yatra One, serif" fontSize="22" fill="#6E1E2B">सकड्डी</text>
        <text x="80" y="146" textAnchor="middle" fontFamily="Hind, sans-serif" fontSize="11" fontWeight="600" fill="#3A2A1C" fillOpacity=".7">ARA–PATNA HWY</text>
        <rect x="0" y="188" width="160" height="12" fill="#3A2A1C" fillOpacity=".12" />
      </svg>

      <div>
        <h2 className="font-display text-4xl text-maroon sm:text-5xl">दुकान पर आइए</h2>
        <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink/85">{shop.address}</p>
        <p className="mt-2 text-[15px] text-ink/70">{shop.hours}</p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Tilanga+Ji+Ka+Mashahur+Peda+Dukan+Sakaddi"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-md bg-maroon px-6 py-3 text-[15px] font-semibold text-cream hover:bg-maroon-dark"
        >
          Rasta dekhein (Google Maps)
        </a>
      </div>
    </div>
  );
}
