"use client";

import { useEffect, useRef } from "react";

// The filled part of the journey timeline's spine. It grows from the first
// medallion down as the list scrolls past the middle of the screen, with a
// glowing bead riding its tip. Sits over the dotted track in JourneyTimeline.
export default function JourneyProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const list = el?.parentElement;
    if (!list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = list.getBoundingClientRect();
      const mid = window.innerHeight * 0.55;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      el.style.setProperty("--jt-progress", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <span ref={ref} aria-hidden="true" className="jt-progress absolute bottom-6 left-[26px] top-6 w-[5px] sm:left-[32px]">
      <span className="jt-progress-fill" />
      <span className="jt-progress-bead" />
    </span>
  );
}
