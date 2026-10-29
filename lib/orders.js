// Order lookups from the browser. MongoDB Atlas (via /api/orders/[id]) is the
// source of truth; orders are created only by /api/checkout. A localStorage
// copy of each order placed on this device is kept as an offline fallback
// for the track-order page.

const ORDERS_KEY = "tilanga_orders_v1";

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

/** Keep a local copy of an order placed (or updated) on this device. */
export function rememberOrder(order) {
  writeLocal(order);
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
  awaiting_payment: "Online payment not completed",
  failed: "Online payment failed",
  paid: "Paid online",
};
