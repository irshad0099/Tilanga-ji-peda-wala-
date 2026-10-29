"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderStages, paymentStatusLabels } from "@/lib/orders";
import { formatRupees } from "@/lib/format";

export default function OrdersTab({ adminKey }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/orders", { headers: { "x-admin-key": adminKey } });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }

  async function patchOrder(id, patch) {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const { order } = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? order : o)));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-maroon">Orders ({orders.length})</h2>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg border-2 border-maroon px-4 py-2 text-sm font-semibold text-maroon hover:bg-maroon hover:text-cream disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-center text-ink/60">{loading ? "Loading…" : "No orders yet."}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gold/30">
          <table className="w-full min-w-[62rem] text-sm">
            <thead>
              <tr className="bg-maroon text-left text-cream">
                <th className="px-3 py-2.5 font-semibold">Order</th>
                <th className="px-3 py-2.5 font-semibold">Customer</th>
                <th className="px-3 py-2.5 font-semibold">Amount</th>
                <th className="px-3 py-2.5 font-semibold">Payment</th>
                <th className="px-3 py-2.5 font-semibold">Delivery status</th>
                <th className="px-3 py-2.5 font-semibold">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                // Online orders the customer never finished paying for — kept
                // for reference, but there's nothing to pack or ship.
                const unpaid = ["awaiting_payment", "failed"].includes(order.paymentStatus);
                return (
                  <tr key={order._id} className={`border-t border-gold/20 align-top ${unpaid ? "opacity-55" : ""}`}>
                    <td className="px-3 py-2.5">
                      <p className="font-mono text-[13px] text-ink">{order.id}</p>
                      <p className="text-xs text-ink/50">
                        {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-ink">{order.customer?.name}</p>
                      <p className="text-xs text-ink/50">{order.customer?.phone}</p>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-saffron">{formatRupees(order.total)}</td>
                    <td className="px-3 py-2.5">
                      <p className={order.paymentStatus === "paid" ? "font-semibold text-maroon" : "text-ink/80"}>
                        {order.paymentStatus === "paid" && "✓ "}
                        {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                      </p>
                      {order.razorpayPaymentId && (
                        <p className="font-mono text-xs text-ink/50">{order.razorpayPaymentId}</p>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {unpaid ? (
                        <span className="text-xs text-ink/60">Not placed — payment pending</span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => patchOrder(order._id, { status: e.target.value })}
                          className="rounded-lg border border-maroon/30 bg-cream px-2 py-1.5 text-sm outline-none focus:border-maroon"
                        >
                          {orderStages.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <Link href={`/invoice/${order.id}`} target="_blank" className="text-sm font-medium text-maroon hover:text-saffron">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
