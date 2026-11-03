"use client";

import CategoryIcon from "@/components/CategoryIcon";

// Rounded pills with an icon bubble — the "Shop by category" switcher.
// Scrolls sideways on phones.
export default function CategoryPills({ options, value, onChange }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={`flex shrink-0 items-center gap-3 rounded-full border-2 py-1.5 pl-1.5 pr-6 text-[17px] font-extrabold transition-all duration-200 sm:text-lg ${
              active
                ? "border-leaf bg-olive text-cream shadow-[0_10px_20px_-10px_rgba(47,74,29,0.7)]"
                : "border-olive/50 bg-butter/60 text-olive hover:-translate-y-0.5 hover:border-olive"
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full border ${active ? "border-cream/60 bg-cream text-leaf" : "border-olive/30 bg-cream text-olive"}`}>
              <CategoryIcon name={o.icon} size={26} />
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
