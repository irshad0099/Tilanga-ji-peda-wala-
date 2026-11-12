"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

// The shop's peda photos, in /public/images/peda/. They're 4:5 portraits,
// mostly with text near the top, so the tiles keep that shape instead of
// cropping it off.
const galleryImages = [
  { src: "/images/peda/team-making-pedas.jpg", caption: "Our team, hand-rolling pedas for you" },
  { src: "/images/peda/handcrafted-fresh.jpg", caption: "Handcrafted fresh, every single day" },
  { src: "/images/peda/khoya-desi-ghee.jpg", caption: "Khoya and pure desi ghee — nothing else" },
  { src: "/images/peda/sakaddi-ka-mashahur.jpg", caption: "Sakaddi ka mashahur taste, since 1975" },
  { src: "/images/peda/peda-highlights.jpg", caption: "Rich khoya, melt-in-mouth texture" },
  { src: "/images/peda/peda-box-diya.jpg", caption: "The Classic Khoya Peda 500g box" },
  { src: "/images/peda/festive-gifting-tray.jpg", caption: "Perfect for festivals and gifting" },
  { src: "/images/peda/khoya-goodness.jpg", caption: "Traditional taste, premium quality" },
  { src: "/images/peda/hand-placing-peda.jpg", caption: "Every peda pressed by hand" },
];

const MAX_TILT = 10; // degrees

// One photo card. With a mouse it tilts toward the pointer in 3D: the photo
// drifts the other way for depth, a glare follows the cursor, and the
// caption and number float above the surface (styles: globals.css, "Gallery").
// Touch devices get the flat card; a tap opens the lightbox either way.
function GalleryCard({ img, index, onOpen }) {
  const ref = useRef(null);
  const frame = useRef(0);

  function onMove(e) {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(-y * MAX_TILT * 2).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * MAX_TILT * 2).toFixed(2)}deg`);
      el.style.setProperty("--px", `${(x * -14).toFixed(1)}px`);
      el.style.setProperty("--py", `${(y * -14).toFixed(1)}px`);
      el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
  }

  function onLeave() {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    for (const v of ["--rx", "--ry", "--px", "--py"]) el.style.removeProperty(v);
  }

  return (
    <Reveal delay={(index % 3) * 110} className="gx-stage">
      <button
        ref={ref}
        type="button"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${img.caption}`}
        className="gx-card group block w-full cursor-zoom-in rounded-2xl text-left"
      >
        <span className="gx-frame block overflow-hidden rounded-2xl border border-gold/40 bg-cream-dark/40">
          <span className="gx-photo block">
            <Image
              src={img.src}
              alt={img.caption}
              width={800}
              height={1000}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </span>
          <span aria-hidden="true" className="gx-shade" />
          <span aria-hidden="true" className="gx-glare" />
        </span>

        <span aria-hidden="true" className="gx-num font-display">{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden="true" className="gx-zoom">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5" />
          </svg>
        </span>
        <span className="gx-caption">
          <span className="block text-[15px] font-extrabold leading-snug text-cream">{img.caption}</span>
          <span className="gx-rule" aria-hidden="true" />
        </span>
      </button>
    </Reveal>
  );
}

// Full-screen viewer: arrows, keyboard (← → Esc) and swipe move between
// photos; each one scales in.
function Lightbox({ index, onClose, onStep }) {
  const img = galleryImages[index];
  const touchX = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onStep]);

  const arrow = (dir) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onStep(dir);
      }}
      aria-label={dir < 0 ? "Previous photo" : "Next photo"}
      className={`gx-arrow absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-leaf-dark shadow-xl transition hover:scale-110 hover:bg-cream ${dir < 0 ? "left-3 sm:left-6" : "right-3 sm:right-6"}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={img.caption}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="gx-lightbox fixed inset-0 z-100 flex flex-col items-center justify-center bg-ink/90 px-4 py-14 sm:px-20"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream/95 text-2xl leading-none text-ink shadow-lg transition hover:rotate-90 hover:bg-cream"
      >
        ×
      </button>
      {arrow(-1)}
      {arrow(1)}

      <figure key={index} className="gx-lb-photo flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.caption} className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]" />
        <figcaption className="mt-4 text-center text-[15px] font-bold text-cream">
          {img.caption}
          <span className="ml-3 text-cream/50">
            {index + 1} / {galleryImages.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

export default function GalleryGrid() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir) => setOpen((i) => (i + dir + galleryImages.length) % galleryImages.length), []);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {galleryImages.map((img, i) => (
          <GalleryCard key={img.src} img={img} index={i} onOpen={setOpen} />
        ))}
      </div>
      {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
    </>
  );
}
