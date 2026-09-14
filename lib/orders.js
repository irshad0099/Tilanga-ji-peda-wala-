// Order persistence — MongoDB Atlas (via /api/orders) is the source of
// truth, so an order placed on one device can be tracked from any other.
// A localStorage mirror is kept as an instant, offline-safe fallback: if
// the API call fails (no MONGODB_URI configured yet, or no network), the
// order still isn't lost, it just stays local until the database is set up.

const ORDERS_KEY = "tilanga_orders_v1";

export function generateOrderId(prefix = "TJ") {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
}

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(order) {
  if (typeof window === "undefined") return;
  try {
    const all = readLocal();
    const idx = all.findIndex((o) => o.id === order.id);
    if (idx >= 0) all[idx] = order;
    else all.unshift(order);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  } catch {
    // Storage may be unavailable (private mode, quota) — fail silently.
  }
}

export async function saveOrder(order) {
  writeLocal(order); // always keep a local copy first
  try {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
  } catch {
    // Offline or DB not configured yet — the local copy above still holds.
  }
  return order;
}

export async function findOrder(orderId) {
  if (!orderId) return undefined;
  const id = orderId.trim();

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(id.toUpperCase())}`);
    if (res.ok) {
      const { order } = await res.json();
      if (order) return order;
    }
  } catch {
    // network/db unavailable — fall through to the local cache
  }

  return readLocal().find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export const orderStages = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

export const paymentStatusLabels = {
  cod: "Cash on delivery",
  pending_verification: "Paid online — awaiting confirmation",
  paid: "Payment confirmed",
  advance_paid: "Advance paid — balance on delivery",
};
