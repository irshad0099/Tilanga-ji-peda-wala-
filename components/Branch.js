// Decorative leafy branch that sways gently — an original drawing in the
// site's greens, used to frame sections.
export default function Branch({ className = "", flip = false }) {
  // [x along the stem, which side] — leaves sit on the stem line y ≈ 40 − x/10.
  const leaves = [[30, -1], [52, 1], [76, -1], [100, 1], [124, -1], [148, 1], [172, -1]].map(([x, side]) => [
    x,
    40 - x * 0.1,
    side < 0 ? -40 : 35,
  ]);
  return (
    <svg
      viewBox="0 0 200 60"
      className={`pointer-events-none ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <g className="sway">
        <path d="M0 40 C50 34 110 30 196 20" fill="none" stroke="#6b4a24" strokeWidth="5" strokeLinecap="round" />
        {leaves.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path d="M0 0 C6 -10 18 -10 22 0 C18 8 6 8 0 0Z" fill={i % 2 ? "#6F8A2C" : "#8FAE3C"} />
            <path d="M1 0 L20 0" stroke="#3D5A1C" strokeWidth="0.8" />
          </g>
        ))}
      </g>
    </svg>
  );
}
