// Build UPI payment links — the generic NPCI `upi://pay` intent (opens a
// chooser of every installed UPI app) plus the direct app schemes for
// PhonePe, Google Pay and Paytm so a customer can tap their own app and
// land straight on the pre-filled payment screen.
//
// Note: the payee address (`pa`) must keep a literal "@" — some bank apps
// reject a percent-encoded "%40" — so we encode values but restore "@".

import { upi } from "@/lib/config";

const SCHEMES = {
  upi: "upi://pay", // generic — Android shows an app chooser (PhonePe/GPay/Paytm/BHIM/bank apps)
  phonepe: "phonepe://pay",
  gpay: "tez://upi/pay", // Google Pay's UPI intent scheme (still "tez" under the hood)
  paytm: "paytmmp://pay",
};

function buildLink(scheme, { amount, note, txnRef }) {
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
  return `${scheme}?${query}`;
}

/** Generic UPI intent — works with any UPI app. */
export function buildUpiLink(opts) {
  return buildLink(SCHEMES.upi, opts);
}

/** App-specific deep links so a named button opens straight into that app. */
export function buildAppUpiLink(app, opts) {
  return buildLink(SCHEMES[app] || SCHEMES.upi, opts);
}

export const upiApps = [
  { id: "phonepe", label: "PhonePe" },
  { id: "gpay", label: "Google Pay" },
  { id: "paytm", label: "Paytm" },
];

// A short, human-readable reference we can quote to the customer and match
// against their payment. Not a real gateway transaction id.
export function makePaymentRef(orderId) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `${orderId}-${stamp}`;
}
