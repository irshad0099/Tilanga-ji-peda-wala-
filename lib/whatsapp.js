// Build a wa.me link that opens WhatsApp with the order details pre-typed,
// so the shop actually receives the order even without a backend.

import { whatsapp } from "@/lib/config";
import { formatRupees } from "@/lib/format";

export function retailOrderWhatsappLink(order) {
  const c = order.customer || {};
  const lines = [
    `*New order ${order.id}* — Tilanga Ji`,
    "",
    ...order.items.map((i) => `• ${i.name} × ${i.qty} = ${formatRupees(i.price * i.qty)}`),
    "",
    `Subtotal: ${formatRupees(order.subtotal)}`,
    order.deliveryFee ? `Delivery: ${formatRupees(order.deliveryFee)}` : `Delivery: Free`,
    `*Total: ${formatRupees(order.total)}*`,
    "",
    `Payment: ${order.payment === "cod" ? "Cash on delivery" : "UPI"}`,
    order.txnRef ? `UPI ref: ${order.txnRef}` : "",
    "",
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    `Address: ${c.address}, ${c.pincode}`,
  ].filter((l) => l !== "");
  return waLink(lines.join("\n"));
}

export function bulkOrderWhatsappLink(order) {
  const c = order.customer || {};
  const lines = [
    `*New BULK order ${order.id}* — Tilanga Ji`,
    "",
    ...order.lines.map((l) => `• ${l.name}: ${l.kg} kg × ${formatRupees(l.pricePerKg)} = ${formatRupees(l.amount)}`),
    "",
    `Total weight: ${order.totalKg} kg`,
    `Items: ${formatRupees(order.itemsTotal)}`,
    order.deliveryFee ? `Delivery: ${formatRupees(order.deliveryFee)}` : `Delivery: Free`,
    `*Grand total: ${formatRupees(order.grandTotal)}*`,
    `Advance paid: ${formatRupees(order.advance)}`,
    `Balance on delivery: ${formatRupees(order.balance)}`,
    order.txnRef ? `Advance UPI ref: ${order.txnRef}` : "",
    "",
    `Deliver on: ${order.deliveryDate}`,
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    c.email ? `Email: ${c.email}` : "",
    `Address: ${c.address}, ${c.city} ${c.pincode}`,
    order.notes ? `Notes: ${order.notes}` : "",
  ].filter((l) => l !== "");
  return waLink(lines.join("\n"));
}

function waLink(text) {
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`;
}
