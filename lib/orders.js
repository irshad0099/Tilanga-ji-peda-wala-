// Demo order storage. There is no backend yet, so orders are kept in this
// browser's localStorage only, purely so the checkout -> track order flow
// can be demonstrated end to end. Swap this out once a real API exists.

const ORDERS_KEY = "tilanga_orders_v1";

export function generateOrderId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TJ-${random}`;
}

export function saveOrder(order) {
  if (typeof window === "undefined") return;
  const all = listOrders();
  all.unshift(order);
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
  return listOrders().find(
    (o) => o.id.toLowerCase() === orderId.trim().toLowerCase()
  );
}

export const orderStages = ["Placed", "Preparing", "Out for Delivery", "Delivered"];
