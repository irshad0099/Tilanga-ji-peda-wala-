"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions";
import SaveStatus from "@/components/SaveStatus";

function Field({ label, hint, children, wide }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-ink/55">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
    </label>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="card p-5">
      <h2 className="text-lg font-black text-leaf-dark">{title}</h2>
      {subtitle && <p className="text-sm text-ink/55">{subtitle}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function SettingsForm({ s }) {
  const [state, action, pending] = useActionState(saveSettings, null);
  const shop = s.shop || {};

  return (
    <form action={action} className="space-y-6">
      <Section title="Shop details" subtitle="Shown in the footer, on invoices and on the Terms & Privacy pages.">
        <Field label="Legal / business name" hint="Keep this the same as on Razorpay and GST." wide>
          <input name="legalName" defaultValue={shop.legalName} required className="field" />
        </Field>
        <Field label="Short name" hint="Used in WhatsApp greetings.">
          <input name="shortName" defaultValue={shop.shortName} className="field" />
        </Field>
        <Field label="GSTIN" hint="Printed on invoices. Leave empty to hide.">
          <input name="gstin" defaultValue={shop.gstin} maxLength={15} className="field font-mono uppercase" />
        </Field>
        <Field label="Address" wide>
          <input name="address" defaultValue={shop.address} className="field" />
        </Field>
        <Field label="Opening hours">
          <input name="hours" defaultValue={shop.hours} placeholder="Open daily, 7:00 AM – 9:30 PM" className="field" />
        </Field>
        <Field label="Email" hint="Optional.">
          <input name="email" type="email" defaultValue={shop.email?.endsWith(".example") ? "" : shop.email} className="field" />
        </Field>
        <Field label="Google Maps link" wide>
          <input name="googleMapsUrl" defaultValue={shop.googleMapsUrl} className="field" />
        </Field>
      </Section>

      <Section title="Contact" subtitle="Customers call and WhatsApp these numbers.">
        <Field label="WhatsApp number" hint="91 + 10-digit mobile, no spaces — e.g. 919123414885.">
          <input name="whatsapp" defaultValue={s.whatsapp?.number} inputMode="numeric" className="field font-mono" />
        </Field>
        <div />
        <Field label="Phone 1">
          <input name="phone1" defaultValue={s.phones?.[0]} placeholder="+91 91234 14885" className="field" />
        </Field>
        <Field label="Phone 2" hint="Optional — leave empty to show one number.">
          <input name="phone2" defaultValue={s.phones?.[1]} className="field" />
        </Field>
      </Section>

      <Section title="Delivery charges">
        <Field label="Free delivery above (₹)">
          <input name="freeShippingAbove" type="number" min="0" defaultValue={s.retail?.freeShippingAbove} className="field" />
        </Field>
        <Field label="Delivery fee below that (₹)">
          <input name="flatShippingFee" type="number" min="0" defaultValue={s.retail?.flatShippingFee} className="field" />
        </Field>
      </Section>

      <div className="card sticky bottom-4 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <SaveStatus state={state} />
        <button disabled={pending} className="btn ml-auto bg-leaf-dark px-8 text-cream hover:bg-leaf">
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
