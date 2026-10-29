// Razorpay integration — server-only. Never import this from a "use client"
// component: it reads the key secret.
//
// Flow:
//   1. /api/checkout creates our order (prices computed on the server) and a
//      matching Razorpay order for the same amount.
//   2. The browser opens Razorpay Checkout with that Razorpay order id.
//   3. /api/checkout/verify checks the payment signature and marks our order
//      paid. /api/razorpay/webhook does the same from Razorpay's side, so an
//      order is still marked paid if the customer closes the tab right after
//      paying.
//
// Env vars (Vercel → Project → Settings → Environment Variables):
//   RAZORPAY_KEY_ID          rzp_test_… or rzp_live_… (safe to show the browser)
//   RAZORPAY_KEY_SECRET      secret — server only
//   RAZORPAY_WEBHOOK_SECRET  the secret you type when adding the webhook

import crypto from "node:crypto";

const API = "https://api.razorpay.com/v1";

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function razorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID;
}

/** Create a Razorpay order. `amount` is in rupees; Razorpay wants paise. */
export async function createRazorpayOrder({ amount, receipt, notes }) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: "INR", receipt, notes }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Razorpay order failed (${res.status}): ${data?.error?.description || "unknown error"}`);
  }
  return data;
}

function safeEqualHex(expected, received) {
  if (typeof received !== "string" || received.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(received, "utf8"));
}

/** Signature Razorpay Checkout returns to the browser after a payment. */
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature }) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return safeEqualHex(expected, signature);
}

/** X-Razorpay-Signature on webhook calls, computed over the raw body. */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
