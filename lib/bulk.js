// Bulk / wholesale order pricing. Quantities are in kilograms.

import { bulk } from "@/lib/config";
import { getBulkItems } from "@/lib/products";

/**
 * @param {Record<string, number>} kgBySlug  slug -> kg (may include 0s)
 * @returns {{
 *   lines: { slug, name, pricePerKg, kg, amount }[],
 *   totalKg: number, itemsTotal: number, deliveryFee: number,
 *   grandTotal: number, advance: number, balance: number,
 *   meetsMinimum: boolean
 * }}
 */
export function quoteBulkOrder(kgBySlug) {
  const items = getBulkItems();
  const lines = items
    .map((p) => {
      const kg = Math.max(0, Number(kgBySlug[p.slug]) || 0);
      return {
        slug: p.slug,
        name: p.name,
        pricePerKg: p.pricePerKg,
        kg,
        amount: Math.round(kg * p.pricePerKg),
      };
    })
    .filter((l) => l.kg > 0);

  const totalKg = round2(lines.reduce((s, l) => s + l.kg, 0));
  const itemsTotal = lines.reduce((s, l) => s + l.amount, 0);
  const deliveryFee =
    itemsTotal >= bulk.freeDeliveryAbove || itemsTotal === 0
      ? 0
      : bulk.deliveryFee;
  const grandTotal = itemsTotal + deliveryFee;
  const advance = Math.round(grandTotal * bulk.advanceFraction);
  const balance = grandTotal - advance;

  return {
    lines,
    totalKg,
    itemsTotal,
    deliveryFee,
    grandTotal,
    advance,
    balance,
    meetsMinimum: totalKg >= bulk.minKg,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// Earliest delivery date the customer can pick, as a yyyy-mm-dd string.
export function earliestBulkDate() {
  const d = new Date();
  d.setDate(d.getDate() + bulk.leadTimeDays);
  return d.toISOString().slice(0, 10);
}
