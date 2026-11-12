// ---------------------------------------------------------------------------
// BRAND CONTENT — everything the product page shows that the shop still has
// to supply lives here. Anything left as `null` / empty renders as a dashed
// "add this later" placeholder on the site, so it's obvious what's missing.
//
// To fill something in: put the file in /public/images/... and set the path,
// or type the text, then redeploy.
// ---------------------------------------------------------------------------

export const founder = {
  // As printed on the shop's badge: "Sakaddi Peda Wala — प्रो. श्याम जी".
  name: "Shyam Ji",
  title: "Founder",
  // Founder sticker (Telangaji badge with Shyam Ji) with its background
  // removed (transparent PNG), shown over yellow brush strokes.
  photo: "/images/brand/founder.png",
  // A few lines in the founder's own words. null = placeholder.
  quote: null,
};

// FSSAI licence number printed on the box. null = placeholder.
export const fssaiLicence = null;

// Trust badges under the price. `verified: false` badges show as
// placeholders until the shop confirms them (e.g. once lab reports exist).
export const trustBadges = [
  { id: "since", label: "Since 1975", verified: true },
  { id: "hand", label: "Hand-made daily", verified: true },
  { id: "khoya", label: "Pure khoya", verified: true },
  { id: "fssai", label: "FSSAI licensed", verified: false },
];

// The shop's own product photos, keyed by product slug. The first one is the
// main image everywhere (cards, hero, cart) and wins over the image saved in
// /admin; the rest fill the product gallery. The gallery crops square, so
// keep text-free shots here — the captioned ones live on /gallery.
export const productPhotos = {
  "classic-khoya-peda": [
    "/images/peda/peda-brass-bowl.jpg",
    "/images/peda/peda-box-open.jpg",
    "/images/peda/peda-box-diya.jpg",
    "/images/peda/brass-tray-dark.jpg",
    "/images/peda/hand-placing-peda.jpg",
  ],
};

// Tabs under the product. `null` = placeholder text box.
export const productDetails = {
  "classic-khoya-peda": {
    // Wins over the description saved in /admin (which still says pan-India).
    about:
      "Our founding recipe — pure khoya, slow-cooked and hand-rolled the same way it was made when the shop started as a roadside stall in Sakaddi. No shortcuts, no additives. Packed fresh at the shop and delivered anywhere in Bihar.",
    making: null, // how it's made, in the shop's words
    ingredients: null, // exact ingredient list from the box label
    serve: null, // serving suggestions
    storage:
      "Best within 4–5 days of dispatch. Keep in a cool, dry place; refrigerate in humid weather and bring to room temperature before eating.",
  },
};

// Certifications shown near the footer of the product page.
// Each: { name, logo: "/images/certs/x.png" }. Empty = placeholders.
export const certifications = [];

// Customer reviews shown in the home-page carousel and on product pages.
// These three came with the original site — swap in real Google reviews
// (name, what they wrote, and `rating: 1–5` for stars) when you have them.
export const reviews = [
  {
    name: "Rakesh V., Ara",
    text: "We stop here every time we drive the Ara–Patna highway. The peda is warm and fresh almost every single time.",
  },
  {
    name: "Sunita M., Patna",
    text: "Ordered the assorted box online for a family function — arrived well packed and every piece was soft, not squashed.",
  },
  {
    name: "Deepak R., Bhojpur",
    text: "This is the peda I grew up eating. Fifty years and it still tastes the way my father describes it from his childhood.",
  },
];

// "Box ke andar kya hai" on the home page and product pages. `pieces` is the
// usual number of pedas in one 500g box — null shows a placeholder until the
// shop counts a box. The rest is what the shop already says elsewhere.
export const boxContents = {
  "classic-khoya-peda": {
    pieces: null, // e.g. "18–20"
    facts: [
      { icon: "khoya", title: "Sirf khoya", text: "Pure khoya, slow-cooked in kadhai" },
      { icon: "ghee", title: "Desi ghee", text: "Pure desi ghee — no vanaspati" },
      { icon: "box", title: "Usi din packing", text: "Boxed the same day it's made" },
      { icon: "clock", title: "4–5 din taaza", text: "Best within 4–5 days of dispatch" },
    ],
  },
};

// Festival strip at the very top of the site. Shows while today's date (IST)
// is between `from` and `to`, inclusive. Festival dates move every year —
// check them against the panchang and add next year's before they come up.
export const festivals = [
  { name: "Chhath Puja", from: "2026-11-10", to: "2026-11-16", text: "prasad ke liye taaza pede, Bihar bhar mein delivery" },
  { name: "Holi", from: "2027-03-14", to: "2027-03-22", text: "rang ke saath pede ki mithaas, poore Bihar mein delivery" },
  { name: "Diwali", from: "2027-10-20", to: "2027-10-30", text: "apno ko bhejein Sakaddi ke mashahur pede" },
  { name: "Chhath Puja", from: "2027-10-31", to: "2027-11-05", text: "prasad ke liye taaza pede, Bihar bhar mein delivery" },
];
