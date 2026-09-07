// Delivery estimate helper. Unlike a hyperlocal delivery gate, this shop
// ships pan-India by courier, so checkout never blocks on pincode — this
// just estimates a delivery window to set expectations.

export function estimateDelivery(pincode) {
  const code = String(pincode).trim();
  if (!/^\d{6}$/.test(code)) return null;

  if (code.startsWith("802")) {
    return { zone: "Ara / Bhojpur (local)", days: "Same day to next day" };
  }
  if (code.startsWith("8")) {
    return { zone: "Rest of Bihar", days: "1-2 days" };
  }
  return { zone: "Rest of India", days: "3-5 days" };
}
