"use client";

import { useEffect, useRef, useState } from "react";

// Left column of "Pede ka paramparik safar": eyebrow, a heading whose words
// rise in one by one, a brush underline that draws itself under the accent
// word, the story with a drop cap, and three counters that tick up. All of
// it starts the first time the block scrolls into view; with reduced motion
// everything simply appears in its final state.
const words = [
  { t: "Pede" },
  { t: "Ka" },
  { t: "Paramparik", accent: true },
  { t: "Safar" },
];

const stats = [
  { to: 1975, label: "Se chal raha hai", plain: true },
  { to: 50, suffix: "+", label: "Saal, wahi swad" },
  { to: 3100, suffix: "+", label: "Google reviews" },
];

function useInView(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

function Counter({ to, suffix = "", plain, run }) {
  // Starts at the final value (the card is hidden until it scrolls in), so
  // with reduced motion there's nothing to do; otherwise it re-counts.
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 1975 counts up from 1900 so it reads as a year, not from zero.
    const from = plain ? 1900 : 0;
    const start = performance.now();
    const dur = 1600;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, plain]);
  const text = plain ? String(n) : n.toLocaleString("en-IN");
  return (
    <span className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

export default function StoryIntro({ story }) {
  const ref = useRef(null);
  const run = useInView(ref);
  const first = story.charAt(0);
  const rest = story.slice(1);

  return (
    <div ref={ref} className={run ? "story-run" : ""}>
      <p className="story-fade flex items-center gap-3 text-[13px] font-extrabold uppercase tracking-[0.24em] text-mustard" style={{ "--d": "0ms" }}>
        <span className="h-px w-8 bg-mustard" aria-hidden="true" />
        Since 1975 · Sakaddi
      </p>

      {/* The font class sits on an inner span: the global h2 rule in
          globals.css would otherwise override the layered utility. */}
      <h2 className="mt-4 text-[44px] leading-[1.02] text-wood sm:text-6xl">
        <span className="sr-only">Pede Ka Paramparik Safar</span>
        <span aria-hidden="true" className="font-story">
          {words.map((w, i) => (
            <span key={w.t}>
              <span className="inline-block overflow-hidden pb-2 align-bottom">
                <span className="story-word inline-block" style={{ "--d": `${120 + i * 110}ms` }}>
                  {w.accent ? (
                    <span className="relative inline-block text-[#B5652B]">
                      {w.t}
                      <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full" aria-hidden="true">
                        <path className="story-brush" d="M4 13 C70 5 150 3 296 9" fill="none" stroke="#EBC64C" strokeWidth="7" strokeLinecap="round" />
                      </svg>
                    </span>
                  ) : (
                    w.t
                  )}
                </span>
              </span>
              {/* Space between the clip boxes, not inside them (trailing
                  space inside an inline-block collapses away). */}
              {i < words.length - 1 && " "}
            </span>
          ))}
        </span>
      </h2>

      <p className="story-fade mt-7 max-w-md border-l-4 border-haldi pl-5 text-[17px] font-semibold leading-[1.8] text-ink/80" style={{ "--d": "650ms" }}>
        <span className="float-left mr-2 mt-1 font-story text-[64px] leading-[0.8] text-[#B5652B]">{first}</span>
        {rest}
      </p>

      <dl className="mt-9 grid max-w-md grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="story-fade rounded-2xl border-2 border-wood/15 bg-butter/50 px-3 py-4 text-center transition-transform duration-300 hover:-translate-y-1"
            style={{ "--d": `${850 + i * 120}ms` }}
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-story text-[28px] leading-none text-wood sm:text-[32px]">
              <Counter to={s.to} suffix={s.suffix} plain={s.plain} run={run} />
            </dd>
            <dd className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-ink/60">{s.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
