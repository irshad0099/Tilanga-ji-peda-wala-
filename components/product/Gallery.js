"use client";

import { useState } from "react";
import Image from "next/image";
import Tilt3D from "@/components/Tilt3D";
import Placeholder from "@/components/Placeholder";

// Main photo with 3D tilt + thumbnails. Missing extra photos show as
// placeholder thumbnails (fill them in lib/content.js → productGallery).
export default function Gallery({ images, name, savePct }) {
  const slots = [...images, ...Array(Math.max(0, 4 - images.length)).fill(null)].slice(0, Math.max(4, images.length));
  const [active, setActive] = useState(0);

  return (
    <div className="rounded-[28px] bg-leaf p-3 shadow-[0_24px_60px_-20px_rgba(40,61,16,0.6)] sm:p-4">
      <Tilt3D className="rounded-[20px]">
        <div className="relative overflow-hidden rounded-[20px] border-4 border-cream/90 bg-cream">
          <Image
            key={images[active]}
            src={images[active]}
            alt={name}
            width={900}
            height={900}
            priority
            className="aspect-square w-full animate-[fadeIn_.5s_ease] object-cover"
          />
          {savePct > 0 && (
            <span className="absolute left-4 top-4 rounded-lg bg-olive px-3 py-1.5 text-sm font-extrabold tracking-wide text-cream shadow-lg [transform:translateZ(40px)]">
              SAVE {savePct}%
            </span>
          )}
        </div>
      </Tilt3D>

      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
        {slots.map((src, i) =>
          src ? (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`shrink-0 overflow-hidden rounded-xl border-[3px] transition ${
                i === active ? "border-haldi" : "border-cream/40 opacity-75 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" width={160} height={160} className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
            </button>
          ) : (
            <Placeholder key={`ph${i}`} label="Photo" className="h-16 w-16 shrink-0 !gap-0 !p-1 !text-[10px] sm:h-20 sm:w-20" />
          )
        )}
      </div>
    </div>
  );
}
