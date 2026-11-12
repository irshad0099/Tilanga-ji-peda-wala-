"use client";

import { useState } from "react";
import Image from "next/image";
import Tilt3D from "@/components/Tilt3D";
import Placeholder from "@/components/Placeholder";

const SLOTS = 5;

// Product photos for the dark-green half of the product hero: a vertical
// thumbnail rail with up/down arrows beside a white-framed main photo
// (thumbnails run underneath on phones). Missing photos keep their slot as
// a placeholder — add them in lib/content.js → productPhotos.
export default function Gallery({ images, name, savePct }) {
  const slots = [...images, ...Array(Math.max(0, SLOTS - images.length)).fill(null)];
  const [active, setActive] = useState(0);
  const step = (dir) => setActive((i) => (i + dir + images.length) % images.length);

  const thumb = (src, i) =>
    src ? (
      <button
        key={`${src}-${i}`}
        onClick={() => setActive(i)}
        aria-label={`Show photo ${i + 1}`}
        aria-current={i === active}
        className={`shrink-0 overflow-hidden border-2 transition ${i === active ? "border-cream opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
      >
        <Image src={src} alt="" width={160} height={160} className="h-16 w-16 object-cover lg:h-[74px] lg:w-[74px]" />
      </button>
    ) : (
      <Placeholder key={`ph-${i}`} label="Photo" className="h-16 w-16 shrink-0 !gap-0 !rounded-none !border-cream/30 !bg-none !bg-leaf/40 !p-1 !text-[10px] !text-cream/60 lg:h-[74px] lg:w-[74px]" />
    );

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
      {/* Thumbnail rail */}
      <div className="flex items-center gap-2 lg:flex-col">
        <button onClick={() => step(-1)} aria-label="Previous photo" className="hidden text-cream/80 transition hover:text-cream lg:block">
          <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M2 8l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
        <div className="no-scrollbar flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">{slots.map(thumb)}</div>
        <button onClick={() => step(1)} aria-label="Next photo" className="hidden text-cream/80 transition hover:text-cream lg:block">
          <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M2 2l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Main photo */}
      {/* Never taller than the screen below the header, so the whole photo
          shows on laptop screens too. */}
      <Tilt3D max={5} className="w-full lg:max-w-[min(640px,calc(100vh-180px))]">
        <div className="relative overflow-hidden border-[3px] border-cream bg-cream shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]">
          <div className="hero-breathe">
            <Image
              key={images[active]}
              src={images[active]}
              alt={name}
              width={1000}
              height={1000}
              priority
              className="aspect-square w-full animate-[fadeIn_.5s_ease] object-cover"
            />
          </div>
          {/* Ghee-gloss sweep and a slowly turning "since 1975" seal. */}
          <span aria-hidden="true" className="hero-sheen" />
          <svg viewBox="0 0 100 100" aria-hidden="true" className="hero-seal absolute bottom-4 right-4 h-20 w-20 sm:h-24 sm:w-24 lg:bottom-5 lg:right-5">
            <defs>
              <path id="seal-ring" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" />
            </defs>
            <circle cx="50" cy="50" r="48" fill="#2F4A1D" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#EBC64C" strokeWidth="1" strokeDasharray="2 3" />
            <g className="hero-seal-text">
              <text fontFamily="var(--font-display)" fontWeight="800" fontSize="9.5" fill="#FFFCEF">
                <textPath href="#seal-ring" textLength="224" lengthAdjust="spacing">FRESH · HANDMADE · PURE KHOYA ·</textPath>
              </text>
            </g>
            <circle cx="50" cy="50" r="22" fill="#EBC64C" />
            <text x="50" y="47" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="8" fill="#2F4A1D">SINCE</text>
            <text x="50" y="59" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="13" fill="#2F4A1D">1975</text>
          </svg>
          {savePct > 0 && (
            <span className="absolute left-4 top-4 rounded-xl bg-[#8DB33A] px-3.5 py-2 text-sm font-extrabold tracking-wide text-cream shadow-lg [transform:translateZ(40px)]">
              SAVE {savePct}%
            </span>
          )}
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
              {images.map((src, i) => (
                <span key={src} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-leaf" : "w-1.5 bg-leaf/40"}`} />
              ))}
            </div>
          )}
        </div>
      </Tilt3D>
    </div>
  );
}
