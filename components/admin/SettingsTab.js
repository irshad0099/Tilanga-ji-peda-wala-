"use client";

import { useEffect, useState } from "react";

export default function SettingsTab({ adminKey }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings))
      .finally(() => setLoading(false));
  }, []);

  function set(section, field, value) {
    setSettings((s) => ({ ...s, [section]: { ...s[section], [field]: value } }));
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError("Couldn't save — try again.");
    }
  }

  if (loading || !settings) {
    return <p className="mt-10 text-center text-ink/60">Loading…</p>;
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-8">
      <h2 className="font-display text-xl text-maroon">Shop settings</h2>
      <p className="text-xs text-ink/50">
        Changes here go live everywhere immediately — invoices, WhatsApp messages, checkout
        and the footer all read from this.
      </p>

      <Section title="Shop">
        <Field label="Short name" value={settings.shop.shortName} onChange={(v) => set("shop", "shortName", v)} />
        <Field label="Legal name" value={settings.shop.legalName} onChange={(v) => set("shop", "legalName", v)} />
        <Field label="Address" value={settings.shop.address} onChange={(v) => set("shop", "address", v)} full />
        <Field label="Opening hours" value={settings.shop.hours} onChange={(v) => set("shop", "hours", v)} />
        <Field label="GSTIN (optional)" value={settings.shop.gstin} onChange={(v) => set("shop", "gstin", v)} />
        <Field label="Email" value={settings.shop.email} onChange={(v) => set("shop", "email", v)} />
        <Field
          label="Google Maps listing URL (for the reviews button)"
          value={settings.shop.googleMapsUrl}
          onChange={(v) => set("shop", "googleMapsUrl", v)}
          full
        />
      </Section>

      <Section title="Payments">
        <div className="text-sm sm:col-span-2">
          <p className="text-ink/80">
            Online payment (Razorpay):{" "}
            {settings.payments?.online ? (
              <span className="font-semibold text-maroon">On</span>
            ) : (
              <span className="font-semibold text-saffron">Off — Razorpay keys are not set</span>
            )}
          </p>
          <p className="mt-1 text-ink/80">
            Cash on delivery: <span className="font-semibold text-maroon">On</span>
          </p>
          <p className="mt-2 text-xs text-ink/50">
            Razorpay keys are secrets, so they are set as environment variables on Vercel
            (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET), not here.
          </p>
        </div>
      </Section>

      <Section title="WhatsApp & phone">
        <Field
          label="WhatsApp number (digits, with country code)"
          value={settings.whatsapp.number}
          onChange={(v) => set("whatsapp", "number", v.replace(/\D/g, ""))}
        />
        <Field
          label="Phone 1"
          value={settings.phones[0] || ""}
          onChange={(v) =>
            setSettings((s) => ({ ...s, phones: [v, s.phones[1] || ""] }))
          }
        />
        <Field
          label="Phone 2"
          value={settings.phones[1] || ""}
          onChange={(v) =>
            setSettings((s) => ({ ...s, phones: [s.phones[0] || "", v] }))
          }
        />
      </Section>

      <Section title="Retail shipping">
        <Field
          label="Free shipping above (₹)"
          type="number"
          value={settings.retail.freeShippingAbove}
          onChange={(v) => set("retail", "freeShippingAbove", Number(v))}
        />
        <Field
          label="Shipping fee below that (₹)"
          type="number"
          value={settings.retail.flatShippingFee}
          onChange={(v) => set("retail", "flatShippingFee", Number(v))}
        />
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-saffron px-6 py-2.5 text-sm font-semibold text-cream hover:bg-saffron/90 disabled:opacity-60"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save settings"}
        </button>
        {error && <p className="text-sm text-saffron">{error}</p>}
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="rounded-xl border border-gold/30 bg-cream-dark/20 p-5">
      <legend className="px-1 font-display text-base text-maroon">{title}</legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ label, value, onChange, full, type = "text", step }) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-ink/70">{label}</span>
      <input
        type={type}
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-maroon/30 bg-cream px-3 py-2 text-[15px] outline-none focus:border-maroon"
      />
    </label>
  );
}
