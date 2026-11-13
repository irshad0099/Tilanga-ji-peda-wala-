"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

const SINCE = 1975;

// Counts from 0 up to `to` the first time it scrolls into view.
function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / 1400);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const icons = {
  diya: (
    <>
      <path d="M24 6c3 4 4.5 7 4.5 9a4.5 4.5 0 0 1-9 0c0-2 1.5-5 4.5-9z" />
      <path d="M6 24h36c-1.5 8-9 13-18 13S7.5 32 6 24z" />
    </>
  ),
  star: <path d="M24 6l5.4 11 12.1 1.8-8.8 8.5 2.1 12L24 33.6 13.2 39.3l2.1-12-8.8-8.5L18.6 17z" />,
  box: (
    <>
      <path d="M7 16l17-8 17 8v18l-17 8-17-8z" />
      <path d="M7 16l17 8 17-8M24 24v18" />
    </>
  ),
  pin: (
    <>
      <path d="M24 42s14-12.5 14-23a14 14 0 0 0-28 0c0 10.5 14 23 14 23z" />
      <circle cx="24" cy="19" r="5" />
    </>
  ),
};

// "Hamara Vaada" — the shop's promises, on a deep-green band below the
// reviews. Every line here is something the site already states.
export default function PromiseBand() {
  const years = new Date().getFullYear() - SINCE;
  const promises = [
    { icon: "diya", value: <CountUp to={years} suffix="+" />, label: "saal, wahi swaad", text: `Same recipe since ${SINCE}` },
    { icon: "star", value: <CountUp to={3100} suffix="+" />, label: "Google reviews", text: "Loved by travellers on the Ara–Patna highway" },
    { icon: "box", value: "Usi din", label: "packing", text: "Boxed the same day it's made" },
    { icon: "pin", value: "Poora Bihar", label: "delivery", text: "Bhojpur same day, rest of Bihar in 1-2 days" },
  ];

  return (
    <section data-anim className="pv-band relative overflow-hidden bg-leaf-dark py-16 text-cream sm:py-20">
      <span aria-hidden="true" className="pv-glow pv-glow-a" />
      <span aria-hidden="true" className="pv-glow pv-glow-b" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-haldi">Har dabbe ke saath</p>
          <h2 className="mt-2 font-display text-4xl font-black sm:text-5xl">Hamara Vaada</h2>
          <span aria-hidden="true" className="pv-rule mx-auto mt-4 block" />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => (
            <Reveal as="li" key={p.label} delay={i * 120}>
              <div className="pv-card group relative h-full rounded-3xl border border-cream/15 bg-cream/[0.06] p-6 text-center">
              <span className="pv-icon mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-haldi text-leaf-dark" style={{ "--float-delay": `${i * 0.5}s` }}>
                <svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {icons[p.icon]}
                </svg>
              </span>
              <p className="mt-5 font-display text-4xl font-black leading-none text-haldi">{p.value}</p>
              <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.14em] text-cream">{p.label}</p>
              <p className="mt-3 text-[14px] font-semibold leading-relaxed text-cream/70">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={300} className="mt-12 text-center">
          <p className="font-story text-2xl text-cream/90 sm:text-3xl">&ldquo;Swaad wahi, jo {SINCE} mein tha.&rdquo;</p>
        </Reveal>
      </div>
    </section>
  );
}
