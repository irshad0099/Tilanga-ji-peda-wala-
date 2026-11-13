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
        <Image src={src} alt="" width={128} height={160} className="h-[70px] w-14 object-cover lg:h-20 lg:w-16" />
      </button>
    ) : (
      <Placeholder key={`ph-${i}`} label="Photo" className="h-[70px] w-14 shrink-0 !gap-0 !rounded-none !border-cream/30 !bg-none !bg-leaf/40 !p-1 !text-[10px] !text-cream/60 lg:h-20 lg:w-16" />
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
      <Tilt3D max={5} className="w-full lg:max-w-[min(720px,calc((100vh-210px)*0.8))]">
        <div className="relative overflow-hidden border-[3px] border-cream bg-cream shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]">
          {/* Every photo is stacked and loaded up front, so picking a
              thumbnail crossfades straight away instead of waiting. */}
          <div className="hero-breathe relative aspect-[4/5]">
            {images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={i === active ? name : ""}
                aria-hidden={i !== active || undefined}
                width={1000}
                height={1250}
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="(min-width: 1024px) 720px, 100vw"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
          {/* Ghee-gloss sweep. */}
          <span aria-hidden="true" className="hero-sheen" />
          {savePct > 0 && (
            <span className="absolute bottom-4 left-4 rounded-xl bg-[#8DB33A] px-3.5 py-2 text-sm font-extrabold tracking-wide text-cream shadow-lg [transform:translateZ(40px)]">
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
