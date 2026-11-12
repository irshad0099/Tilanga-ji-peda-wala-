"use client";

import { useEffect, useRef } from "react";

// Mouse parallax for the footer's village scene: tracks the pointer over the
// enclosing <footer> and sets --sx / --sy (−1…1) on it. Each .pl-layer in
// VillageScene shifts by its own --depth, so far hills move less than the
// near ones. Mice only; touch and reduced-motion get the still scene.
export default function SceneParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current?.closest("footer");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    function onMove(e) {
      if (e.pointerType === "touch") return;
      const r = root.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = ((e.clientY - r.top) / r.height) * 2 - 1;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--sx", x.toFixed(3));
        root.style.setProperty("--sy", y.toFixed(3));
      });
    }
    function onLeave() {
      cancelAnimationFrame(frame);
      root.style.setProperty("--sx", "0");
      root.style.setProperty("--sy", "0");
    }
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <span ref={ref} hidden />;
}
