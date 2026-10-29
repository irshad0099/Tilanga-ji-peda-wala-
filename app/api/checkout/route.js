import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { createOrder, updateOrder } from "@/lib/db/orders.server";
import { CheckoutError, priceCart, validateCustomer } from "@/lib/db/checkout.server";
import { createRazorpayOrder, isRazorpayConfigured, razorpayKeyId } from "@/lib/razorpay.server";

// Place an order. Body: { items: [{ slug, qty }], customer, payment: "online" | "cod" }.
// For "online" the response also carries what the browser needs to open
// Razorpay Checkout; the order stays "awaiting_payment" until it's verified.
export async function POST(req) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Orders are not available right now. Please call the shop." }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const payment = body?.payment === "cod" ? "cod" : "online";
  if (payment === "online" && !isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Online payment isn't available right now. Please choose Cash on Delivery." },
      { status: 503 }
    );
  }

  const { customer, errors } = validateCustomer(body?.customer);
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check your details.", fieldErrors: errors }, { status: 400 });
  }

  let priced;
  try {
    priced = await priceCart(body?.items);
  } catch (err) {
    if (err instanceof CheckoutError) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }

  const order = await createOrder({
    type: "retail",
    ...priced,
    customer,
    payment,
    paymentStatus: payment === "cod" ? "cod" : "awaiting_payment",
    status: payment === "cod" ? "Placed" : "Payment pending",
  });

  if (payment === "cod") return NextResponse.json({ order }, { status: 201 });

  try {
    const rzp = await createRazorpayOrder({
      amount: order.total,
      receipt: order.id,
      notes: { orderId: order.id },
    });
    const saved = await updateOrder(order.id, { razorpayOrderId: rzp.id });
    return NextResponse.json(
      {
        order: saved,
        razorpay: {
          keyId: razorpayKeyId(),
          orderId: rzp.id,
          amount: rzp.amount,
          currency: rzp.currency,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Razorpay order creation failed", err);
    await updateOrder(order.id, { paymentStatus: "failed", paymentError: "Could not start payment" });
    return NextResponse.json(
      { error: "Couldn't start the online payment. Please try again, or choose Cash on Delivery." },
      { status: 502 }
    );
  }
}
