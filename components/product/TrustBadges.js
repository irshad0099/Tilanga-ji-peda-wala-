import { trustBadges, fssaiLicence } from "@/lib/content";

const icons = {
  since: (
    <text x="32" y="38" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="14" fill="currentColor">
      1975
    </text>
  ),
  hand: <path d="M24 40V27a2.5 2.5 0 0 1 5 0v6m0-9a2.5 2.5 0 0 1 5 0v9m0-7a2.5 2.5 0 0 1 5 0v7m0-4a2.5 2.5 0 0 1 5 0v6c0 6-4 10-10 10h-2c-4 0-6-2-8-5l-4-6a2.4 2.4 0 0 1 4-2.6l2 2.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  khoya: <path d="M32 18c5 6 9 10.5 9 16a9 9 0 1 1-18 0c0-5.5 4-10 9-16z" fill="none" stroke="currentColor" strokeWidth="2.2" />,
  fssai: <path d="M32 18l11 4v8c0 7-5 12-11 14-6-2-11-7-11-14v-8zM27 31l4 4 7-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />,
};

function Laurel() {
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  return (
    <g fill="#8FAE3C">
      {leaves.map((i) => {
        const a = 235 - i * 20;
        const rad = (a * Math.PI) / 180;
        const x = 32 + 26 * Math.cos(rad);
        const y = 34 + 26 * Math.sin(rad) * -1;
        return <ellipse key={`l${i}`} cx={x} cy={y} rx="5.5" ry="2.6" transform={`rotate(${-(a + 90)} ${x} ${y})`} />;
      })}
      {leaves.map((i) => {
        const a = -55 + i * 20;
        const rad = (a * Math.PI) / 180;
        const x = 32 + 26 * Math.cos(rad);
        const y = 34 + 26 * Math.sin(rad) * -1;
        return <ellipse key={`r${i}`} cx={x} cy={y} rx="5.5" ry="2.6" transform={`rotate(${-(a + 90)} ${x} ${y})`} />;
      })}
    </g>
  );
}

// Laurel-framed trust marks under the price. Unconfirmed ones (e.g. the
// FSSAI badge before the licence number is added) render as placeholders.
export default function TrustBadges() {
  return (
    <ul className="grid grid-cols-4 gap-2 sm:gap-4">
      {trustBadges.map((b, i) => {
        const pending = !b.verified || (b.id === "fssai" && !fssaiLicence);
        return (
          <li key={b.id} className="float flex flex-col items-center text-center" style={{ "--float-delay": `${i * 0.4}s` }}>
            <svg viewBox="0 0 64 64" className={`h-16 w-16 sm:h-20 sm:w-20 ${pending ? "opacity-40" : ""}`} aria-hidden="true">
              <circle cx="32" cy="32" r="21" fill="#FBF6E4" stroke="#B8892E" strokeWidth="1.5" strokeDasharray={pending ? "3 3" : undefined} />
              <Laurel />
              <g className="text-leaf" color="#57703B">{icons[b.id]}</g>
            </svg>
            <span className={`-mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${pending ? "border border-dashed border-leaf/40 text-ink/50" : "bg-leaf text-cream"}`}>
              {b.label}
            </span>
            {pending && <span className="mt-1 text-[10px] text-ink/45">add licence no.</span>}
          </li>
        );
      })}
    </ul>
  );
}
