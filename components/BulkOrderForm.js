"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getBulkItems } from "@/lib/products";
import { quoteBulkOrder, earliestBulkDate } from "@/lib/bulk";
import { bulk } from "@/lib/config";
import { formatRupees } from "@/lib/format";
import { generateOrderId, saveOrder } from "@/lib/orders";
import { bulkOrderWhatsappLink } from "@/lib/whatsapp";
import UpiQrPayment from "@/components/UpiQrPayment";
import InvoicePreview from "@/components/InvoicePreview";

const items = getBulkItems();
const minDate = earliestBulkDate();

export default function BulkOrderForm() {
  const [kg, setKg] = useState({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    deliveryDate: minDate,
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // form | pay | done
  const [draft, setDraft] = useState(null);
  const [placed, setPlaced] = useState(null);

  const quote = useMemo(() => quoteBulkOrder(kg), [kg]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function setKgFor(slug, value) {
    const n = value.replace(/[^\d.]/g, "");
    setKg((k) => ({ ...k, [slug]: n }));
  }

  function validate() {
    const next = {};
    if (!quote.lines.length) next.items = "Add a quantity for at least one sweet.";
    else if (!quote.meetsMinimum) next.items = `Minimum bulk order is ${bulk.minKg} kg total.`;
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = "Enter a valid 10-digit phone number.";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      next.email = "Enter a valid email or leave it blank.";
    if (!form.address.trim()) next.address = "Enter the delivery address.";
    if (!form.city.trim()) next.city = "Enter the city / town.";
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = "Enter a valid 6-digit pincode.";
    if (!form.deliveryDate || form.deliveryDate < minDate)
      next.deliveryDate = `Pick a date on or after ${minDate}.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleContinue(e) {
    e.preventDefault();
    if (!validate()) return;
    setDraft({
      id: generateOrderId("TJB"),
      type: "bulk",
      ...quote,
      payment: "upi",
      paymentStatus: "pending",
      txnRef: "",
      status: "Placed",
      date: new Date().toISOString(),
      deliveryDate: form.deliveryDate,
      notes: form.notes.trim(),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim(),
      },
    });
    setStep("pay");
  }

  function handlePaid(ref) {
    const order = { ...draft, paymentStatus: "advance_paid", txnRef: ref };
    saveOrder(order);
    setPlaced(order);
    setStep("done");
  }

  // ---- Confirmation ----
  if (step === "done" && placed) {
    return (
      <div>
        <div className="rounded-2xl border border-gold/40 bg-cream-dark/30 p-6 text-center">
          <h2 className="font-display text-2xl text-teal">Bulk order confirmed</h2>
          <p className="mt-2 text-[15px] text-ink/70">
            Advance of {formatRupees(placed.advance)} received. Balance{" "}
            {formatRupees(placed.balance)} is payable on delivery.
          </p>
          <p className="mt-4 inline-block rounded-lg border border-gold/40 bg-cream px-6 py-3 font-display text-xl text-teal">
            {placed.id}
          </p>
          <p className="mt-2 text-sm text-ink/60">
            Delivering {placed.totalKg} kg on{" "}
            {new Date(placed.deliveryDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={bulkOrderWhatsappLink(placed)}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal-dark"
            >
              Send details on WhatsApp
            </a>
            <Link
              href="/track-order"
              className="rounded-lg border-2 border-teal px-5 py-2.5 text-sm font-semibold text-teal hover:bg-teal hover:text-cream"
            >
              Track this order
            </Link>
          </div>
        </div>
        <div className="mt-10">
          <InvoicePreview order={placed} />
        </div>
      </div>
    );
  }

  // ---- Advance payment ----
  if (step === "pay" && draft) {
    return (
      <div className="mx-auto max-w-xl">
        <button onClick={() => setStep("form")} className="text-sm text-ink/60 hover:text-maroon">
          ← Back to order
        </button>
        <h2 className="mt-3 font-display text-2xl text-teal">
          Pay {formatRupees(draft.advance)} advance
        </h2>
        <p className="mt-2 text-[15px] text-ink/70">
          {Math.round(bulk.advanceFraction * 100)}% of {formatRupees(draft.grandTotal)}. The
          remaining {formatRupees(draft.balance)} is collected on delivery.
        </p>
        <div className="mt-6">
          <UpiQrPayment
            amount={draft.advance}
            note={`Tilanga Ji bulk ${draft.id} advance`}
            heading="Scan to pay advance"
            onConfirmed={handlePaid}
          />
        </div>
      </div>
    );
  }

  // ---- Form ----
  return (
    <form onSubmit={handleContinue} className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        {/* quantities */}
        <div>
          <h2 className="font-display text-lg text-teal">1. Choose sweets &amp; weight</h2>
          <p className="mt-1 text-sm text-ink/60">
            Enter kilograms. Minimum {bulk.minKg} kg total. Loose packing in food-grade boxes.
          </p>
          <div className="mt-4 space-y-2">
            {items.map((p) => (
              <div
                key={p.slug}
                className="flex items-center justify-between gap-4 rounded-lg border border-teal/20 bg-cream px-4 py-3"
              >
                <div>
                  <p className="text-[15px] font-medium text-ink">{p.name}</p>
                  <p className="text-xs text-ink/55">{formatRupees(p.pricePerKg)} / kg</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    inputMode="decimal"
                    value={kg[p.slug] ?? ""}
                    onChange={(e) => setKgFor(p.slug, e.target.value)}
                    placeholder="0"
                    className="w-20 rounded-lg border border-teal/30 bg-cream px-3 py-2 text-right text-[15px] outline-none focus:border-teal"
                  />
                  <span className="text-sm text-ink/50">kg</span>
                </div>
              </div>
            ))}
          </div>
          {errors.items && <p className="mt-2 text-sm text-maroon">{errors.items}</p>}
        </div>

        {/* customer */}
        <div>
          <h2 className="font-display text-lg text-teal">2. Delivery details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Contact name" error={errors.name}>
              <input className={inputCls} value={form.name} onChange={(e) => setField("name", e.target.value)} />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input
                className={inputCls}
                inputMode="numeric"
                maxLength={10}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <Field label="Email (optional)" error={errors.email}>
              <input className={inputCls} value={form.email} onChange={(e) => setField("email", e.target.value)} />
            </Field>
            <Field label="Preferred delivery date" error={errors.deliveryDate}>
              <input
                type="date"
                min={minDate}
                className={inputCls}
                value={form.deliveryDate}
                onChange={(e) => setField("deliveryDate", e.target.value)}
              />
            </Field>
            <Field label="Delivery address" error={errors.address} full>
              <textarea
                rows={2}
                className={inputCls}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </Field>
            <Field label="City / town" error={errors.city}>
              <input className={inputCls} value={form.city} onChange={(e) => setField("city", e.target.value)} />
            </Field>
            <Field label="Pincode" error={errors.pincode}>
              <input
                className={inputCls}
                inputMode="numeric"
                maxLength={6}
                value={form.pincode}
                onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <Field label="Occasion / notes (optional)" full>
              <textarea
                rows={2}
                className={inputCls}
                placeholder="Wedding, shop resale, festival hampers…"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* quote */}
      <div className="h-fit rounded-xl border border-gold/30 bg-cream-dark/30 p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg text-teal">Your quote</h2>
        {quote.lines.length === 0 ? (
          <p className="mt-4 text-sm text-ink/55">Add quantities to see pricing.</p>
        ) : (
          <>
            <ul className="mt-4 space-y-2 text-sm">
              {quote.lines.map((l) => (
                <li key={l.slug} className="flex justify-between">
                  <span className="text-ink/75">
                    {l.name} · {l.kg} kg
                  </span>
                  <span>{formatRupees(l.amount)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-gold/30 pt-3 text-sm">
              <Row label={`Items (${quote.totalKg} kg)`} value={formatRupees(quote.itemsTotal)} />
              <Row
                label="Home delivery"
                value={quote.deliveryFee === 0 ? "Free" : formatRupees(quote.deliveryFee)}
              />
              <Row label="Grand total" value={formatRupees(quote.grandTotal)} bold />
              <Row
                label={`Advance (${Math.round(bulk.advanceFraction * 100)}%)`}
                value={formatRupees(quote.advance)}
              />
              <Row label="Balance on delivery" value={formatRupees(quote.balance)} />
            </div>
          </>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-maroon py-3 text-[15px] font-semibold text-cream hover:bg-maroon/90"
        >
          Continue to advance payment
        </button>
        <p className="mt-2 text-center text-xs text-ink/45">
          Pay {Math.round(bulk.advanceFraction * 100)}% now, rest on delivery.
        </p>
      </div>
    </form>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal";

function Field({ label, error, full, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-sm font-medium text-ink/80">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-maroon">{error}</p>}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "border-t border-gold/30 pt-1 text-base font-semibold text-teal" : "text-ink/70"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
