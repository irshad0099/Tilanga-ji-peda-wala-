// ---------------------------------------------------------------------------
// SHOP CONFIG — offline defaults for shop details, WhatsApp and shipping.
// The live values are stored in MongoDB and editable from /admin; these are
// only the fallback / seed defaults.
//
// Online payments go through Razorpay. Its keys are secrets, so they live in
// environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
// RAZORPAY_WEBHOOK_SECRET), not in this file. See .env.local.example.
// ---------------------------------------------------------------------------

export const shop = {
  legalName: "Tilanga Ji Ka Mashahur Peda Dukan",
  shortName: "Tilanga Ji",
  address: "Sakaddi Bazaar, Ara–Patna Highway, Bhojpur, Bihar 802160",
  // GSTIN is printed on invoices when set. Leave "" to hide the line.
  gstin: "",
  email: "orders@tilangaji.example",
  // Stable "cid" link to the real Google Maps listing — used for the
  // "Read reviews on Google" button. Safe to reuse forever even if the
  // listing's name/address ever changes.
  googleMapsUrl: "https://www.google.com/maps?cid=16251555030627548466",
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
