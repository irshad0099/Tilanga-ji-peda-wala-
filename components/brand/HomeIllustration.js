// Original illustration for the footer, beside the logo: a village home at
// dusk. Smoke curls from the chimney, the window light flickers, the toran
// over the door and the lantern sway, the diya on the step glows and the
// tulsi plant moves in the breeze. Motion lives in globals.css ("Home
// illustration"); prefers-reduced-motion stops it.
export default function HomeIllustration({ className = "" }) {
  const leaves = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="A village home with a lit window and a diya at the door">
      <defs>
        <radialGradient id="hm-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD77A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFD77A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hm-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6DDB0" />
          <stop offset="1" stopColor="#E9C78E" />
        </linearGradient>
      </defs>

      {/* ground + soft shadow */}
      <ellipse cx="120" cy="188" rx="112" ry="8" fill="#2F4A1D" opacity="0.12" />
      <path d="M8 188 H232" stroke="#AEB44E" strokeWidth="4" strokeLinecap="round" />

      {/* chimney smoke */}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="hm-smoke" cx="170" cy="30" r={6 + i * 2} fill="#EEE6D6" style={{ animationDelay: `${i * 1.3}s` }} />
      ))}
      <rect x="162" y="34" width="16" height="34" fill="#9A5222" />
      <rect x="159" y="31" width="22" height="6" fill="#7A3F18" />

      {/* walls */}
      <rect x="40" y="92" width="160" height="94" fill="url(#hm-wall)" />
      <path d="M40 150 H200" stroke="#C99A5C" strokeWidth="1.5" opacity="0.5" />
      <rect x="40" y="176" width="160" height="10" fill="#C2662A" opacity="0.8" />

      {/* tiled roof */}
      <path d="M22 96 L120 38 L218 96 Z" fill="#B5652B" />
      {[0, 1, 2, 3].map((r) => (
        <path key={r} d={`M${34 + r * 13} ${89 - r * 8} L${206 - r * 13} ${89 - r * 8}`} stroke="#8A4A1E" strokeWidth="2" opacity="0.45" />
      ))}
      <path d="M22 96 L120 38 L218 96" fill="none" stroke="#7A3F18" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />

      {/* window with flickering lamplight */}
      <circle className="hm-flicker" cx="76" cy="124" r="30" fill="url(#hm-glow)" />
      <rect x="58" y="108" width="36" height="32" rx="2" fill="#FFCF66" className="hm-flicker" />
      <path d="M76 108 V140 M58 124 H94" stroke="#8A4A1E" strokeWidth="3" />
      <rect x="58" y="108" width="36" height="32" rx="2" fill="none" stroke="#8A4A1E" strokeWidth="3" />
      <rect x="54" y="140" width="44" height="5" fill="#9A5222" />

      {/* open door with warm light spilling out */}
      <path d="M128 186 L128 118 Q147 102 166 118 L166 186 Z" fill="#FFD27A" className="hm-flicker" />
      <path d="M128 186 L128 118 Q147 102 166 118 L166 186" fill="none" stroke="#7A3F18" strokeWidth="4" />
      <path d="M128 118 L118 124 L118 186 L128 186 Z" fill="#8A4A1E" />
      <path d="M134 186 L160 186 L150 160 L144 160 Z" fill="#E7A93B" opacity="0.6" />

      {/* toran over the door (sways) */}
      <g className="hm-toran" style={{ transformOrigin: "147px 112px" }}>
        <path d="M122 112 Q147 122 172 112" fill="none" stroke="#C2662A" strokeWidth="2" />
        {leaves.map((i) => {
          const x = 125 + i * 7.3;
          const y = 113 + Math.sin((i / 6) * Math.PI) * 5;
          return <path key={i} d={`M${x} ${y} q-2.5 6 0 10 q2.5 -4 0 -10z`} fill={i % 2 ? "#6F8A2C" : "#E3A324"} />;
        })}
      </g>

      {/* hanging lantern (swings) */}
      <g className="hm-lantern" style={{ transformOrigin: "190px 98px" }}>
        <path d="M190 98 V110" stroke="#5A3A1A" strokeWidth="1.5" />
        <circle cx="190" cy="120" r="12" fill="url(#hm-glow)" className="hm-flicker" />
        <rect x="184" y="110" width="12" height="16" rx="3" fill="#FFD27A" stroke="#7A3F18" strokeWidth="2" />
        <path d="M183 110 H197 M183 126 H197" stroke="#7A3F18" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* step + diya */}
      <rect x="120" y="184" width="54" height="5" rx="1" fill="#B07A3B" />
      <circle className="hm-diya-glow" cx="182" cy="178" r="12" fill="url(#hm-glow)" />
      <path d="M174 182 H190 C188 188 176 188 174 182 Z" fill="#C2662A" />
      <path className="hm-diya-flame" d="M182 181 C178 176 180 171 182 168 C184 171 186 176 182 181 Z" fill="#FFB43A" style={{ transformOrigin: "182px 181px" }} />

      {/* tulsi pot (sways) */}
      <rect x="18" y="168" width="22" height="18" rx="2" fill="#C2662A" />
      <rect x="16" y="166" width="26" height="5" rx="1" fill="#A85422" />
      <g className="hm-tulsi" style={{ transformOrigin: "29px 166px" }}>
        <path d="M29 166 V146" stroke="#4D6B22" strokeWidth="2" />
        {[[-7, 150], [7, 152], [-6, 158], [6, 160], [0, 144]].map(([dx, y], i) => (
          <ellipse key={i} cx={29 + dx} cy={y} rx="5" ry="3" fill={i % 2 ? "#6F8A2C" : "#8FAE3C"} transform={`rotate(${dx * 4} ${29 + dx} ${y})`} />
        ))}
      </g>
    </svg>
  );
}
