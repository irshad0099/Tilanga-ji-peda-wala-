"use client";

import { useState } from "react";
import Link from "next/link";
import { findOrder, orderStages, paymentStatusLabels } from "@/lib/orders";
import { formatRupees } from "@/lib/format";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    const found = findOrder(orderId);
    setOrder(found || null);
    setSearched(true);
  }

  const currentStageIndex = order ? orderStages.indexOf(order.status) : -1;
  const isBulk = order?.type === "bulk";
  const total = order ? (isBulk ? order.grandTotal : order.total) : 0;
  const lines = order
    ? isBulk
      ? order.lines.map((l) => ({ label: `${l.name} · ${l.kg} kg`, amount: l.amount }))
      : order.items.map((i) => ({ label: `${i.name} × ${i.qty}`, amount: i.price * i.qty }))
    : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-teal">Track Your Order</h1>
        <p className="mt-3 text-[15px] text-ink/70">
          Enter the order ID you received at checkout (for example, TJ-482913 or TJB-771204).
        </p>
      </div>

      <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md gap-3">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="TJ-XXXXXX"
          className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
        />
        <button type="submit" className="shrink-0 rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal-dark">
          Track
        </button>
      </form>

      {searched && !order && (
        <p className="mt-6 text-center text-[15px] text-maroon">
          No order found with that ID on this device. Orders placed on another device or browser
          won&apos;t show up here yet.
        </p>
      )}

      {order && (
        <div className="mt-10 rounded-xl border border-gold/30 bg-cream-dark/30 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl text-teal">
              {order.id}
              {isBulk && <span className="ml-2 rounded-full bg-maroon/10 px-2 py-0.5 text-xs font-semibold text-maroon">Bulk</span>}
            </h2>
            <span className="text-sm text-ink/60">
              {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          <ol className="mt-6 flex justify-between text-center text-xs">
            {orderStages.map((stage, i) => (
              <li key={stage} className="flex-1">
                <div className={`mx-auto h-3 w-3 rounded-full ${i <= currentStageIndex ? "bg-maroon" : "bg-teal/20"}`} />
                <p className={`mt-2 ${i <= currentStageIndex ? "font-semibold text-teal" : "text-ink/50"}`}>{stage}</p>
              </li>
            ))}
          </ol>

          <ul className="mt-8 space-y-2 border-t border-gold/30 pt-4 text-sm">
            {lines.map((l) => (
              <li key={l.label} className="flex justify-between">
                <span>{l.label}</span>
                <span>{formatRupees(l.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-gold/30 pt-3 text-base font-semibold text-teal">
            <span>{isBulk ? "Grand total" : "Total"}</span>
            <span>{formatRupees(total)}</span>
          </div>

          <dl className="mt-4 space-y-1 text-sm text-ink/70">
            <div className="flex justify-between gap-4">
              <dt>Payment</dt>
              <dd className="text-right">{paymentStatusLabels[order.paymentStatus] || order.paymentStatus}</dd>
            </div>
            {order.txnRef && (
              <div className="flex justify-between gap-4">
                <dt>UPI reference</dt>
                <dd className="text-right font-mono text-[13px]">{order.txnRef}</dd>
              </div>
            )}
            {isBulk && (
              <div className="flex justify-between gap-4">
                <dt>Balance on delivery</dt>
                <dd className="text-right">{formatRupees(order.balance)}</dd>
              </div>
            )}
          </dl>

          <p className="mt-4 text-sm text-ink/60">
            Delivering to {order.customer?.address}
            {order.customer?.city ? `, ${order.customer.city}` : ""} — {order.customer?.pincode}
            {isBulk && order.deliveryDate
              ? ` on ${new Date(order.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
              : ""}
          </p>

          <Link
            href={`/invoice/${order.id}`}
            className="mt-5 inline-block rounded-lg border-2 border-teal px-5 py-2.5 text-sm font-semibold text-teal hover:bg-teal hover:text-cream"
          >
            View / download invoice
          </Link>
        </div>
      )}
    </div>
  );
}
