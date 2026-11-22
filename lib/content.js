// ---------------------------------------------------------------------------
// BRAND CONTENT — everything the product page shows that the shop still has
// to supply lives here. Anything left as `null` / empty renders as a dashed
// "add this later" placeholder on the site, so it's obvious what's missing.
//
// To fill something in: put the file in /public/images/... and set the path,
// or type the text, then redeploy.
// ---------------------------------------------------------------------------

export const founder = {
  name: "Tilanga Ji",
  title: "Founder",
  // The founder seated in meditation, background removed (transparent PNG).
  photo: "/images/brand/founder-tilanga-ji.png",
  // A few lines in the founder's own words. null = placeholder.
  quote: null,
};

// FSSAI licence / registration number (14 digits, from the FSSAI licence —
// not the FoSTaC training certificate). null = no FSSAI badge or line shown.
export const fssaiLicence = null;

// Trust badges under the price. Only `verified` ones show (and the FSSAI
// badge only once fssaiLicence is set).
export const trustBadges = [
  { id: "since", label: "Since 1975", verified: true },
  { id: "hand", label: "Hand-made daily", verified: true },
  { id: "khoya", label: "Pure khoya", verified: true },
  { id: "packing", label: "Same-day packing", verified: true },
  { id: "fssai", label: "FSSAI licensed", verified: false },
];

// The shop's own product photos, keyed by product slug. The first one is the
// main image everywhere (cards, hero, cart) and wins over the image saved in
// the admin dashboard; the rest fill the product gallery. All are 4:5 portraits — the
// gallery shows them uncropped, captions and all.
export const productPhotos = {
  "classic-khoya-peda": [
    "/images/peda/tilangaji-khoya-peda-box.jpg",
    "/images/peda/sakaddi-ka-mashahur.jpg",
    "/images/peda/khoya-desi-ghee.jpg",
    "/images/peda/handcrafted-fresh.jpg",
    "/images/peda/peda-highlights.jpg",
    "/images/peda/festive-gifting-tray.jpg",
  ],
};

// Tabs under the product. `null` = the tab is left out until it's written.
export const productDetails = {
  "classic-khoya-peda": {
    // Wins over the description saved in the admin dashboard (which still says pan-India).
    about:
      "Our founding recipe — pure khoya, slow-cooked and hand-rolled the same way it was made when the shop started as a roadside stall in Sakaddi. No shortcuts, no additives. Packed fresh at the shop and delivered anywhere in Bihar.",
    making:
      "Fresh full-cream milk arrives every morning — no milk powder. It's reduced slowly in wide kadhais over a gentle flame, stirred by hand the whole way, until it turns to khoya.\n\nEach peda is then rolled and pressed by hand — no machines, so no two are exactly alike — and boxed the same day it's made.",
    ingredients: null, // exact ingredient list from the box label
    serve:
      "Best at room temperature — if the box has been in the fridge, take it out a little before serving.\n\nEnjoy it with a cup of chai, offer it as prasad at puja, or put it out for guests. A box of Sakaddi ke pede is a gift every Bihari family understands.",
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
    pieces: null, // e.g. "18–20"; null = not shown
    facts: [
      { icon: "khoya", title: "Sirf khoya", text: "Pure khoya, slow-cooked in kadhai" },
      { icon: "ghee", title: "Desi ghee", text: "Pure desi ghee — no vanaspati" },
      { icon: "box", title: "Usi din packing", text: "Boxed the same day it's made" },
      { icon: "clock", title: "4–5 din taaza", text: "Best within 4–5 days of dispatch" },
    ],
  },
};

