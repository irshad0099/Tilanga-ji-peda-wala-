// Demo order storage. There is no backend yet, so orders are kept in this
// browser's localStorage only, so the checkout -> track order flow can be
// demonstrated end to end. Swap this out once a real API exists.
//
// Both retail orders and bulk orders live here, told apart by `type`.

const ORDERS_KEY = "tilanga_orders_v1";

export function generateOrderId(prefix = "TJ") {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
}

export function saveOrder(order) {
  if (typeof window === "undefined") return;
  const all = listOrders();
  const idx = all.findIndex((o) => o.id === order.id);
  if (idx >= 0) all[idx] = order;
  else all.unshift(order);
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
}

export function listOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function findOrder(orderId) {
  if (!orderId) return undefined;
  return listOrders().find(
    (o) => o.id.toLowerCase() === orderId.trim().toLowerCase()
  );
}

export const orderStages = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

export const paymentStatusLabels = {
  cod: "Cash on delivery",
  pending_verification: "Paid online — awaiting confirmation",
  paid: "Payment confirmed",
  advance_paid: "Advance paid — balance on delivery",
};
