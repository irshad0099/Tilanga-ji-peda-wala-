import { cookies } from "next/headers";
import { exportOrders } from "@/lib/data";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { PAYMENT_LABELS } from "@/lib/orders";

function cell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Orders matching the current filters as a CSV (opens in Excel / Sheets).
export async function GET(req) {
  const store = await cookies();
  if (!verifySessionToken(store.get(SESSION_COOKIE)?.value)) return new Response("Unauthorized", { status: 401 });

  const sp = new URL(req.url).searchParams;
  const orders = await exportOrders(Object.fromEntries(["q", "status", "payment", "from", "to"].map((k) => [k, sp.get(k) || ""])));

  const header = ["Order ID", "Date (IST)", "Customer", "Phone", "Address", "Pincode", "Items", "Subtotal", "Delivery", "Total", "Payment", "Razorpay payment ID", "Status"];
  const rows = orders.map((o) => [
    o._id,
    new Date(o.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    o.customer?.name,
    o.customer?.phone,
    o.customer?.address,
    o.customer?.pincode,
    (o.items || []).map((i) => `${i.qty} x ${i.name} (${i.weight})`).join("; "),
    o.subtotal,
    o.deliveryFee,
    o.total,
    PAYMENT_LABELS[o.paymentStatus] || o.paymentStatus,
    o.razorpayPaymentId || "",
    o.status,
  ]);
  // BOM so Excel reads the ₹ and Hindi text as UTF-8.
  const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const name = `tilangaji-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"` },
  });
}
