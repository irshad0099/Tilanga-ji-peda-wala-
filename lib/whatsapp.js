// Build a wa.me link that opens WhatsApp with the order details pre-typed,
// so the shop actually receives the order even without a backend.

import { whatsapp as defaultWhatsapp } from "@/lib/config";
import { formatRupees } from "@/lib/format";

export function retailOrderWhatsappLink(order, whatsappConfig = defaultWhatsapp) {
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
    `Payment: ${order.payment === "cod" ? "Cash on delivery" : "Paid online (Razorpay)"}`,
    order.razorpayPaymentId ? `Payment ID: ${order.razorpayPaymentId}` : "",
    "",
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    `Address: ${c.address}, ${c.pincode}`,
  ].filter((l) => l !== "");
  return waLink(lines.join("\n"), whatsappConfig);
}

function waLink(text, whatsappConfig = defaultWhatsapp) {
  return `https://wa.me/${whatsappConfig.number}?text=${encodeURIComponent(text)}`;
}
