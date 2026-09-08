// Menu for Tilanga Ji Ka Mashahur Peda Dukan.
//
// deliverable: true  -> can be added to cart, checked out and shipped.
//              false -> shown on the menu but "at the shop only" (dine-in,
//                       no delivery). No Add-to-cart button.
// Only peda / peda gift boxes are deliverable. Litti-chokha, fresh
// sweets and chai are served at the shop.
//
// pricePerKg: set only on loose peda that can also be bulk-ordered.
// image: files in /public/images/photos/ — swap keeping the same name.

export const products = [
  // ------------------------------------------------------------------ Peda
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
    pricePerKg: 560,
    category: "Peda",
    badge: "Bestseller",
    featured: true,
    deliverable: true,
    image: "/images/photos/peda-platter.jpg",
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
    pricePerKg: 640,
    category: "Peda",
    badge: "",
    featured: false,
    deliverable: true,
    image: "/images/photos/kesar-golden.jpg",
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
    pricePerKg: 720,
    category: "Peda",
    badge: "",
    featured: false,
    deliverable: true,
    image: "/images/photos/besan-laddu.jpg",
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
    pricePerKg: 610,
    category: "Peda",
    badge: "New",
    featured: false,
    deliverable: true,
    image: "/images/photos/til-box.jpg",
  },
  {
    slug: "gur-peda",
    name: "Gur Peda",
    hindiName: "गुड़ पेड़ा",
    tagline: "Slow-roasted, jaggery-deep",
    description:
      "Khoya roasted much longer over a low flame until it darkens and turns grainy, sweetened with gur instead of sugar. The Banaras–Bihar style lal peda — deeper, almost caramel.",
    price: 329,
    mrp: 369,
    weight: "500g Box",
    pricePerKg: 520,
    category: "Peda",
    badge: "",
    featured: false,
    deliverable: true,
    image: "/images/photos/gur-peda.jpg",
  },
  // ------------------------------------------------------------- Gift boxes
  {
    slug: "special-assorted-box",
    name: "Special Assorted Box",
    hindiName: "स्पेशल असॉर्टेड बॉक्स",
    tagline: "A little bit of everything",
    description:
      "Our gifting favourite — classic peda, kesar peda, dry fruit peda and gur peda in one box. The one people order when they're not sure what to pick.",
    price: 599,
    mrp: 679,
    weight: "1kg Mixed Box",
    category: "Gift Boxes",
    badge: "Popular for gifting",
    featured: false,
    deliverable: true,
    image: "/images/photos/shop-display.jpg",
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
    deliverable: true,
    image: "/images/photos/festive-thali.jpg",
  },
  // ------------------------------------------------- At the shop only (no delivery)
  {
    slug: "mawa-barfi",
    name: "Mawa Barfi",
    hindiName: "मावा बर्फी",
    tagline: "Set firm, cut clean",
    description:
      "Dense, milk-forward barfi set in trays and cut into neat squares. Made fresh through the day and best eaten the same day — so it's served at the counter, not shipped.",
    price: 40,
    mrp: 0,
    weight: "Per piece",
    category: "Sweets",
    badge: "",
    featured: false,
    deliverable: false,
    image: "/images/photos/barfi.jpg",
  },
  {
    slug: "milk-cake",
    name: "Milk Cake",
    hindiName: "मिल्क केक",
    tagline: "Grainy, caramelised, melt-in-mouth",
    description:
      "Khoya cooked low and slow until it caramelises and sets with a soft grainy crumb, then cut into thick cubes. Made in small trays every morning — eaten fresh at the shop.",
    price: 120,
    mrp: 0,
    weight: "Plate · 6 pcs",
    category: "Sweets",
    badge: "",
    featured: false,
    deliverable: false,
    image: "/images/photos/milk-cake.jpg",
  },
  {
    slug: "rasgulla",
    name: "Rasgulla",
    hindiName: "रसगुल्ला",
    tagline: "Soft, spongy, syrup-soaked",
    description:
      "Fresh chhena rasgulla, soaked in light sugar syrup until soft all the way through. Served in a bowl at the shop — the syrup doesn't travel well, so no delivery.",
    price: 20,
    mrp: 0,
    weight: "Per piece",
    category: "Sweets",
    badge: "",
    featured: false,
    deliverable: false,
    image: "/images/photos/rasgulla.jpg",
  },
  {
    slug: "litti-chokha",
    name: "Litti Chokha",
    hindiName: "लिट्टी चोखा",
    tagline: "Ghee-soaked litti with chokha & ghugni",
    description:
      "Whole-wheat balls stuffed with spiced sattu, roasted over coal and dunked in ghee, served with baingan–aloo chokha and a bowl of chana ghugni. The plate people stop on the highway for.",
    price: 80,
    mrp: 0,
    weight: "Plate · 2 pcs",
    category: "Dhaba Kitchen",
    badge: "Shop favourite",
    featured: false,
    deliverable: false,
    image: "/images/photos/litti-chokha.jpg",
  },
  {
    slug: "kulhad-chai",
    name: "Kulhad Chai",
    hindiName: "कुल्हड़ चाय",
    tagline: "Slow-boiled milk chai in clay cups",
    description:
      "Full-cream milk boiled down thick with tea and fresh ginger, poured into kulhads. The reason the tea stall came first and the peda came later.",
    price: 20,
    mrp: 0,
    weight: "Per cup",
    category: "Beverages",
    badge: "",
    featured: false,
    deliverable: false,
    image: "/images/photos/kulhad-chai.jpg",
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

// Items that ship — used by cart, checkout and the menu's delivery filter.
export function getDeliverableProducts() {
  return products.filter((p) => p.deliverable);
}

// Loose peda that can be ordered by the kilo (Bulk Order page).
export function getBulkItems() {
  return products.filter((p) => p.deliverable && typeof p.pricePerKg === "number");
}
