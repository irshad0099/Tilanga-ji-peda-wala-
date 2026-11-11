// Server-side checkout rules. The browser only sends which products, which
// pack size and how many — every price, the delivery fee and the total are worked out here from
// the live menu and settings, so a tampered request can't change what's paid.

import { getAllProducts } from "@/lib/db/products.server";
import { getSettings } from "@/lib/db/settings.server";
import { findPack, packLabel } from "@/lib/packs";
import { isBiharPincode } from "@/lib/shipping";

export class CheckoutError extends Error {}

const MAX_LINES = 20;
const MAX_QTY = 50;

export async function priceCart(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutError("Your cart is empty.");
  }
  if (rawItems.length > MAX_LINES) throw new CheckoutError("Too many items in one order.");

  const [products, settings] = await Promise.all([getAllProducts(), getSettings()]);
  const items = rawItems.map(({ slug, boxes, qty }) => {
    const product = products.find((p) => p.slug === slug);
    if (!product || !product.deliverable) {
      throw new CheckoutError("One of the items in your cart can't be delivered. Please remove it and try again.");
    }
    if (product.inStock === false) {
      throw new CheckoutError(`${product.name} is sold out today. Please remove it and try again.`);
    }
    const n = Number(qty);
    if (!Number.isInteger(n) || n < 1 || n > MAX_QTY) throw new CheckoutError("Invalid quantity in cart.");
    const pack = findPack(product, boxes);
    if (!pack) throw new CheckoutError("That pack size isn't available any more. Please update your cart.");
    return {
      slug: product.slug,
      boxes: pack.boxes,
      name: product.name,
      price: pack.price,
      weight: pack.boxes === 1 ? product.weight : `${packLabel(pack.boxes)} × ${product.weight}`,
      image: product.image,
      qty: n,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { freeShippingAbove, flatShippingFee } = settings.retail;
  const deliveryFee = subtotal < freeShippingAbove ? flatShippingFee : 0;
  return { items, subtotal, deliveryFee, total: subtotal + deliveryFee };
}

export function validateCustomer(raw) {
  const c = {
    name: String(raw?.name || "").trim(),
    phone: String(raw?.phone || "").replace(/\D/g, ""),
    address: String(raw?.address || "").trim(),
    pincode: String(raw?.pincode || "").replace(/\D/g, ""),
  };
  const errors = {};
  if (!c.name || c.name.length > 80) errors.name = "Enter your name.";
  if (!/^[6-9]\d{9}$/.test(c.phone)) errors.phone = "Enter a valid 10-digit mobile number.";
  if (c.address.length < 10 || c.address.length > 300) errors.address = "Enter your full delivery address.";
  if (!/^[1-9]\d{5}$/.test(c.pincode)) errors.pincode = "Enter a valid 6-digit pincode.";
  else if (!isBiharPincode(c.pincode)) errors.pincode = "Sorry — we deliver within Bihar only for now.";
  return { customer: c, errors };
}
