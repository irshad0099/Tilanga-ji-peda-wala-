import { useId } from "react";

// Original animated footer scene: a village at golden hour. A cow is being
// milked into a pail, a man carries the milk along the path to a house and
// hands it to the woman at the door, then walks back for more. Behind them a
// boat drifts down the Ganga, mustard fields wave, and a delivery cyclist
// rings past with a box of pedas; butterflies and falling leaves fill the
// gaps. Motion is CSS (globals.css, "Village scene" and "Footer"), and the
// .pl-layer groups also shift with the mouse (SceneParallax.js).
// prefers-reduced-motion stops it.
//
// The story happens between x≈420 and x≈1000. `compact` (phones) frames
// just that stretch so the house, the man and the cow all fit.

// Mustard plants on the middle hill: [x, y] of each flower head.
const mustard = [
  ...Array.from({ length: 30 }, (_, i) => [10 + i * 9.5 + (i % 3) * 2, 258 + ((i * 7) % 5) * 8]),
  ...Array.from({ length: 34 }, (_, i) => [1090 + i * 10.5 + (i % 2) * 3, 250 + ((i * 7) % 5) * 9]),
];

// A parallax layer: shifts with the pointer by up to `depth` px.
function Layer({ depth, children }) {
  return (
    <g className="pl-layer" style={{ "--depth": depth }}>
      {children}
    </g>
  );
}

