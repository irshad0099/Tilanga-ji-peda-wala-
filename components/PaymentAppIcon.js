// Small coloured app-badges for the UPI payment buttons — brand-accurate
// colours with a simple monogram, so "Pay with PhonePe / Google Pay / Paytm"
// reads as a real payment picker rather than plain text links. Not a
// reproduction of each company's registered logo artwork.

export default function PaymentAppIcon({ app, size = 28 }) {
  if (app.id === "upi") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="rounded-lg">
        <rect width="32" height="32" rx="7" fill="url(#upi-grad)" />
        <defs>
          <linearGradient id="upi-grad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stopColor="#F97316" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        <text x="16" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#fff">
          UPI
        </text>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="rounded-lg">
      <rect
        width="32"
        height="32"
        rx="7"
        fill={app.bg}
        stroke={app.border ? "#E2E2E2" : "none"}
        strokeWidth={app.border ? 1 : 0}
      />
      <text
        x="16"
        y={app.mark.length > 1 ? "20.5" : "21"}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize={app.mark.length > 1 ? "13" : "16"}
        fontWeight="700"
        fill={app.fg}
      >
        {app.mark}
      </text>
    </svg>
  );
}
