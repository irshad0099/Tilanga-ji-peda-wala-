"use client";

import { useState } from "react";
import { findOrder, orderStages } from "@/lib/orders";
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-teal">Track Your Order</h1>
        <p className="mt-3 text-[15px] text-ink/70">
          Enter the order ID you received at checkout (for example, TJ-482913).
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
          No order found with that ID on this device. Orders placed on
          another device or browser won't show up here yet.
        </p>
      )}

      {order && (
        <div className="mt-10 rounded-xl border border-gold/30 bg-cream-dark/30 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl text-teal">{order.id}</h2>
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
            {order.items.map((item) => (
              <li key={item.slug} className="flex justify-between">
                <span>{item.name} × {item.qty}</span>
                <span>{formatRupees(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-gold/30 pt-3 text-base font-semibold text-teal">
            <span>Total</span>
            <span>{formatRupees(order.total)}</span>
          </div>

          <p className="mt-4 text-sm text-ink/60">
            Delivering to {order.customer?.address} — {order.customer?.pincode}
          </p>
        </div>
      )}
    </div>
  );
}
