"use client";

import { useState } from "react";
import Placeholder from "@/components/Placeholder";

// Pill tabs over a white card — Description / Making / Ingredients / Serve /
// Storage. `null` content (not supplied yet in lib/content.js) shows a
// placeholder box instead.
export default function ProductTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div>
      <div role="tablist" className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-center">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={`rounded-2xl px-5 py-3 text-[15px] font-bold transition-all duration-200 ${
              t.id === active
                ? "btn-3d bg-leaf text-cream"
                : "bg-cream text-olive shadow-[0_3px_0_rgba(111,138,44,0.35)] hover:-translate-y-0.5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={active} role="tabpanel" className="mt-6 animate-[fadeIn_.35s_ease] rounded-3xl bg-cream p-6 shadow-[0_18px_40px_-20px_rgba(40,61,16,0.45)] sm:p-9">
        {current.content ? (
          <div className="mx-auto max-w-2xl space-y-4 text-[16px] leading-relaxed text-ink/85">
            {String(current.content)
              .split(/\n\n+/)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        ) : (
          <Placeholder icon="text" label={`${current.label} — text coming soon`} hint="Fill in lib/content.js → productDetails" className="min-h-40" />
        )}
      </div>
    </div>
  );
}
