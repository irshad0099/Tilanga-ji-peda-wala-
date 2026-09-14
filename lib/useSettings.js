"use client";

// Client-side settings — starts from the static defaults in lib/config.js
// (so there's never a flash of empty data) and swaps in the live DB values
// once /api/settings resolves. Used by any client component that needs the
// UPI ID, WhatsApp number, shipping rules, etc.

import { useEffect, useState } from "react";
import { shop, upi, whatsapp, phones, retail, bulk } from "@/lib/config";

const FALLBACK = {
  shop: { hours: "Open daily, 7:00 AM – 9:30 PM", ...shop },
  upi,
  whatsapp,
  phones,
  retail,
  bulk,
};

export function useSettings() {
  const [settings, setSettings] = useState(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data?.settings) setSettings(data.settings);
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  return { settings, loaded };
}
