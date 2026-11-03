// Line icons for the category pills — original drawings, one per menu
// category (plus "ships" for the order-online filter and "all").
export default function CategoryIcon({ name, size = 30 }) {
  const p = { width: size, height: size, viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "ships":
      return (
        <svg {...p}>
          <path d="M3 9h15v12H3zM18 13h6l4 4v4h-10" />
          <circle cx="8" cy="23" r="2.4" />
          <circle cx="23" cy="23" r="2.4" />
        </svg>
      );
    case "Peda":
      return (
        <svg {...p}>
          <ellipse cx="16" cy="22" rx="11" ry="4" />
          <path d="M5 22v-3c0-2 5-4 11-4s11 2 11 4v3" />
          <ellipse cx="16" cy="12" rx="6.5" ry="3" />
          <path d="M9.5 12v-2c0-1.5 3-3 6.5-3s6.5 1.5 6.5 3v2" />
          <circle cx="16" cy="9" r="0.8" fill="currentColor" />
        </svg>
      );
    case "Gift Boxes":
      return (
        <svg {...p}>
          <rect x="5" y="12" width="22" height="15" rx="1.5" />
          <path d="M3 8h26v4H3zM16 8v19M16 8c-2-4-7-5-7-2s4 2 7 2c3 0 7 1 7-2s-5-2-7 2" />
        </svg>
      );
    case "Sweets":
      return (
        <svg {...p}>
          <path d="M4 22l6-10h12l6 10z" />
          <path d="M4 22v3h24v-3M10 12l6 10M22 12l-6 10" />
          <circle cx="11" cy="8" r="1.2" fill="currentColor" />
          <circle cx="21" cy="8" r="1.2" fill="currentColor" />
        </svg>
      );
    case "Dhaba Kitchen":
      return (
        <svg {...p}>
          <path d="M4 15h24c0 6-5 10-12 10S4 21 4 15z" />
          <circle cx="11" cy="12" r="3" />
          <circle cx="18" cy="11" r="3" />
          <path d="M23 9c1-2 0-3 1-5M8 7c1-1 0-2 1-3" />
        </svg>
      );
    case "Beverages":
      return (
        <svg {...p}>
          <path d="M7 11h15l-2 15H9z" />
          <path d="M22 14h2.5a3 3 0 0 1 0 6H21" />
          <path d="M12 7c0-2 2-2 2-4M17 7c0-2 2-2 2-4" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="5" y="5" width="9" height="9" rx="2" />
          <rect x="18" y="5" width="9" height="9" rx="2" />
          <rect x="5" y="18" width="9" height="9" rx="2" />
          <rect x="18" y="18" width="9" height="9" rx="2" />
        </svg>
      );
  }
}
