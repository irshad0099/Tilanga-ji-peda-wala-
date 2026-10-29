"use client";

import { useState } from "react";
import Link from "next/link";
import { findOrder, orderStages, paymentStatusLabels } from "@/lib/orders";
import { formatRupees } from "@/lib/format";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setSearching(true);
    const found = await findOrder(orderId);
    setOrder(found || null);
    setSearched(true);
    setSearching(false);
  }

  const currentStageIndex = order ? orderStages.indexOf(order.status) : -1;
  const unpaid = ["awaiting_payment", "failed"].includes(order?.paymentStatus);
  const lines = order ? order.items.map((i) => ({ label: `${i.name} × ${i.qty}`, amount: i.price * i.qty })) : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-maroon">Track Your Order</h1>
        <p className="mt-3 text-[15px] text-ink/70">
          Enter the order ID you received at checkout (for example, TJ-482913).
        </p>
      </div>

      <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md gap-3">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="TJ-XXXXXX"
          className="w-full rounded-lg border border-maroon/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-maroon"
        />
        <button
          type="submit"
          disabled={searching}
          className="shrink-0 rounded-lg bg-maroon px-5 py-2.5 text-sm font-semibold text-cream hover:bg-maroon-dark disabled:opacity-60"
        >
          {searching ? "Searching…" : "Track"}
        </button>
      </form>

      {searched && !order && !searching && (
        <p className="mt-6 text-center text-[15px] text-saffron">
          No order found with that ID.
        </p>
      )}

      {order && (
        <div className="mt-10 rounded-xl border border-gold/30 bg-cream-dark/30 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl text-maroon">
              {order.id}
            </h2>
            <span className="text-sm text-ink/60">
              {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          {unpaid ? (
            <p className="mt-6 rounded-lg border border-saffron/40 bg-saffron/5 p-4 text-sm text-ink/80">
              The online payment for this order wasn&apos;t completed, so it hasn&apos;t been placed.
              Please order again from the menu, or call the shop if money was deducted.
            </p>
          ) : (
            <ol className="mt-6 flex justify-between text-center text-xs">
              {orderStages.map((stage, i) => (
                <li key={stage} className="flex-1">
                  <div className={`mx-auto h-3 w-3 rounded-full ${i <= currentStageIndex ? "bg-saffron" : "bg-maroon/20"}`} />
                  <p className={`mt-2 ${i <= currentStageIndex ? "font-semibold text-maroon" : "text-ink/50"}`}>{stage}</p>
                </li>
              ))}
            </ol>
          )}

          <ul className="mt-8 space-y-2 border-t border-gold/30 pt-4 text-sm">
            {lines.map((l) => (
              <li key={l.label} className="flex justify-between">
                <span>{l.label}</span>
                <span>{formatRupees(l.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-gold/30 pt-3 text-base font-semibold text-maroon">
            <span>Total</span>
            <span>{formatRupees(order.total)}</span>
          </div>

          <dl className="mt-4 space-y-1 text-sm text-ink/70">
            <div className="flex justify-between gap-4">
              <dt>Payment</dt>
              <dd className="text-right">
                {order.paymentStatus === "paid" && <span className="text-maroon">✓ </span>}
                {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
              </dd>
            </div>
            {order.razorpayPaymentId && (
              <div className="flex justify-between gap-4">
                <dt>Payment ID</dt>
                <dd className="text-right font-mono text-[13px]">{order.razorpayPaymentId}</dd>
              </div>
            )}
          </dl>

          <p className="mt-4 text-sm text-ink/60">
            Delivering to {order.customer?.address} — {order.customer?.pincode}
          </p>

          <Link
            href={`/invoice/${order.id}`}
            className="mt-5 inline-block rounded-lg border-2 border-maroon px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-maroon hover:text-cream"
          >
            View / download invoice
          </Link>
        </div>
      )}
    </div>
  );
}
