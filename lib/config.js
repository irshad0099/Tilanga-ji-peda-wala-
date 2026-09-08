// ---------------------------------------------------------------------------
// SHOP CONFIG — edit this one file to make payments and orders go to the
// real shop. Nothing else in the codebase needs to change.
//
//   1. upi.vpa        -> your real UPI ID / VPA (e.g. "tilangaji@okhdfcbank")
//   2. upi.payeeName  -> the name registered on that UPI ID
//   3. whatsapp.number-> WhatsApp business number in international format,
//                        digits only, e.g. "919431055263"
//
// Until you set upi.vpa to a real VPA, the payment QR will still render but
// UPI apps will reject the payment. The rest of the site works regardless.
// ---------------------------------------------------------------------------

export const shop = {
  legalName: "Tilanga Ji Ka Mashahur Peda Dukan",
  shortName: "Tilanga Ji",
  address: "Sakaddi Bazaar, Ara–Patna Highway, Bhojpur, Bihar 802160",
  // GSTIN is printed on invoices when set. Leave "" to hide the line.
  gstin: "",
  email: "orders@tilangaji.example",
};

export const upi = {
  // TODO: replace with the shop's real UPI ID / VPA.
  vpa: "tilangaji@okhdfcbank",
  // TODO: replace with the name registered on that UPI ID.
  payeeName: "Tilanga Ji Peda Dukan",
  // Static merchant code — leave as-is unless the bank gave you one.
  merchantCode: "",
};

export const whatsapp = {
  // TODO: replace with the shop's WhatsApp business number (digits only,
  // country code included, no + or spaces).
  number: "919431055263",
};

export const phones = ["+91 94310 55263", "+91 95764 56473"];

// Retail shipping rule (per-order, in rupees).
export const retail = {
  freeShippingAbove: 599,
  flatShippingFee: 79,
};

// Bulk / wholesale order settings.
export const bulk = {
  // Minimum total weight (kg) for a bulk order.
  minKg: 3,
  // Advance payment collected up front, as a fraction of the quote total.
  advanceFraction: 0.25,
  // Home-delivery charge for bulk orders (flat, rupees). Waived above the
  // threshold below.
  deliveryFee: 150,
  freeDeliveryAbove: 8000,
  // Lead time shown to the customer.
  leadTimeDays: 2,
};
