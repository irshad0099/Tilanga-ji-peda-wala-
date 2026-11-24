// Pack sizes for a deliverable product (1 box, 2 boxes, 4 boxes…). Shared by
// the product page, the cart and the server-side pricing in
// lib/db/checkout.server.js, so the price shown is the price charged.
//
// A product can define its own packs (in lib/products.js, or on the product
// document in MongoDB — the admin dashboard does not edit packs yet):
//   packs: [{ boxes: 1, price: 480, mrp: 520, tag: "Try it" }, { boxes: 2, price: 940, ... }]
// Without that, every pack is simply N × the single-box price — no made-up
// discount. Set real pack prices to offer a multi-box saving.

const DEFAULT_SIZES = [
  { boxes: 1, tag: "Try it" },
  { boxes: 2, tag: "Family" },
  { boxes: 4, tag: "Gifting" },
];

export function packsFor(product) {
  if (Array.isArray(product?.packs) && product.packs.length) {
    return product.packs
      .filter((p) => Number.isInteger(p.boxes) && p.boxes > 0 && Number(p.price) > 0)
      .map((p) => ({
        boxes: p.boxes,
        price: Number(p.price),
        mrp: Number(p.mrp) || p.boxes * (product.mrp || product.price),
        tag: p.tag || "",
      }));
  }
  return DEFAULT_SIZES.map(({ boxes, tag }) => ({
    boxes,
    price: boxes * product.price,
    mrp: boxes * (product.mrp || product.price),
    tag,
  }));
}

export function findPack(product, boxes) {
  return packsFor(product).find((p) => p.boxes === Number(boxes || 1));
}

/** Weight of one box in kg, read from e.g. "1 kg Box" or "500g Box". */
function kgPerBox(weight) {
  const m = String(weight || "").match(/(\d+(?:\.\d+)?)\s*(kg|g)\b/i);
  if (!m) return null;
  return Number(m[1]) / (m[2].toLowerCase() === "g" ? 1000 : 1);
}

/** "2 kg" when the box weight is known (pass the product weight), else "2 Boxes". */
export function packLabel(boxes, weight) {
  const kg = kgPerBox(weight);
  if (kg) return `${Number((kg * boxes).toFixed(2))} kg`;
  return boxes === 1 ? "1 Box" : `${boxes} Boxes`;
}

/** Cart line key — the same product in two pack sizes is two lines. */
export function cartKey(slug, boxes = 1) {
  return `${slug}:${boxes}`;
}
