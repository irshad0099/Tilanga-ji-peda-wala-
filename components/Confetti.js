"use client";

import { useEffect, useState } from "react";

const COLORS = ["#EBC64C", "#57703B", "#E3672B", "#FFFCEF", "#8DB33A", "#C23B5A"];

// A one-off shower of haldi, leaf and marigold confetti over the whole
// screen (styles: globals.css, "Confetti"). Pieces are made on the client so
// the random layout never mismatches the server render; it cleans itself up
// after the fall. Skipped for prefers-reduced-motion.
export default function Confetti({ count = 90 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        round: Math.random() < 0.3,
        delay: Math.random() * 0.9,
        duration: 2.6 + Math.random() * 2.2,
        drift: (Math.random() - 0.5) * 220,
        spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720),
      }))
    );
    const done = setTimeout(() => setPieces([]), 6500);
    return () => clearTimeout(done);
  }, [count]);

  if (!pieces.length) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="cf-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            background: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--cf-drift": `${p.drift}px`,
            "--cf-spin": `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
