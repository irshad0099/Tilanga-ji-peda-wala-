// Original animated illustrations for the journey timeline stamps — one per
// step that has no photo of its own. Each fills a square 120×120 viewBox so it
// sits edge-to-edge inside the .scallop-frame mask. Motion lives in
// globals.css ("Journey timeline"); prefers-reduced-motion stops it.

// 1 · Morning milk: a lota pours a stream of milk into a brass can as the
// sun comes up behind it.
function MilkArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" fill="#FDF3C4" />
      <g className="ja-sun">
        <circle cx="28" cy="34" r="12" fill="#EBC64C" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d="M28 16 V11" stroke="#EBC64C" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 28 34)`} />
        ))}
      </g>
      <path d="M0 96 Q30 86 60 94 T120 92 V120 H0 Z" fill="#AEB44E" />
      <path d="M0 104 Q40 96 80 104 T120 102 V120 H0 Z" fill="#7E9550" />

      {/* milk stream, outlined so it reads against the butter ground */}
      <path d="M74 34 Q72 46 66 58" stroke="#E2C57E" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M74 34 Q72 46 66 58" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path className="ja-stream" d="M74 34 Q72 46 66 58" stroke="#F3E9D2" strokeWidth="2" strokeLinecap="round" fill="none" />
      {[0, 1, 2].map((i) => (
        <circle key={i} className="ja-splash" cx={60 + i * 6} cy="62" r="2" fill="#FFFFFF" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}

      {/* lota */}
      <g className="ja-lota" style={{ transformOrigin: "86px 30px" }}>
        <ellipse cx="88" cy="24" rx="14" ry="13" fill="#C98A2E" />
        <path d="M78 16 Q74 12 70 14 L74 22 Z" fill="#B8892E" />
        <ellipse cx="84" cy="14" rx="7" ry="2.5" fill="#8A6410" />
        <path d="M80 20 Q88 16 96 22" stroke="#FFE7A3" strokeWidth="2" fill="none" opacity="0.7" />
      </g>

      {/* brass milk can */}
      <path d="M44 64 H82 L86 102 Q63 108 40 102 Z" fill="#D9A441" />
      <ellipse cx="63" cy="64" rx="19" ry="5" fill="#FFFFFF" />
      <ellipse cx="63" cy="64" rx="19" ry="5" fill="none" stroke="#8A6410" strokeWidth="2.5" />
      <path d="M42 80 H84" stroke="#B8892E" strokeWidth="3" />
      <path d="M50 70 Q52 88 50 98" stroke="#FFE7A3" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

// 2 · Khoya in the kadhai: milk bubbles over a flickering chulha while a
// wooden karchi stirs and steam curls up.
function KadhaiArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" fill="#FDF3C4" />
      {[0, 1, 2].map((i) => (
        <path key={i} className="ja-steam" d={`M${44 + i * 14} 46 q-6 -8 0 -16 t0 -16`} stroke="#E8DCC4" strokeWidth="4" strokeLinecap="round" fill="none" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}

      {/* chulha + flames */}
      <path d="M26 92 H94 L90 112 H30 Z" fill="#9A5222" />
      <path d="M48 112 Q60 98 72 112 Z" fill="#3A1F0C" />
      {[0, 1, 2].map((i) => (
        <path key={i} className="ja-flame" d={`M${50 + i * 10} 98 q-5 -8 0 -16 q5 8 0 16 Z`} fill={i === 1 ? "#F2A93B" : "#E3672B"} style={{ animationDelay: `${i * 0.18}s` }} />
      ))}

      {/* karchi (stirs) */}
      <g className="ja-stir" style={{ transformOrigin: "60px 72px" }}>
        <path d="M60 72 L84 26" stroke="#8A4A1E" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="60" cy="72" rx="7" ry="4" fill="#8A4A1E" />
      </g>

      {/* kadhai with bubbling khoya */}
      <path d="M20 66 Q60 106 100 66 Z" fill="#3E3B36" />
      <ellipse cx="60" cy="66" rx="40" ry="8" fill="#F3DFA8" />
      {[[44, 66], [58, 64], [72, 67], [52, 69], [66, 69]].map(([x, y], i) => (
        <circle key={i} className="ja-bubble" cx={x} cy={y} r="2.6" fill="#FFF6D8" stroke="#E2C57E" strokeWidth="1" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      <path d="M14 66 Q8 62 12 58" stroke="#3E3B36" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M106 66 Q112 62 108 58" stroke="#3E3B36" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// 3 · Hand-made pedas: a hand rolls a ball of khoya on the wooden patta,
// squashing it as it goes, while finished pedas pop onto the brass thali.
function RollingArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" fill="#FDF3C4" />
      {[[18, 24], [100, 30]].map(([x, y], i) => (
        <path key={i} className="ja-twinkle" d={`M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y} L${x + 2} ${y + 2} L${x} ${y + 6} L${x - 2} ${y + 2} L${x - 6} ${y} L${x - 2} ${y - 2} Z`} fill="#EBC64C" style={{ animationDelay: `${i * 0.9}s` }} />
      ))}

      {/* wooden patta */}
      <path d="M8 86 H112 L106 106 H14 Z" fill="#B87A3E" />
      <path d="M8 86 H112 L110 92 H10 Z" fill="#D39A5A" />
      <path d="M24 98 h20 M60 100 h28" stroke="#9A5E2A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* brass thali with finished pedas popping on */}
      <ellipse cx="88" cy="84" rx="21" ry="6" fill="#B8892E" />
      <ellipse cx="88" cy="83" rx="18" ry="4.5" fill="#E2B355" />
      {[[80, 80], [89, 82], [97, 79]].map(([x, y], i) => (
        <g key={i} className="ja-pop" style={{ transformOrigin: `${x}px ${y + 3}px`, animationDelay: `${i * 0.6}s` }}>
          <ellipse cx={x} cy={y} rx="6" ry="3.6" fill="#B8742E" />
          <ellipse cx={x} cy={y - 1} rx="4" ry="2" fill="#D39A52" />
          <circle cx={x} cy={y - 1.4} r="0.9" fill="#57703B" />
        </g>
      ))}

      {/* khoya ball, squashed and rolled under the palm */}
      <g className="ja-ball" style={{ transformOrigin: "44px 86px" }}>
        <ellipse cx="44" cy="79" rx="12" ry="7" fill="#C98A3E" />
        <ellipse cx="41" cy="76" rx="6" ry="2.6" fill="#E3A859" />
      </g>

      {/* hand + kurta sleeve */}
      <g className="ja-hand">
        <path d="M26 0 H52 L54 36 L28 40 Z" fill="#E3672B" />
        <path d="M27 34 L54 30" stroke="#EBC64C" strokeWidth="3.5" />
        {/* palm, cupped over the ball, with four fingers and a thumb */}
        <path
          d="M28 40 Q22 50 26 60 Q30 68 44 70 Q58 70 62 62 Q66 54 60 44 Q54 37 42 37 Q32 37 28 40 Z"
          fill="#D9A06B"
          stroke="#8A5A34"
          strokeWidth="1.6"
        />
        <path d="M33 66 q-2 -6 1 -12 M40 69 q-2 -7 1 -14 M48 69 q-1 -7 2 -14 M55 66 q0 -6 3 -11" stroke="#8A5A34" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M60 46 Q70 46 70 54 Q70 60 64 60 Q61 56 60 52 Z" fill="#D9A06B" stroke="#8A5A34" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M34 44 q8 -3 18 -1" stroke="#F0C595" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  );
}

// 4 · Same-day packing: a peda drops into the box, the lid swings shut and a
// tick pops up.
function PackingArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" fill="#FDF3C4" />
      {[[22, 26], [96, 22], [100, 70]].map(([x, y], i) => (
        <path key={i} className="ja-twinkle" d={`M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y} L${x + 2} ${y + 2} L${x} ${y + 6} L${x - 2} ${y + 2} L${x - 6} ${y} L${x - 2} ${y - 2} Z`} fill="#EBC64C" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}

      {/* falling peda */}
      <g className="ja-drop">
        <ellipse cx="60" cy="30" rx="11" ry="7" fill="#B8742E" />
        <ellipse cx="60" cy="28" rx="7" ry="3.5" fill="#D39A52" />
        <circle cx="60" cy="27" r="1.6" fill="#57703B" />
      </g>

      {/* box */}
      <path d="M30 62 H90 V104 H30 Z" fill="#C2662A" />
      <path d="M30 62 H90 V70 H30 Z" fill="#9A5222" />
      <rect x="55" y="62" width="10" height="42" fill="#EBC64C" />
      <path d="M44 86 h32" stroke="#FFE7A3" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />

      {/* lid swings shut */}
      <g className="ja-lid" style={{ transformOrigin: "30px 62px" }}>
        <path d="M28 56 H92 V64 H28 Z" fill="#D9793A" />
        <rect x="55" y="56" width="10" height="8" fill="#EBC64C" />
      </g>

      {/* tick */}
      <g className="ja-tick" style={{ transformOrigin: "92px 96px" }}>
        <circle cx="92" cy="96" r="11" fill="#57703B" />
        <path d="M86 96 l4 4 l8 -8" stroke="#FFFCEF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// 5 · To your door: a delivery scooter rides along with the road and clouds
// scrolling past.
function DeliveryArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" fill="#FDF3C4" />
      <g className="ja-clouds">
        {[0, 120].map((o) => (
          <g key={o} transform={`translate(${o} 0)`}>
            <ellipse cx="26" cy="28" rx="14" ry="6" fill="#FFFFFF" />
            <ellipse cx="34" cy="24" rx="9" ry="6" fill="#FFFFFF" />
            <ellipse cx="86" cy="40" rx="12" ry="5" fill="#FFFFFF" />
          </g>
        ))}
      </g>

      {/* road */}
      <rect y="90" width="120" height="30" fill="#5B5547" />
      <g className="ja-road">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={i * 40} y="103" width="20" height="4" rx="2" fill="#EBC64C" />
        ))}
      </g>

      {/* speed lines */}
      {[0, 1, 2].map((i) => (
        <path key={i} className="ja-speed" d={`M${10 + i * 4} ${58 + i * 10} h14`} stroke="#B8892E" strokeWidth="2.5" strokeLinecap="round" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}

      {/* scooter */}
      <g className="ja-ride">
        <rect x="34" y="50" width="22" height="20" rx="3" fill="#C2662A" />
        <rect x="43" y="50" width="4" height="20" fill="#EBC64C" />
        <path d="M36 72 H82 Q86 72 84 80 H40 Q34 80 36 72 Z" fill="#57703B" />
        <path d="M78 72 L86 48" stroke="#2F4A1D" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 48 H92" stroke="#2F4A1D" strokeWidth="4" strokeLinecap="round" />
        {/* rider */}
        <circle cx="66" cy="38" r="7" fill="#8A4A1E" />
        <path d="M58 32 Q66 24 74 32 Z" fill="#E3672B" />
        <path d="M60 46 Q66 44 72 46 L76 72 H60 Z" fill="#B8892E" />
        <path d="M70 52 L84 50" stroke="#8A4A1E" strokeWidth="4" strokeLinecap="round" />
        {[44, 82].map((cx) => (
          <g key={cx} className="ja-wheel" style={{ transformOrigin: `${cx}px 84px` }}>
            <circle cx={cx} cy="84" r="8" fill="#26261A" />
            <circle cx={cx} cy="84" r="3.5" fill="#D9D2BE" />
            <path d={`M${cx - 6} 84 H${cx + 6} M${cx} 78 V90`} stroke="#D9D2BE" strokeWidth="1.5" />
          </g>
        ))}
      </g>
    </svg>
  );
}

const art = { milk: MilkArt, kadhai: KadhaiArt, rolling: RollingArt, packing: PackingArt, delivery: DeliveryArt };

export default function JourneyArt({ name }) {
  const Art = art[name];
  return Art ? <Art /> : null;
}
