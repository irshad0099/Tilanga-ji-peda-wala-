import Image from "next/image";

// PhonePe / Google Pay / Paytm render their real official logos (see
// lib/upi.js for sourcing notes). The generic "Other UPI app" option has no
// single owner, so it gets a plain non-trademarked badge instead — NPCI's
// own UPI/BHIM mark requires written permission to reproduce.
export default function PaymentAppIcon({ app, height = 28 }) {
  if (app.icon) {
    return (
      <Image
        src={app.icon}
        alt={app.label}
        width={Math.round(height * app.ratio)}
        height={height}
        style={{ height, width: "auto" }}
        className="object-contain"
      />
    );
  }

  return (
    <svg width={height} height={height} viewBox="0 0 32 32" aria-hidden="true" className="rounded-lg">
      <defs>
        <linearGradient id="upi-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="#F97316" />
          <stop offset="1" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#upi-grad)" />
      <text x="16" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#fff">
        UPI
      </text>
    </svg>
  );
}
