// A dashed "add this later" slot for content the shop hasn't supplied yet.
// Every one of these is driven by lib/content.js — fill the value there and
// the placeholder disappears.
export default function Placeholder({ label, hint, className = "", icon = "photo" }) {
  return (
    <div className={`placeholder rounded-xl ${className}`}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {icon === "video" ? (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
          </>
        ) : icon === "text" ? (
          <path d="M5 6h14M5 10h14M5 14h9M5 18h6" />
        ) : (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="M4 17l5-4 4 3 3-2 4 3" />
          </>
        )}
      </svg>
      <span>{label}</span>
      {hint && <span className="text-[11px] font-medium opacity-80">{hint}</span>}
    </div>
  );
}
