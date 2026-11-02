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
  title: "Founder, since 1975",
  // Portrait or illustration of the founder / current owner,
  // e.g. "/images/brand/founder.png". null = placeholder.
  photo: null,
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

// Newspaper / TV / YouTube coverage. Each: { name, logo: "/images/media/x.png", url }.
// Empty = three placeholder boards.
export const mediaCoverage = [];

// Short vertical videos (reels) for the "Spotlight" row.
// Each: { title, poster: "/images/reels/x.jpg", url: "https://youtube.com/shorts/..." }.
// Empty = three placeholder slots.
export const reels = [];

// Extra product photos for the gallery, keyed by product slug. The main
// product image always comes first; empty slots show as placeholders so the
// gallery keeps its shape. e.g. "classic-khoya-peda": ["/images/photos/peda-box.jpg"]
export const productGallery = {};

// Tabs under the product. `null` = placeholder text box.
export const productDetails = {
  "classic-khoya-peda": {
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
