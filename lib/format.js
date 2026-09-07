export function formatRupees(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-IN")}`;
}
