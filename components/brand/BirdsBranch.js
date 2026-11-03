// Original illustration: a flowering branch with a few perched birds, in
// the site's palette. Birds bob gently (.float), leaves sway (.sway).
function Bird({ x, y, flip, body, wing, delay }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g className="float" style={{ "--float-delay": `${delay}s` }}>
        <path d="M-14 2 C-14 -9 -2 -12 6 -8 C10 -14 18 -12 18 -6 L24 -4 L18 -1 C16 8 0 12 -10 8 L-22 12 Z" fill={body} />
        <path d="M-6 -2 C0 -6 8 -4 10 2 C4 6 -2 5 -6 -2Z" fill={wing} />
        <circle cx="12" cy="-7" r="1.6" fill="#26261A" />
        <path d="M2 10 L0 16 M7 9 L7 16" stroke="#6B3F1D" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

export default function BirdsBranch({ className = "" }) {
  const leaves = [
    [70, 150, -30], [110, 132, 25], [150, 128, -20], [190, 116, 30], [235, 108, -25], [280, 96, 20], [320, 90, -30],
    [120, 170, 40], [210, 150, 35], [300, 128, 40], [355, 78, -10], [255, 74, 15], [215, 60, -20],
  ];
  const blossoms = [[95, 140], [175, 122], [262, 102], [338, 84], [228, 66]];
  return (
    <svg viewBox="0 0 420 260" className={className} aria-hidden="true">
      <g className="sway" style={{ transformOrigin: "0% 70%" }}>
        <path d="M-10 175 C80 150 170 130 260 104 C320 86 370 70 420 40" fill="none" stroke="#7A4E28" strokeWidth="9" strokeLinecap="round" />
        <path d="M200 124 C215 100 222 82 230 58" fill="none" stroke="#7A4E28" strokeWidth="5" strokeLinecap="round" />
        <path d="M110 150 C100 170 104 186 118 196" fill="none" stroke="#7A4E28" strokeWidth="4" strokeLinecap="round" />
        {leaves.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path d="M0 0 C7 -11 20 -11 25 0 C20 9 7 9 0 0Z" fill={i % 3 ? "#8FAE3C" : "#6F8A2C"} />
            <path d="M2 0 L22 0" stroke="#4D6B22" strokeWidth="0.9" />
          </g>
        ))}
        {blossoms.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-5" rx="3.2" ry="5" fill="#F2A65A" transform={`rotate(${a})`} />
            ))}
            <circle r="2.6" fill="#EBC64C" />
          </g>
        ))}
      </g>
      <Bird x={150} y={112} body="#E9B949" wing="#C98A2B" delay={0} />
      <Bird x={268} y={86} body="#D9824A" wing="#A85A2C" flip delay={0.8} />
      <Bird x={345} y={62} body="#6E9BC9" wing="#3F6E9E" delay={1.6} />
    </svg>
  );
}
