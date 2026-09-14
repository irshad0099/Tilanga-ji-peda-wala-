// Bulk / wholesale order pricing. Quantities are in kilograms.

import { bulk as defaultBulk } from "@/lib/config";

/**
 * @param {Record<string, number>} kgBySlug  slug -> kg (may include 0s)
 * @param {{slug,name,pricePerKg}[]} items    bulk-eligible products (live, from DB)
 * @param {object} [bulkConfig]                live bulk settings (defaults to lib/config)
 * @returns {{
 *   lines: { slug, name, pricePerKg, kg, amount }[],
 *   totalKg: number, itemsTotal: number, deliveryFee: number,
 *   grandTotal: number, advance: number, balance: number,
 *   meetsMinimum: boolean
 * }}
 */
export function quoteBulkOrder(kgBySlug, items = [], bulkConfig = defaultBulk) {
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
    itemsTotal >= bulkConfig.freeDeliveryAbove || itemsTotal === 0 ? 0 : bulkConfig.deliveryFee;
  const grandTotal = itemsTotal + deliveryFee;
  const advance = Math.round(grandTotal * bulkConfig.advanceFraction);
  const balance = grandTotal - advance;

  return {
    lines,
    totalKg,
    itemsTotal,
    deliveryFee,
    grandTotal,
    advance,
    balance,
    meetsMinimum: totalKg >= bulkConfig.minKg,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// Earliest delivery date the customer can pick, as a yyyy-mm-dd string.
export function earliestBulkDate(bulkConfig = defaultBulk) {
  const d = new Date();
  d.setDate(d.getDate() + bulkConfig.leadTimeDays);
  return d.toISOString().slice(0, 10);
}
