import Reveal from "@/components/Reveal";
import { boxContents } from "@/lib/content";

const icons = {
  khoya: (
    <>
      <path d="M8 22h32l-3 14a4 4 0 0 1-4 3H15a4 4 0 0 1-4-3z" />
      <path d="M14 22c0-4 4-7 10-7s10 3 10 7" />
      <path d="M20 12c0-2 2-2 2-4M27 12c0-2 2-2 2-4" />
    </>
  ),
  ghee: (
    <>
      <path d="M17 10h14v5l3 4v17a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V19l3-4z" />
      <path d="M14 25h20" />
      <path d="M24 29c1.6 2 2.4 3.3 2.4 4.3a2.4 2.4 0 0 1-4.8 0c0-1 .8-2.3 2.4-4.3z" />
    </>
  ),
  box: (
    <>
      <path d="M8 18l16-8 16 8v16l-16 8-16-8z" />
      <path d="M8 18l16 8 16-8M24 26v16" />
      <path d="M16 14l16 8" />
    </>
  ),
  clock: (
    <>
      <circle cx="24" cy="25" r="14" />
      <path d="M24 17v8l5 4" />
      <path d="M19 7h10" />
    </>
  ),
};

// The 500g box opening on a loop: the lid lifts and tips back, the pedas
// inside bob up and a few sparkles twinkle. Styles: globals.css, "Box".
function BoxArt() {
  const pedas = [
    [62, 96], [92, 96], [122, 96], [152, 96],
    [77, 84], [107, 84], [137, 84],
  ];
  return (
    <svg viewBox="0 0 214 170" className="h-auto w-full max-w-[300px]" aria-hidden="true">
      <ellipse cx="107" cy="156" rx="86" ry="9" fill="#2F4A1D" opacity="0.18" />
      {/* Box back wall */}
      <path d="M34 82h146l-6 10H40z" fill="#7a4a24" />
      {/* Pedas */}
      <g className="bx-pedas">
        {pedas.map(([x, y], i) => (
          <g key={i} className="bx-peda" style={{ "--d": `${i * 0.09}s` }}>
            <ellipse cx={x} cy={y} rx="15" ry="9" fill="#C98A3E" />
            <ellipse cx={x} cy={y - 2} rx="12" ry="6" fill="#E3A859" />
            <path d={`M${x - 5} ${y - 3}q5 3 10 0`} fill="none" stroke="#a8692a" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx={x} cy={y - 4} r="1.6" fill="#7E9550" />
          </g>
        ))}
      </g>
      {/* Box front */}
      <path d="M30 92h154l-8 56a6 6 0 0 1-6 5H44a6 6 0 0 1-6-5z" fill="#2F4A1D" />
      <path d="M36 104h142" stroke="#EBC64C" strokeWidth="2" />
      <path d="M38 140h138" stroke="#EBC64C" strokeWidth="1.2" opacity="0.6" />
      <text x="107" y="126" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="15" fill="#FFFCEF">
        Tilanga Ji Peda
      </text>
      <text x="107" y="136" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize="7.5" letterSpacing="1.5" fill="#EBC64C">
        SINCE 1975 · 500 G
      </text>
      {/* Lid */}
      <g className="bx-lid">
        <path d="M26 70h162a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4z" fill="#57703B" />
        <path d="M30 76h154" stroke="#EBC64C" strokeWidth="1.6" />
        <path d="M98 70c0-7 18-7 18 0" fill="none" stroke="#EBC64C" strokeWidth="2.4" />
      </g>
      {/* Sparkles */}
      {[[40, 46, 0], [176, 40, 0.6], [108, 30, 1.1], [150, 58, 1.6]].map(([x, y, d], i) => (
        <path
          key={i}
          className="bx-spark"
          style={{ "--d": `${d}s` }}
          d={`M${x} ${y - 6}l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z`}
          fill="#EBC64C"
        />
      ))}
    </svg>
  );
}

// "Box ke andar kya hai" — what a box holds and how long it stays fresh.
// Content per product in lib/content.js → boxContents.
export default function BoxContents({ product }) {
  const box = boxContents[product.slug];
  if (!box) return null;

  return (
    <section id="box" data-anim className="relative scroll-mt-24 overflow-hidden bg-butter py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mustard">Har box mein</p>
          <h2 className="mt-1 font-display text-4xl font-black text-leaf-dark sm:text-5xl">Box ke andar kya hai?</h2>
          <div className="mt-8 flex w-full justify-center lg:justify-start">
            <BoxArt />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <span className="rounded-full bg-leaf-dark px-4 py-2 text-sm font-extrabold text-cream">{product.weight || "500g box"}</span>
            {box.pieces ? (
              <span className="rounded-full bg-leaf-dark px-4 py-2 text-sm font-extrabold text-cream">Lagbhag {box.pieces} pede</span>
            ) : (
              <span className="rounded-full border-2 border-dashed border-leaf/40 px-4 py-1.5 text-sm font-bold text-ink/50">Pedon ki ginti — add</span>
            )}
          </div>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2">
          {box.facts.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 110} className="bx-fact group flex items-start gap-4 rounded-3xl border-2 border-leaf/15 bg-cream p-5 transition duration-300 hover:-translate-y-1 hover:border-leaf/40 hover:shadow-[0_20px_36px_-22px_rgba(47,74,29,0.6)]">
              <span className="bx-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-haldi/30 text-leaf-dark transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-haldi">
                <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {icons[f.icon]}
                </svg>
              </span>
              <span>
                <span className="block font-display text-xl font-extrabold text-leaf-dark">{f.title}</span>
                <span className="mt-1 block text-[14px] font-semibold leading-relaxed text-ink/70">{f.text}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
