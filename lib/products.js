// Product catalog for Tilanga Ji Ka Mashahur Peda Dukan.
// Prices and weights here are placeholders — edit freely, there is no
// database involved, so changes here reflect across the whole site.

export const products = [
  {
    slug: "classic-khoya-peda",
    name: "Classic Khoya Peda",
    hindiName: "शुद्ध खोया पेड़ा",
    tagline: "The original, since 1975",
    description:
      "Our founding recipe — pure khoya, slow-cooked and hand-rolled the same way it was made when the shop started as a roadside stall in Sakaddi. No shortcuts, no additives.",
    price: 349,
    mrp: 399,
    weight: "500g Box",
    category: "Peda",
    badge: "Bestseller",
    featured: true,
    image: "/images/products/classic-khoya-peda.svg",
  },
  {
    slug: "kesar-peda",
    name: "Kesar Peda",
    hindiName: "केसर पेड़ा",
    tagline: "Saffron-laced and golden",
    description:
      "Real saffron strands folded into our classic khoya peda for a warmer colour and a floral finish. A favourite for gifting during festivals.",
    price: 399,
    mrp: 449,
    weight: "500g Box",
    category: "Peda",
    badge: "",
    featured: false,
    image: "/images/products/kesar-peda.svg",
  },
  {
    slug: "dry-fruit-peda",
    name: "Dry Fruit Peda",
    hindiName: "ड्राई फ्रूट पेड़ा",
    tagline: "Loaded with almonds and pistachio",
    description:
      "Chopped almonds, pistachio and cashew folded through soft khoya peda for extra crunch. A richer, heavier bite than the classic.",
    price: 449,
    mrp: 499,
    weight: "500g Box",
    category: "Peda",
    badge: "",
    featured: false,
    image: "/images/products/dry-fruit-peda.svg",
  },
  {
    slug: "chocolate-peda",
    name: "Chocolate Peda",
    hindiName: "चॉकलेट पेड़ा",
    tagline: "A modern twist on the classic",
    description:
      "Cocoa worked into our khoya base for a peda that sits somewhere between traditional mithai and chocolate fudge. Popular with the younger crowd.",
    price: 379,
    mrp: 419,
    weight: "500g Box",
    category: "Peda",
    badge: "New",
    featured: false,
    image: "/images/products/chocolate-peda.svg",
  },
  {
    slug: "mawa-barfi",
    name: "Mawa Barfi",
    hindiName: "मावा बर्फी",
    tagline: "Set firm, cut clean",
    description:
      "Dense, milk-forward barfi set in trays and cut into neat squares. Slightly firmer than peda, with a clean milky sweetness.",
    price: 369,
    mrp: 409,
    weight: "500g Box",
    category: "Barfi",
    badge: "",
    featured: false,
    image: "/images/products/mawa-barfi.svg",
  },
  {
    slug: "rasgulla",
    name: "Rasgulla",
    hindiName: "रसगुल्ला",
    tagline: "Soft, spongy, syrup-soaked",
    description:
      "Fresh chhena rasgulla, soaked in light sugar syrup until soft all the way through. Packed in leak-proof containers for travel.",
    price: 249,
    mrp: 279,
    weight: "1kg (12-14 pcs)",
    category: "Other Sweets",
    badge: "",
    featured: false,
    image: "/images/products/rasgulla.svg",
  },
  {
    slug: "special-assorted-box",
    name: "Special Assorted Box",
    hindiName: "स्पेशल असॉर्टेड बॉक्स",
    tagline: "A little bit of everything",
    description:
      "Our gifting favourite — classic peda, kesar peda, dry fruit peda and barfi in one box. The one people order when they're not sure what to pick.",
    price: 599,
    mrp: 679,
    weight: "1kg Mixed Box",
    category: "Gift Boxes",
    badge: "Popular for gifting",
    featured: false,
    image: "/images/products/special-assorted-box.svg",
  },
  {
    slug: "family-pack",
    name: "Family Pack Peda",
    hindiName: "फैमिली पैक पेड़ा",
    tagline: "For the whole house",
    description:
      "A full kilo of our classic khoya peda, sealed fresh for travel. The pack most families order for get-togethers and long weekends home.",
    price: 649,
    mrp: 729,
    weight: "1kg Box",
    category: "Gift Boxes",
    badge: "",
    featured: false,
    image: "/images/products/family-pack.svg",
  },
];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProduct() {
  return products.find((p) => p.featured) || products[0];
}

export function getCategories() {
  return Array.from(new Set(products.map((p) => p.category)));
}
