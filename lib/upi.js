// Build UPI payment links — the generic NPCI `upi://pay` intent (opens a
// chooser of every installed UPI app) plus the direct app schemes for
// PhonePe, Google Pay and Paytm so a customer can tap their own app and
// land straight on the pre-filled payment screen.
//
// Note: the payee address (`pa`) must keep a literal "@" — some bank apps
// reject a percent-encoded "%40" — so we encode values but restore "@".

import { upi as defaultUpi } from "@/lib/config";

const SCHEMES = {
  upi: "upi://pay", // generic — Android shows an app chooser (PhonePe/GPay/Paytm/BHIM/bank apps)
  phonepe: "phonepe://pay",
  gpay: "tez://upi/pay", // Google Pay's UPI intent scheme (still "tez" under the hood)
  paytm: "paytmmp://pay",
};

function buildLink(scheme, { amount, note, txnRef }, upiConfig = defaultUpi) {
  const pairs = [
    ["pa", upiConfig.vpa],
    ["pn", upiConfig.payeeName],
    ["cu", "INR"],
    ["am", Number(amount).toFixed(2)],
  ];
  if (upiConfig.merchantCode) pairs.push(["mc", upiConfig.merchantCode]);
  if (txnRef) pairs.push(["tr", txnRef]);
  if (note) pairs.push(["tn", note.slice(0, 80)]);

  const query = pairs
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v)).replace(/%40/g, "@")}`)
    .join("&");
  return `${scheme}?${query}`;
}

/** Generic UPI intent — works with any UPI app. Pass live `upiConfig` from useSettings(). */
export function buildUpiLink(opts, upiConfig) {
  return buildLink(SCHEMES.upi, opts, upiConfig);
}

/** App-specific deep links so a named button opens straight into that app. */
export function buildAppUpiLink(app, opts, upiConfig) {
  return buildLink(SCHEMES[app] || SCHEMES.upi, opts, upiConfig);
}

export const upiApps = [
  { id: "phonepe", label: "PhonePe", bg: "#5F259F", fg: "#FFFFFF", mark: "Pe" },
  { id: "gpay", label: "Google Pay", bg: "#FFFFFF", fg: "#3C4043", mark: "G", border: true },
  { id: "paytm", label: "Paytm", bg: "#00214E", fg: "#00BAF2", mark: "P" },
];

// A short, human-readable reference we can quote to the customer and match
// against their payment. Not a real gateway transaction id.
export function makePaymentRef(orderId) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `${orderId}-${stamp}`;
}
