"use client";

import { useState, useSyncExternalStore } from "react";
import { estimateDelivery } from "@/lib/shipping";

// Same-day dispatch cut-off, matching the announcement bar.
const CUTOFF_HOUR = 16;

// "Today's date + whether we're past the cut-off" — read only in the
// browser (the server doesn't know the customer's clock), and stable for
// the whole hour so React doesn't re-render needlessly.
function subscribe() {
  return () => {};
}
function clientSnapshot() {
  const d = new Date();
  return `${d.toDateString()}|${d.getHours() >= CUTOFF_HOUR ? 1 : 0}`;
}
function serverSnapshot() {
  return null;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// Order → Ships → Delivered, with real calendar dates for the customer's
// pincode (defaults to "rest of India" until they enter one).
export default function DeliveryTimeline() {
  const snap = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [pin, setPin] = useState("");
  const zone = estimateDelivery(pin) || { zone: "Rest of India", minDays: 3, maxDays: 5 };

  let steps = null;
  if (snap) {
    const [dateStr, late] = snap.split("|");
    const today = new Date(dateStr);
    const ship = addDays(today, late === "1" ? 1 : 0);
    const from = addDays(ship, zone.minDays);
    const to = addDays(ship, zone.maxDays);
    steps = [
      { label: "Order placed", date: fmt(today), icon: "cart" },
      { label: "Ships", date: fmt(ship), icon: "truck" },
      { label: "Delivered", date: from.getTime() === to.getTime() ? fmt(from) : `${fmt(from)} – ${fmt(to)}`, icon: "box" },
    ];
  }

  return (
    <div className="rounded-2xl border-2 border-olive/30 bg-cream p-4 sm:p-5">
      <ol className="relative grid grid-cols-3 text-center">
        <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-6 h-1 rounded-full bg-gradient-to-r from-leaf via-olive to-haldi" />
        {(steps || [{ label: "Order placed" }, { label: "Ships" }, { label: "Delivered" }]).map((s, i) => (
          <li key={s.label} className="relative flex flex-col items-center">
            <span className="float flex h-12 w-12 items-center justify-center rounded-full bg-leaf text-cream shadow-[0_6px_14px_rgba(40,61,16,0.35)] ring-4 ring-cream" style={{ "--float-delay": `${i * 0.5}s` }}>
              <StepIcon name={["cart", "truck", "box"][i]} />
            </span>
            <span className="mt-2 text-sm font-bold text-ink">{s.date || "…"}</span>
            <span className="text-xs text-ink/60">{s.label}</span>
          </li>
        ))}
      </ol>
      <label className="mt-4 flex items-center justify-center gap-2 text-xs text-ink/65">
        Delivering to pincode
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          placeholder="______"
          className="w-20 rounded-md border border-olive/40 bg-cream-dark/40 px-2 py-1 text-center font-semibold tracking-widest text-ink outline-none focus:border-leaf"
        />
        <span className="font-semibold text-leaf">{zone.zone}</span>
      </label>
    </div>
  );
}

function StepIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "cart")
    return (
      <svg {...common}>
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3h2l2.4 12h11.6l2-8H6" />
      </svg>
    );
  if (name === "truck")
    return (
      <svg {...common}>
        <path d="M2 6h11v10H2zM13 10h4l3 3v3h-7" />
        <circle cx="6" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10" />
    </svg>
  );
}
