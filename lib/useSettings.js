"use client";

// Client-side settings — starts from the static defaults in lib/config.js
// (so there's never a flash of empty data) and swaps in the live DB values
// once /api/settings resolves. Used by any client component that needs the
// WhatsApp number, shipping rules and which payment methods are on.

import { useEffect, useState } from "react";
import { shop, whatsapp, phones, retail } from "@/lib/config";

const FALLBACK = {
  shop: { hours: "Open daily, 7:00 AM – 9:30 PM", ...shop },
  whatsapp,
  phones,
  retail,
  // Assume both are on until /api/settings says otherwise, so the checkout
  // doesn't flash a disabled online option on every load.
  payments: { online: true, cod: true },
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
