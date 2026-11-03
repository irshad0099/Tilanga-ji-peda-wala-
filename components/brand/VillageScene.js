// Original footer illustration: rolling fields at dusk with a hut, a tree,
// a haystack and a grazing cow. Purely decorative.
export default function VillageScene({ className = "" }) {
  return (
    <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF6DC" />
          <stop offset="1" stopColor="#FCE3B8" />
        </linearGradient>
      </defs>
      <rect width="1440" height="360" fill="url(#vs-sky)" />
      <circle cx="1180" cy="120" r="46" fill="#FFD27A" opacity="0.8" />
      {/* far hills */}
      <path d="M0 210 C180 150 330 170 480 196 C640 222 760 150 930 160 C1100 170 1250 210 1440 170 V360 H0Z" fill="#C9C46A" />
      {/* near hills */}
      <path d="M0 260 C200 210 380 240 560 250 C760 262 900 220 1080 228 C1240 236 1340 260 1440 248 V360 H0Z" fill="#A9B04A" />
      <path d="M0 320 C240 290 520 300 760 312 C1000 324 1220 296 1440 300 V360 H0Z" fill="#8E9A3A" />
      {/* path */}
      <path d="M640 360 C690 320 760 300 860 290 C960 282 1040 270 1100 252" fill="none" stroke="#D9B98A" strokeWidth="26" strokeLinecap="round" opacity="0.85" />
      {/* tree */}
      <g transform="translate(150 150)">
        <path d="M30 120 C32 90 28 60 34 30" stroke="#6B3F1D" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="20" r="40" fill="#6F8A2C" />
        <circle cx="0" cy="38" r="30" fill="#7E9550" />
        <circle cx="66" cy="40" r="32" fill="#5E7A28" />
      </g>
      {/* hut */}
      <g transform="translate(360 196)">
        <rect x="10" y="30" width="90" height="46" fill="#E7C891" />
        <path d="M-6 34 L55 -6 L116 34 Z" fill="#B07A3B" />
        <path d="M-6 34 L55 -6 L116 34" fill="none" stroke="#8A5524" strokeWidth="4" />
        <rect x="44" y="46" width="22" height="30" fill="#6B3F1D" />
      </g>
      {/* haystack */}
      <path d="M560 262 C566 220 616 220 622 262 Z" fill="#E3B54A" />
      {/* cow */}
      <g transform="translate(1000 232)">
        <ellipse cx="40" cy="22" rx="38" ry="18" fill="#F4EFE4" stroke="#4A3B2A" strokeWidth="2" />
        <path d="M74 14 C88 8 98 14 96 26 C94 32 84 32 78 28" fill="#F4EFE4" stroke="#4A3B2A" strokeWidth="2" />
        <path d="M86 8 L92 0 M80 8 L78 0" stroke="#4A3B2A" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 36 V54 M28 38 V54 M52 38 V54 M66 36 V54" stroke="#4A3B2A" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="34" cy="16" rx="10" ry="7" fill="#B07A3B" opacity="0.7" />
      </g>
      {/* birds */}
      <path d="M700 90 q8 -8 16 0 q8 -8 16 0 M760 70 q6 -6 12 0 q6 -6 12 0 M640 110 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="#6B5B3A" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
