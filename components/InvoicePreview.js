"use client";

import { useState } from "react";
import { shop, upi } from "@/lib/config";
import { formatRupees } from "@/lib/format";
import { toInvoice, downloadInvoicePdf } from "@/lib/invoice";

export default function InvoicePreview({ order }) {
  const [busy, setBusy] = useState(false);
  const inv = toInvoice(order);

  async function handleDownload() {
    setBusy(true);
    try {
      await downloadInvoicePdf(inv);
    } finally {
      setBusy(false);
    }
  }

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-teal">Invoice preview</h2>
        <button
          onClick={handleDownload}
          disabled={busy}
          className="rounded-lg bg-maroon px-5 py-2.5 text-sm font-semibold text-cream hover:bg-maroon/90 disabled:opacity-60"
        >
          {busy ? "Preparing…" : "Download PDF"}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gold/40 bg-cream">
        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold/30 bg-cream-dark/40 p-6">
          <div>
            <p className="font-display text-xl text-maroon">{shop.shortName}</p>
            <p className="mt-1 text-xs text-ink/60">{shop.legalName}</p>
            <p className="max-w-[16rem] text-xs text-ink/60">{shop.address}</p>
            {shop.gstin && <p className="text-xs text-ink/60">GSTIN: {shop.gstin}</p>}
          </div>
          <div className="text-right text-sm">
            <p className="font-display text-lg text-ink">{inv.type}</p>
            <p className="mt-1 text-xs text-ink/60">Invoice No: {inv.number}</p>
            <p className="text-xs text-ink/60">Date: {fmtDate(inv.date)}</p>
            {inv.deliveryDate && (
              <p className="text-xs text-ink/60">Delivery: {fmtDate(inv.deliveryDate)}</p>
            )}
          </div>
        </div>

        {/* bill to */}
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Bill to</p>
          <p className="mt-1 text-sm font-medium text-ink">{inv.customer?.name}</p>
          <p className="text-sm text-ink/70">{inv.customer?.phone}</p>
          {inv.customer?.email && <p className="text-sm text-ink/70">{inv.customer.email}</p>}
          <p className="text-sm text-ink/70">
            {[inv.customer?.address, inv.customer?.city].filter(Boolean).join(", ")}
            {inv.customer?.pincode ? ` — ${inv.customer.pincode}` : ""}
          </p>

          {/* lines */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-sm">
              <thead>
                <tr className="bg-teal text-left text-cream">
                  <th className="px-3 py-2 font-semibold">Description</th>
                  <th className="px-3 py-2 text-right font-semibold">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold">Rate</th>
                  <th className="px-3 py-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {inv.lines.map((l, i) => (
                  <tr key={i} className="border-b border-gold/20">
                    <td className="px-3 py-2 text-ink">{l.description}</td>
                    <td className="px-3 py-2 text-right text-ink/80">
                      {l.qty} {l.unit}
                    </td>
                    <td className="px-3 py-2 text-right text-ink/80">{formatRupees(l.rate)}</td>
                    <td className="px-3 py-2 text-right text-ink">{formatRupees(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* totals */}
          <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
            <Row label="Subtotal" value={formatRupees(inv.subtotal)} />
            {inv.deliveryFee > 0 && <Row label="Delivery" value={formatRupees(inv.deliveryFee)} />}
            <Row label="Total" value={formatRupees(inv.total)} bold />
            {inv.amountPaid > 0 && (
              <>
                <Row label="Paid" value={`- ${formatRupees(inv.amountPaid)}`} />
                <Row label="Balance due" value={formatRupees(inv.balanceDue)} bold />
              </>
            )}
          </div>

          {/* payment */}
          <div className="mt-6 rounded-lg border border-gold/30 bg-cream-dark/30 p-4 text-xs text-ink/70">
            <p className="font-semibold text-ink">Payment</p>
            <p className="mt-1">
              {inv.paymentMethod} · {inv.paymentStatus}
              {inv.paymentRef ? ` · Ref ${inv.paymentRef}` : ""}
            </p>
            <p className="mt-0.5">UPI: {upi.vpa}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? "border-t border-gold/30 pt-1 font-semibold text-teal" : "text-ink/70"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
