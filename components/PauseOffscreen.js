"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Pauses the looping CSS animations inside any [data-anim] section while it's
// off screen (globals.css → [data-paused]), so the footer scene and the
// journey illustrations don't keep the phone busy while you read elsewhere.
// Re-scans on every route change, since sections come and go with the page.
export default function PauseOffscreen() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll("[data-anim]");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-paused", !e.isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