export default function VillageScene({ className = "", compact = false }) {
  // Two copies render in the footer (wide + compact) — keep gradient ids unique.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      viewBox={compact ? "410 40 600 320" : "0 0 1440 360"}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4D6" />
          <stop offset="1" stopColor="#FCD9A6" />
        </linearGradient>
        <radialGradient id={`${uid}sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE08A" />
          <stop offset="0.6" stopColor="#FFC65C" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFC65C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}river`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE0DC" />
          <stop offset="1" stopColor="#8FC3C2" />
        </linearGradient>
        <linearGradient id={`${uid}milk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F3EEE2" />
        </linearGradient>
      </defs>

      {/* sky, sun, clouds */}
      <rect x="-80" width="1600" height="360" fill={`url(#${uid}sky)`} />
      <Layer depth={4}>
      {/* slowly turning sun rays */}
      <g className="vs-rays" style={{ transformOrigin: "1210px 118px" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M1210 118 L1202 -40 L1218 -40 Z" fill="#FFE08A" opacity="0.28" transform={`rotate(${i * 30} 1210 118)`} />
        ))}
      </g>
      <circle className="vs-sun" cx="1210" cy="118" r="78" fill={`url(#${uid}sun)`} />
      <circle cx="1210" cy="118" r="38" fill="#FFD77A" />
      <g className="vs-cloud" style={{ animationDuration: "70s" }}>
        <path d="M160 92 a22 22 0 0 1 40 -10 a28 28 0 0 1 52 6 a18 18 0 0 1 4 34 h-92 a16 16 0 0 1 -4 -30z" fill="#FFFDF6" opacity="0.9" />
      </g>
      <g className="vs-cloud" style={{ animationDuration: "95s", animationDelay: "-40s" }}>
        <path d="M820 60 a18 18 0 0 1 32 -8 a24 24 0 0 1 44 6 a15 15 0 0 1 3 28 h-76 a13 13 0 0 1 -3 -26z" fill="#FFFDF6" opacity="0.8" />
      </g>

      {/* birds */}
      {[
        [0, 96, 0],
        [36, 80, -0.4],
        [62, 104, -0.8],
      ].map(([dx, y, d], i) => (
        <g key={i} className="vs-bird-fly" style={{ animationDelay: `${d - i * 6}s` }}>
          <path className="vs-bird-flap" d={`M${dx} ${y} q8 -8 16 0 q8 -8 16 0`} fill="none" stroke="#6B5B3A" strokeWidth="2.6" strokeLinecap="round" style={{ animationDelay: `${d}s` }} />
        </g>
      ))}

      {/* a flock far off, crossing the other way */}
      <g className="vs-flock">
        {[[0, 0], [14, -6], [14, 6], [28, -11], [28, 11]].map(([x, y], i) => (
          <path key={i} className="vs-bird-flap" d={`M${x} ${60 + y} q4 -4 8 0 q4 -4 8 0`} fill="none" stroke="#8A7650" strokeWidth="1.6" strokeLinecap="round" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </g>
      </Layer>

      {/* kite tugging on its string above the house */}
      <g className="vs-kite" style={{ transformOrigin: "640px 250px" }}>
        <path className="vs-kite-string" d="M688 104 C660 150 610 190 600 250" fill="none" stroke="#8A6A3A" strokeWidth="1.2" />
        <g transform="translate(688 84)">
          <path d="M0 -22 L18 0 L0 22 L-18 0 Z" fill="#E3672B" />
          <path d="M0 -22 L18 0 L0 0 Z" fill="#EBC64C" />
          <path d="M0 0 L-18 0 L0 22 Z" fill="#C23B5A" />
          <path d="M0 -22 V22 M-18 0 H18" stroke="#7A3F18" strokeWidth="1.2" />
          <path className="vs-kite-tail" d="M0 22 q-6 8 0 14 q6 6 0 14" fill="none" stroke="#E3672B" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      {/* far hills, with the Ganga winding between them and a boat on it */}
      <Layer depth={8}>
      <path d="M-80 222 L0 214 C180 156 330 176 480 200 C640 226 760 156 930 166 C1100 176 1250 214 1440 176 L1520 172 V360 H-80Z" fill="#CBC76E" />
      <path d="M370 226 C520 206 700 212 900 204 C1060 198 1200 206 1330 210 C1200 222 1060 214 900 222 C720 230 540 224 370 226 Z" fill={`url(#${uid}river)`} />
      {[[470, 218], [640, 214], [820, 212], [990, 208], [1150, 210]].map(([x, y], i) => (
        <path key={i} className="vs-shimmer" d={`M${x} ${y} h22`} stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      <g className="vs-boat">
        <g className="vs-boat-bob">
          <path d="M-18 0 Q0 7 18 0 L14 -4 H-14 Z" fill="#7A4A1E" />
          <path d="M0 -4 V-26" stroke="#6B3F1D" strokeWidth="1.6" />
          <path d="M1 -25 Q12 -16 1 -6 Z" fill="#FFF4D6" stroke="#D9B98A" strokeWidth="0.8" />
          <circle cx="-8" cy="-8" r="2.4" fill="#5A3A20" />
          <path d="M-8 -6 V-4" stroke="#5A3A20" strokeWidth="2" />
        </g>
      </g>
      </Layer>

      {/* middle hill, mustard fields and the whole village */}
      <Layer depth={13}>
      <path d="M-80 268 L0 262 C200 214 380 244 560 254 C760 266 900 224 1080 232 C1240 240 1340 262 1440 252 L1520 252 V360 H-80Z" fill="#AEB44E" />
      {mustard.map(([x, y], i) => (
        <g key={`m${i}`} className="vs-mustard" style={{ transformOrigin: `${x}px ${y + 14}px`, animationDelay: `${(i % 5) * 0.3}s` }}>
          <path d={`M${x} ${y + 14} V${y + 2}`} stroke="#7E9550" strokeWidth="1.6" />
          <circle cx={x} cy={y} r="3.4" fill="#F2C230" />
          <circle cx={x - 2.4} cy={y + 3} r="2.2" fill="#F7D65A" />
        </g>
      ))}

      {/* path from the house to the cow */}
      <path d="M560 360 C600 330 640 318 700 314 C780 308 850 312 930 318" fill="none" stroke="#E2C596" strokeWidth="22" strokeLinecap="round" opacity="0.9" />

      {/* big tree (sways) */}
      <g transform="translate(110 132)">
        <path d="M44 168 C46 120 40 80 48 40" stroke="#6B3F1D" strokeWidth="14" strokeLinecap="round" fill="none" />
        <g className="vs-sway">
          <circle cx="48" cy="34" r="46" fill="#6F8A2C" />
          <circle cx="8" cy="54" r="34" fill="#7E9550" />
          <circle cx="88" cy="56" r="36" fill="#5E7A28" />
          <circle cx="40" cy="70" r="28" fill="#8FAE3C" opacity="0.8" />
        </g>
      </g>

      {/* haystack */}
      <path d="M300 300 C306 250 368 250 374 300 Z" fill="#E3B54A" />
      <path d="M312 284 C330 276 350 276 364 284" stroke="#C9952E" strokeWidth="3" fill="none" />

      {/* house */}
      <g transform="translate(420 196)">
        <rect x="96" y="-28" width="16" height="34" fill="#9A5222" />
        {[0, 1, 2].map((i) => (
          <circle key={i} className="vs-smoke" cx="104" cy="-34" r={7 + i * 2} fill="#EEE6D6" style={{ animationDelay: `${i * 1.2}s` }} />
        ))}
        <rect x="10" y="36" width="150" height="70" fill="#EFD2A0" />
        <rect x="10" y="36" width="150" height="70" fill="none" stroke="#C99A5C" strokeWidth="2" />
        <path d="M-10 40 L85 -12 L180 40 Z" fill="#B5652B" />
        <path d="M-10 40 L85 -12 L180 40" fill="none" stroke="#8A4A1E" strokeWidth="5" strokeLinejoin="round" />
        {[20, 40, 60, 80, 100, 120, 140].map((x) => (
          <path key={x} d={`M${x} ${40 - (x < 85 ? (x + 10) * 0.55 : (180 - x) * 0.55)} L${x} 40`} stroke="#9A5222" strokeWidth="2" opacity="0.5" />
        ))}
        {/* door (open) */}
        <rect x="104" y="54" width="34" height="52" fill="#3A2412" />
        <path d="M104 54 L94 58 L94 106 L104 106 Z" fill="#7A4A1E" />
        {/* window with warm light */}
        <rect x="30" y="54" width="34" height="28" fill="#FFD77A" />
        <path d="M47 54 V82 M30 68 H64" stroke="#8A4A1E" strokeWidth="3" />
        {/* tulsi pot */}
        <rect x="168" y="90" width="18" height="16" fill="#C2662A" />
        <circle cx="177" cy="84" r="9" fill="#5E7A28" />
      </g>

      {/* woman at the door — raises her hand to take the milk */}
      <g transform="translate(576 248)">
        <ellipse cx="0" cy="56" rx="16" ry="3" fill="#000" opacity="0.12" />
        <path d="M-12 54 L-8 18 L8 18 L12 54 Z" fill="#C23B5A" />
        <path d="M-9 18 C-4 32 6 40 12 54 L4 54 C0 44 -6 34 -9 18 Z" fill="#F2A93B" />
        <rect x="-7" y="2" width="14" height="18" rx="5" fill="#C23B5A" />
        <circle cx="0" cy="-6" r="8" fill="#B5784A" />
        <path d="M-8 -7 C-8 -16 8 -16 8 -7 C8 -12 4 -14 0 -14 C-4 -14 -8 -12 -8 -7Z" fill="#2B1B12" />
        <path d="M-8 -8 C-10 -2 -10 6 -6 10" stroke="#F2A93B" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="-9" r="1.2" fill="#C23B5A" />
        <g className="vs-woman-arm" style={{ transformOrigin: "6px 6px" }}>
          <path d="M6 6 L20 20" stroke="#B5784A" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* the pail she's been handed (appears once he lets go) */}
        <g className="vs-pail-woman" transform="translate(-14 30)">
          <path d="M-7 2 L7 2 L5 16 L-5 16 Z" fill="#C9CED2" stroke="#8E979E" strokeWidth="1.5" />
          <ellipse cx="0" cy="2" rx="7" ry="2.2" fill={`url(#${uid}milk)`} stroke="#8E979E" strokeWidth="1" />
          <path d="M-6 2 C-6 -6 6 -6 6 2" fill="none" stroke="#8E979E" strokeWidth="1.4" />
        </g>
      </g>

      {/* man carrying the milk pail between cow and house */}
      <g className="vs-man-walk">
        <g className="vs-man-face" style={{ transformOrigin: "0px 0px" }}>
          <g transform="translate(0 246)">
            <ellipse cx="0" cy="58" rx="16" ry="3" fill="#000" opacity="0.12" />
            <g className="vs-leg" style={{ transformOrigin: "0px 32px" }}>
              <path d="M-2 32 L-6 56" stroke="#EDE6D6" strokeWidth="6" strokeLinecap="round" />
            </g>
            <g className="vs-leg vs-leg-b" style={{ transformOrigin: "0px 32px" }}>
              <path d="M2 32 L6 56" stroke="#E2D9C6" strokeWidth="6" strokeLinecap="round" />
            </g>
            <path d="M-10 4 L-12 36 L12 36 L10 4 Z" fill="#FBF8F0" stroke="#D8CFBC" strokeWidth="1.5" />
            <path d="M-10 4 L10 4" stroke="#D8CFBC" strokeWidth="2" />
            <circle cx="0" cy="-6" r="8" fill="#A86B3E" />
            <path d="M-9 -8 C-8 -18 8 -18 9 -8 Z" fill="#E7E0CF" />
            <path d="M-3 -1 C-1 0 1 0 3 -1" stroke="#2B1B12" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            {/* arm + milk pail (in front, toward the house) */}
            <path d="M-8 8 L-18 24" stroke="#A86B3E" strokeWidth="4" strokeLinecap="round" />
            <g transform="translate(-22 22)" className="vs-pail-man">
              <path d="M-8 4 L8 4 L6 22 L-6 22 Z" fill="#C9CED2" stroke="#8E979E" strokeWidth="1.5" />
              <ellipse cx="0" cy="4" rx="8" ry="2.6" fill={`url(#${uid}milk)`} stroke="#8E979E" strokeWidth="1" />
              <path d="M-7 4 C-7 -6 7 -6 7 4" fill="none" stroke="#8E979E" strokeWidth="1.6" />
            </g>
          </g>
        </g>
      </g>

      {/* cow being milked */}
      <g transform="translate(860 230)">
        <ellipse cx="62" cy="74" rx="70" ry="5" fill="#000" opacity="0.12" />
        {/* tail */}
        <g className="vs-tail" style={{ transformOrigin: "120px 18px" }}>
          <path d="M120 18 C136 34 134 54 130 64" stroke="#4A3B2A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M126 62 C132 60 136 66 130 72 C126 70 124 66 126 62Z" fill="#4A3B2A" />
        </g>
        {/* legs */}
        {[30, 46, 92, 108].map((x) => (
          <path key={x} d={`M${x} 44 V72`} stroke="#4A3B2A" strokeWidth="7" strokeLinecap="round" />
        ))}
        <path d="M18 20 C18 0 110 -4 122 16 C130 34 120 50 100 50 L36 50 C20 50 16 38 18 20Z" fill="#F6F1E6" stroke="#4A3B2A" strokeWidth="2.4" />
        <path d="M60 6 C74 4 86 12 84 24 C80 32 64 30 58 22 C54 16 54 8 60 6Z" fill="#B07A3B" opacity="0.75" />
        <path d="M100 12 C110 14 114 24 108 30 C102 26 98 20 100 12Z" fill="#B07A3B" opacity="0.75" />
        {/* udder */}
        <path d="M76 50 C76 60 96 60 96 50Z" fill="#F2B6A6" stroke="#4A3B2A" strokeWidth="1.6" />
        <path d="M80 57 V62 M86 58 V63 M92 57 V62" stroke="#E79A88" strokeWidth="2.4" strokeLinecap="round" />
        {/* milk drops falling into the pail */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} className="vs-drop" cx={81 + i * 5.5} cy="64" rx="1.8" ry="2.6" fill="#FFFFFF" stroke="#E7E1D2" strokeWidth="0.6" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
        {/* pail under the cow */}
        <path d="M74 72 L98 72 L95 88 L77 88 Z" fill="#C9CED2" stroke="#8E979E" strokeWidth="1.5" />
        <ellipse cx="86" cy="72" rx="12" ry="3" fill={`url(#${uid}milk)`} stroke="#8E979E" strokeWidth="1" />
        {/* head (chews / nods) */}
        <g className="vs-head" style={{ transformOrigin: "22px 20px" }}>
          <path d="M24 12 C10 6 -8 10 -10 24 C-12 36 0 42 12 40 C22 38 28 28 24 12Z" fill="#F6F1E6" stroke="#4A3B2A" strokeWidth="2.4" />
          <ellipse cx="-4" cy="34" rx="9" ry="6" fill="#F2B6A6" stroke="#4A3B2A" strokeWidth="1.6" />
          <circle cx="-7" cy="34" r="1.2" fill="#4A3B2A" />
          <circle cx="-1" cy="34" r="1.2" fill="#4A3B2A" />
          <circle cx="6" cy="20" r="2" fill="#26261A" />
          <path d="M14 8 L8 -4 M22 10 L26 -2" stroke="#8A6A3A" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 14 C28 10 34 14 30 20 C26 22 20 20 18 14Z" fill="#E9E2D2" stroke="#4A3B2A" strokeWidth="1.6" />
          <path d="M18 40 C18 48 14 52 10 52" stroke="#C9952E" strokeWidth="2" fill="none" />
          <circle cx="10" cy="54" r="3" fill="#E3B54A" />
        </g>
      </g>

      {/* butterflies around the tulsi pot and the tree */}
      {[[610, 268, 0], [250, 214, -3]].map(([x, y, d], i) => (
        <g key={`bf${i}`} className="vs-butterfly" style={{ animationDelay: `${d}s` }}>
          <g transform={`translate(${x} ${y})`}>
            <g className="vs-wing" style={{ animationDelay: `${d}s` }}>
              <path d="M0 0 C-8 -10 -12 -2 -6 3 C-10 6 -6 10 0 4 Z" fill={i ? "#E3672B" : "#C23B5A"} />
              <path d="M0 0 C8 -10 12 -2 6 3 C10 6 6 10 0 4 Z" fill={i ? "#F2A93B" : "#E3672B"} />
            </g>
            <path d="M0 -3 V6" stroke="#3A2412" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>
      ))}

      {/* leaves drifting down from the big tree */}
      {[0, 1, 2].map((i) => (
        <path key={`lf${i}`} className="vs-leaf" d={`M${150 + i * 28} 190 q5 -5 10 0 q-5 5 -10 0 Z`} fill={i === 1 ? "#A9B84A" : "#7E9550"} style={{ animationDelay: `${i * 2.6}s` }} />
      ))}
      </Layer>

      {/* near hill, the delivery cyclist and the grass */}
      <Layer depth={20}>
      <path d="M-80 316 L0 312 C240 290 520 300 760 310 C1000 320 1220 296 1440 300 L1520 304 V360 H-80Z" fill="#919C3C" />

      {/* delivery cyclist with a box of pedas, ringing the bell */}
      <g className="vs-cycle">
        <g transform="translate(0 330)">
          <ellipse cx="0" cy="1" rx="30" ry="3" fill="#000" opacity="0.12" />
          {[-19, 19].map((cx) => (
            <g key={cx} className="vs-cwheel" style={{ transformOrigin: `${cx}px -11px` }}>
              <circle cx={cx} cy="-11" r="11" fill="none" stroke="#26261A" strokeWidth="2.6" />
              <path d={`M${cx - 10} -11 H${cx + 10} M${cx} -21 V-1 M${cx - 7} -18 L${cx + 7} -4 M${cx + 7} -18 L${cx - 7} -4`} stroke="#8E979E" strokeWidth="1" />
            </g>
          ))}
          <path d="M-19 -11 L-4 -11 L8 -28 L-10 -28 Z M8 -28 L19 -11 M-4 -11 L-10 -28" fill="none" stroke="#C23B5A" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M8 -28 L10 -36 H16" stroke="#26261A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          {/* peda box on the carrier */}
          <rect x="-34" y="-46" width="24" height="16" rx="2" fill="#9E1F2E" />
          <rect x="-34" y="-46" width="24" height="4" fill="#EBC64C" />
          <text x="-22" y="-34" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="6" fill="#FFF4D6">PEDA</text>
          {/* rider */}
          <path d="M-8 -30 L0 -52 L8 -50 L6 -30 Z" fill="#F2A93B" />
          <path d="M2 -48 L14 -36" stroke="#A86B3E" strokeWidth="3.4" strokeLinecap="round" />
          <circle cx="3" cy="-58" r="6.5" fill="#A86B3E" />
          <path d="M-4 -60 C-3 -68 10 -68 10 -60 Z" fill="#FFFFFF" />
          <g className="vs-crank" style={{ transformOrigin: "-4px -11px" }}>
            <path d="M-4 -11 L2 -4 M-4 -11 L-10 -18" stroke="#3A2412" strokeWidth="3.2" strokeLinecap="round" />
          </g>
          <path d="M-2 -32 L-4 -11" stroke="#3A2412" strokeWidth="3.4" strokeLinecap="round" />
          <text className="vs-tring" x="18" y="-46" fontFamily="var(--font-display)" fontWeight="900" fontSize="9" fill="#8A6410">tring!</text>
        </g>
      </g>

      {/* fireflies blinking over the fields */}
      {[
        [240, 236], [380, 222], [660, 286], [800, 248], [1060, 214], [1180, 262], [1330, 230], [520, 300],
      ].map(([x, y], i) => (
        <circle key={`ff${i}`} className="vs-firefly" cx={x} cy={y} r="2.6" fill="#FFE27A" style={{ animationDelay: `${(i * 0.7) % 3.2}s` }} />
      ))}

      {/* grass tufts (sway) */}
      {[40, 250, 400, 690, 760, 1010, 1150, 1300, 1390].map((x, i) => (
        <g key={x} className="vs-grass" style={{ transformOrigin: `${x}px 340px`, animationDelay: `${(i % 4) * 0.5}s` }}>
          <path d={`M${x} 340 q-4 -14 -10 -18 M${x} 340 q0 -16 2 -22 M${x} 340 q5 -12 12 -16`} stroke="#6F8A2C" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
      </Layer>
    </svg>
  );
}
