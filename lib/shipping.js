// Delivery rules. We deliver within Bihar only, by courier. Bihar shares the
// 80–85 PIN range with Jharkhand, so this checks the first three digits
// against Bihar's own sorting districts (Jharkhand's 814–816, 822 and
// 825–835 are left out).

const BIHAR_PREFIXES = [
  [800, 813],
  [821, 821],
  [823, 824],
  [841, 855],
];

export const DELIVERY_AREA = "Bihar";

export function isBiharPincode(pincode) {
  const code = String(pincode).trim();
  if (!/^\d{6}$/.test(code)) return false;
  const head = Number(code.slice(0, 3));
  return BIHAR_PREFIXES.some(([lo, hi]) => head >= lo && head <= hi);
}

/** Delivery window for a Bihar pincode, or null if we don't deliver there. */
export function estimateDelivery(pincode) {
  if (!isBiharPincode(pincode)) return null;
  if (String(pincode).trim().startsWith("802")) {
    return { zone: "Ara / Bhojpur (local)", days: "Same day to next day", minDays: 0, maxDays: 1 };
  }
  return { zone: "Rest of Bihar", days: "1-2 days", minDays: 1, maxDays: 2 };
}
