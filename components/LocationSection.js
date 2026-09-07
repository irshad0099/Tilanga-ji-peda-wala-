export default function LocationSection() {
  return (
    <div className="grid gap-8 rounded-2xl border border-gold/30 bg-cream p-6 sm:p-8 lg:grid-cols-2">
      <div>
        <h3 className="font-display text-xl text-teal">Visit the original shop</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
          Sakaddi Bazaar, Ara–Patna Highway
          <br />
          Bhojpur District, Bihar 802160
        </p>
        <p className="mt-4 text-[15px] text-ink/80">Open daily: 7:00 AM – 9:30 PM</p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Tilanga+Ji+Ka+Mashahur+Peda+Dukan+Sakaddi"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal-dark"
        >
          Get directions
        </a>
      </div>
      <svg viewBox="0 0 300 220" className="w-full max-w-sm justify-self-center" aria-hidden="true">
        <rect width="300" height="220" rx="16" fill="#F0E3C8" />
        <path d="M20 180 Q100 100 150 140 Q220 90 280 60" stroke="#B8892E" strokeWidth="6" fill="none" strokeDasharray="2 14" strokeLinecap="round" />
        <circle cx="150" cy="110" r="14" fill="#DB8A1F" />
        <path d="M150 96 a14 14 0 1 1 -0.1 0 z" fill="#DB8A1F" />
        <path d="M150 96 L150 140 L138 118 Z" fill="#DB8A1F" />
        <circle cx="150" cy="108" r="5" fill="#FBF3E5" />
        <text x="150" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fill="#6E1E2B">Sakaddi, Ara–Patna Highway</text>
      </svg>
    </div>
  );
}
