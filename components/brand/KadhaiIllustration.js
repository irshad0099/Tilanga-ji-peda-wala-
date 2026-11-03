// Original illustration: a brass kadhai of peda on a clay chulha, with
// flickering flames and rising steam (CSS keyframes in globals.css).
export default function KadhaiIllustration({ className = "" }) {
  const pedas = [
    [150, 118], [182, 112], [214, 116], [246, 120], [166, 104], [198, 98], [230, 104],
  ];
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      {/* steam */}
      {[170, 205, 240].map((x, i) => (
        <path
          key={x}
          d={`M${x} 80 C${x - 14} 62 ${x + 14} 48 ${x} 28`}
          fill="none"
          stroke="#C9B98F"
          strokeWidth="5"
          strokeLinecap="round"
          className="steam"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
      {/* chulha */}
      <path d="M90 200 H310 L296 270 H104 Z" fill="#B5652B" />
      <path d="M90 200 H310 L306 214 H94 Z" fill="#9A5222" />
      <path d="M170 270 C170 236 230 236 230 270 Z" fill="#3A2412" />
      {/* flames */}
      <g className="flame" style={{ transformOrigin: "200px 262px" }}>
        <path d="M200 266 C178 250 186 228 200 214 C214 228 222 250 200 266 Z" fill="#F29A2E" />
        <path d="M200 266 C190 256 192 242 200 232 C208 242 210 256 200 266 Z" fill="#FFD25A" />
      </g>
      {/* kadhai */}
      <path d="M86 130 H314 C310 176 262 204 200 204 C138 204 90 176 86 130 Z" fill="#C9962E" />
      <path d="M86 130 H314 C310 150 262 160 200 160 C138 160 90 150 86 130 Z" fill="#E4B547" />
      <path d="M100 150 C140 168 260 168 300 150" fill="none" stroke="#F3D37A" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="74" cy="134" rx="16" ry="8" fill="none" stroke="#A97A22" strokeWidth="7" />
      <ellipse cx="326" cy="134" rx="16" ry="8" fill="none" stroke="#A97A22" strokeWidth="7" />
      {/* peda */}
      {pedas.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 14} rx="18" ry="10" fill="#B67A3C" />
          <ellipse cx={x} cy={y + 10} rx="18" ry="9" fill="#D19A57" />
          <circle cx={x} cy={y + 9} r="2.2" fill="#8E5A26" />
        </g>
      ))}
    </svg>
  );
}
