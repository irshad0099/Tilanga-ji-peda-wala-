// Order vocabulary, matching what the shop site writes (lib/orders.js and
// /api/checkout there). "Cancelled" is admin-only: the shop's track page
// shows it as a cancelled order.

export const STATUSES = ["Payment pending", "Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

/** Statuses an admin can move an order to. */
export const SETTABLE_STATUSES = ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

export const OPEN_STATUSES = ["Placed", "Preparing", "Out for Delivery"];

export const PAYMENT_LABELS = {
  paid: "Paid online",
  cod: "Cash on delivery",
  awaiting_payment: "Payment not completed",
  failed: "Payment failed",
};

export const STATUS_STYLES = {
  "Payment pending": "bg-stone-100 text-stone-600",
  Placed: "bg-amber-100 text-amber-800",
  Preparing: "bg-orange-100 text-orange-800",
  "Out for Delivery": "bg-sky-100 text-sky-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-700",
};

export const PAYMENT_STYLES = {
  paid: "bg-emerald-100 text-emerald-800",
  cod: "bg-amber-100 text-amber-800",
  awaiting_payment: "bg-stone-100 text-stone-600",
  failed: "bg-rose-100 text-rose-700",
};

/**
 * Orders that count as sales: paid online, or cash on delivery — and not
 * cancelled. Abandoned online checkouts don't count.
 */
export const SALE_FILTER = { paymentStatus: { $in: ["paid", "cod"] }, status: { $ne: "Cancelled" } };
