import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { getOrder, markOrderPaid } from "@/lib/db/orders.server";
import { isRazorpayConfigured, verifyPaymentSignature } from "@/lib/razorpay.server";

// Called by the browser right after Razorpay Checkout reports success.
// Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }.
export async function POST(req) {
  if (!isDbConfigured() || !isRazorpayConfigured()) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

  const order = orderId ? await getOrder(String(orderId)) : null;
  if (!order || !order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const valid = verifyPaymentSignature({
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!valid) {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  const paid = await markOrderPaid(order.id, { razorpayPaymentId: razorpay_payment_id });
  return NextResponse.json({ order: paid });
}
