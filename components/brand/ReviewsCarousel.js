"use client";

import { useRef } from "react";
import { reviews } from "@/lib/content";

// Review cards in a sideways-scrolling row with arrow buttons. Stars only
// show for reviews that carry a real `rating` (see lib/content.js).
export default function ReviewsCarousel({ googleUrl }) {
  const track = useRef(null);
  const scroll = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="flex items-center gap-2 text-lg font-extrabold text-ink">
          <span className="text-2xl text-haldi drop-shadow-[0_1px_0_#b8901f]">★</span>
          3,100+ reviews on Google
        </p>
        {googleUrl && (
          <a href={googleUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-leaf underline decoration-haldi decoration-2 underline-offset-4">
            Read them all →
          </a>
        )}
      </div>

      <div className="relative mt-8">
        <button onClick={() => scroll(-1)} aria-label="Previous reviews" className="absolute -left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-2xl text-leaf shadow-lg sm:flex">
          ‹
        </button>
        <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-4">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex w-[82%] shrink-0 snap-center flex-col justify-between rounded-3xl bg-cream-dark/60 p-7 text-center shadow-[0_16px_30px_-22px_rgba(47,74,29,0.6)] transition hover:-translate-y-1 sm:w-[calc(33.333%-14px)]"
            >
              <span aria-hidden="true" className="font-display text-6xl font-black leading-none text-olive/40">“</span>
              <blockquote className="-mt-3 text-[16px] font-semibold leading-relaxed text-ink">{r.text}</blockquote>
              <figcaption className="mt-5">
                {r.rating ? (
                  <span className="block text-xl tracking-wider text-haldi drop-shadow-[0_1px_0_#b8901f]" aria-label={`${r.rating} out of 5`}>
                    {"★".repeat(r.rating)}
                    <span className="text-ink/20">{"★".repeat(5 - r.rating)}</span>
                  </span>
                ) : null}
                <span className="mt-1 block font-extrabold text-ink">{r.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <button onClick={() => scroll(1)} aria-label="More reviews" className="absolute -right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-2xl text-leaf shadow-lg sm:flex">
          ›
        </button>
      </div>
    </div>
  );
}
