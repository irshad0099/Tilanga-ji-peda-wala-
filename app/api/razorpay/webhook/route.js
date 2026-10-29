import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { getOrder, getOrderByRazorpayOrderId, markOrderPaid, markPaymentFailed } from "@/lib/db/orders.server";
import { verifyWebhookSignature } from "@/lib/razorpay.server";

// Razorpay → us. Backs up /api/checkout/verify: if the customer pays and then
// loses network or closes the tab, this still marks the order paid.
// Add it in Razorpay Dashboard → Settings → Webhooks with the URL
// https://<your-domain>/api/razorpay/webhook and the events
// payment.captured, payment.failed and order.paid.
export async function POST(req) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (!isDbConfigured()) {
    // Tell Razorpay to retry later rather than dropping the event.
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payment = event?.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id || event?.payload?.order?.entity?.id;
  if (!razorpayOrderId) return NextResponse.json({ ok: true });

  const order =
    (await getOrderByRazorpayOrderId(razorpayOrderId)) ||
    (payment?.notes?.orderId ? await getOrder(String(payment.notes.orderId)) : null);
  if (!order) return NextResponse.json({ ok: true });

  if (event.event === "payment.captured" || event.event === "order.paid") {
    if (payment && payment.amount !== Math.round(order.total * 100)) {
      console.error(`Webhook amount mismatch for ${order.id}: got ${payment.amount}, expected ${order.total * 100}`);
      return NextResponse.json({ ok: true });
    }
    await markOrderPaid(order.id, { razorpayPaymentId: payment?.id, method: payment?.method });
  } else if (event.event === "payment.failed") {
    await markPaymentFailed(order.id, payment?.error_description);
  }

  return NextResponse.json({ ok: true });
}
