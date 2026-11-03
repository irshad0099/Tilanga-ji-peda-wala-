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

// The big "Latest media" feature on the home page: a YouTube video plus a
// couple of lines about it. null = placeholder.
// e.g. { title: "Featured on …", text: "…", youtubeId: "abc123" }
export const mediaFeature = null;

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
