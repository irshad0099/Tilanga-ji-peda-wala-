"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderStages, paymentStatusLabels } from "@/lib/orders";
import { formatRupees } from "@/lib/format";

const SESSION_KEY = "tilanga_admin_key";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authedKey, setAuthedKey] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
    if (saved) login(saved);
  }, []);

  async function login(candidateKey) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-key": candidateKey } });
      if (res.status === 401) {
        setError("Wrong admin key.");
        setLoading(false);
        return;
      }
      if (res.status === 503) {
        setError("Admin access isn't configured yet — set ADMIN_KEY in the server's environment variables.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setAuthedKey(candidateKey);
      sessionStorage.setItem(SESSION_KEY, candidateKey);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setLoading(false);
  }

  async function refresh() {
    if (!authedKey) return;
    setLoading(true);
    const res = await fetch("/api/orders", { headers: { "x-admin-key": authedKey } });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }

  async function patchOrder(id, patch) {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": authedKey },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const { order } = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? order : o)));
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthedKey(null);
    setOrders([]);
    setKey("");
  }

  if (!authedKey) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24 sm:px-6">
        <h1 className="font-display text-2xl text-teal">Shop Admin</h1>
        <p className="mt-2 text-sm text-ink/70">Enter the admin key to view and manage orders.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(key);
          }}
          className="mt-5 space-y-3"
        >
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal py-2.5 text-sm font-semibold text-cream hover:bg-teal-dark disabled:opacity-60"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-maroon">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-teal">Orders ({orders.length})</h1>
        <div className="flex gap-2">
          <button onClick={refresh} disabled={loading} className="rounded-lg border-2 border-teal px-4 py-2 text-sm font-semibold text-teal hover:bg-teal hover:text-cream disabled:opacity-60">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button onClick={logout} className="rounded-lg border-2 border-maroon/50 px-4 py-2 text-sm font-semibold text-maroon hover:bg-maroon hover:text-cream">
            Log out
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-center text-ink/60">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gold/30">
          <table className="w-full min-w-[62rem] text-sm">
            <thead>
              <tr className="bg-teal text-left text-cream">
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
                const isBulk = order.type === "bulk";
                const total = isBulk ? order.grandTotal : order.total;
                const canVerify = ["pending_verification", "advance_paid"].includes(order.paymentStatus) && !order.paymentVerified;
                return (
                  <tr key={order._id} className="border-t border-gold/20 align-top">
                    <td className="px-3 py-2.5">
                      <p className="font-mono text-[13px] text-ink">{order.id}</p>
                      <p className="text-xs text-ink/50">
                        {isBulk ? "Bulk" : "Retail"} ·{" "}
                        {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-ink">{order.customer?.name}</p>
                      <p className="text-xs text-ink/50">{order.customer?.phone}</p>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-maroon">{formatRupees(total)}</td>
                    <td className="px-3 py-2.5">
                      <p className="text-ink/80">{paymentStatusLabels[order.paymentStatus] || order.paymentStatus}</p>
                      {order.txnRef && <p className="font-mono text-xs text-ink/50">{order.txnRef}</p>}
                      {order.paymentVerified ? (
                        <span className="text-xs font-semibold text-teal">✓ Verified</span>
                      ) : canVerify ? (
                        <button
                          onClick={() => patchOrder(order._id, { paymentVerified: true, ...(order.paymentStatus === "pending_verification" ? { paymentStatus: "paid" } : {}) })}
                          className="mt-1 rounded border border-teal/40 px-2 py-0.5 text-xs font-semibold text-teal hover:bg-cream-dark"
                        >
                          Verify payment
                        </button>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={order.status}
                        onChange={(e) => patchOrder(order._id, { status: e.target.value })}
                        className="rounded-lg border border-teal/30 bg-cream px-2 py-1.5 text-sm outline-none focus:border-teal"
                      >
                        {orderStages.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      <Link href={`/invoice/${order.id}`} target="_blank" className="text-sm font-medium text-teal hover:text-maroon">
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
