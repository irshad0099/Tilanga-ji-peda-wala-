// Build a UPI payment link per the NPCI UPI deep-linking spec.
// Any UPI app (GPay, PhonePe, Paytm, BHIM, bank apps) can open this link
// or scan it as a QR to pre-fill a payment to the shop.
//
// Note: the payee address (`pa`) must keep a literal "@" — some bank apps
// reject a percent-encoded "%40" — so we encode values but restore "@".

import { upi } from "@/lib/config";

/**
 * @param {{ amount: number, note?: string, txnRef?: string }} opts
 * @returns {string} a `upi://pay?...` URI
 */
export function buildUpiLink({ amount, note, txnRef }) {
  const pairs = [
    ["pa", upi.vpa],
    ["pn", upi.payeeName],
    ["cu", "INR"],
    ["am", Number(amount).toFixed(2)],
  ];
  if (upi.merchantCode) pairs.push(["mc", upi.merchantCode]);
  if (txnRef) pairs.push(["tr", txnRef]);
  if (note) pairs.push(["tn", note.slice(0, 80)]);

  const query = pairs
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v)).replace(/%40/g, "@")}`)
    .join("&");
  return `upi://pay?${query}`;
}

// A short, human-readable reference we can quote to the customer and match
// against their payment. Not a real gateway transaction id.
export function makePaymentRef(orderId) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `${orderId}-${stamp}`;
}
