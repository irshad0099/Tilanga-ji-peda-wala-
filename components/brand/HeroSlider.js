"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Banner carousel in a rounded green frame. Text is real HTML over the
// photo (readable on phones, visible to Google). Auto-advances, pauses on
// hover, swipeable, with dot navigation.
const slides = [
  {
    image: "/images/photos/peda-platter.jpg",
    position: "70% 50%",
    pre: "Har",
    accent: "Peda",
    post: "Kehta Hai 50 Saal Ki Kahani",
    text: "Pure khoya, slow-cooked in the same kadhai since 1975 — now delivered fresh across India.",
    cta: { href: "/product/classic-khoya-peda", label: "Order now" },
  },
  {
    image: "/images/photos/gur-peda.jpg",
    position: "50% 50%",
    pre: "Sakaddi Ka",
    accent: "Mashahur",
    post: "Swad, Aapke Ghar Tak",
    text: "The peda travellers on the Ara–Patna highway plan their stop around.",
    cta: { href: "/menu", label: "See the menu" },
  },
  {
    image: "/images/photos/kulhad-chai.jpg",
    position: "50% 60%",
    pre: "Ek",
    accent: "Chai Ki Dukaan",
    post: "Se Shuru Hua Safar",
    text: "Litti-chokha, mithai and kulhad chai are waiting at the shop — come hungry.",
    cta: { href: "/#story", label: "Our story" },
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef(null);
  const go = (n) => setI((n + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="mx-auto max-w-7xl px-3 pt-4 sm:px-6 sm:pt-6">
      <div
        className="relative overflow-hidden rounded-[28px] border-[5px] border-olive/80 bg-leaf-dark shadow-[0_30px_60px_-30px_rgba(47,74,29,0.7)] sm:rounded-[40px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
        aria-roledescription="carousel"
      >
        <div className="relative aspect-[4/5] sm:aspect-[16/7]">
          {slides.map((s, n) => (
            <div
              key={s.image}
              className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
              aria-hidden={n !== i}
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority={n === 0}
                sizes="(max-width: 640px) 100vw, 1280px"
                style={{ objectPosition: s.position }}
                className={`object-cover ${n === i ? "animate-[kenburns_9s_ease-out_forwards]" : ""}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-leaf-dark via-leaf-dark/55 to-transparent sm:bg-gradient-to-r sm:from-leaf-dark/95 sm:via-leaf-dark/60 sm:to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 pb-14 sm:inset-y-0 sm:left-0 sm:right-auto sm:flex sm:max-w-[58%] sm:flex-col sm:justify-center sm:p-14">
                <h2
                  key={`${s.image}-${i}`}
                  className={`font-display text-[34px] font-black leading-[1.08] text-cream drop-shadow-lg sm:text-6xl ${n === i ? "animate-[riseIn_.9s_cubic-bezier(.2,.7,.2,1)_both]" : ""}`}
                >
                  {s.pre} <span className="text-haldi">{s.accent}</span> {s.post}
                </h2>
                <p className={`mt-4 max-w-md text-[15px] font-semibold text-cream/90 sm:text-lg ${n === i ? "animate-[riseIn_.9s_.15s_cubic-bezier(.2,.7,.2,1)_both]" : ""}`}>
                  {s.text}
                </p>
                <Link
                  href={s.cta.href}
                  tabIndex={n === i ? 0 : -1}
                  className={`btn-3d btn-3d-haldi mt-6 inline-block w-fit rounded-xl bg-haldi px-7 py-3.5 text-[15px] font-black uppercase tracking-wider text-leaf-dark ${n === i ? "animate-[riseIn_.9s_.3s_cubic-bezier(.2,.7,.2,1)_both]" : ""}`}
                >
                  {s.cta.label} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, n) => (
            <button
              key={s.image}
              onClick={() => go(n)}
              aria-label={`Slide ${n + 1}`}
              aria-current={n === i}
              className={`h-2.5 rounded-full border border-cream transition-all duration-300 ${n === i ? "w-8 bg-cream" : "w-2.5 bg-transparent"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
