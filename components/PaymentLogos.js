import Image from "next/image";

// Official PhonePe / Google Pay / Paytm logos, shown as "you can pay with
// these" hints on the online-payment option. NPCI's own UPI/BHIM mark needs
// written permission to reproduce, so plain text stands in for it.
const apps = [
  { label: "Google Pay", src: "/images/payment-icons/google-pay.png", ratio: 752 / 400 },
  { label: "PhonePe", src: "/images/payment-icons/phonepe.png", ratio: 1 },
  { label: "Paytm", src: "/images/payment-icons/paytm.png", ratio: 936 / 714 },
];

export default function PaymentLogos({ height = 20 }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {apps.map((app) => (
        <Image
          key={app.label}
          src={app.src}
          alt={app.label}
          width={Math.round(height * app.ratio)}
          height={height}
          style={{ height, width: "auto" }}
          className="object-contain"
        />
      ))}
      <span className="rounded border border-ink/15 px-1.5 py-0.5 text-[11px] font-semibold text-ink/60">Any UPI</span>
      <span className="rounded border border-ink/15 px-1.5 py-0.5 text-[11px] font-semibold text-ink/60">Cards</span>
      <span className="rounded border border-ink/15 px-1.5 py-0.5 text-[11px] font-semibold text-ink/60">Netbanking</span>
    </div>
  );
}
