// Turns a stored order (retail or bulk) into a normalised invoice model,
// and renders that model to a downloadable PDF with jsPDF.

import { shop, upi } from "@/lib/config";
import { formatRupees } from "@/lib/format";
import { paymentStatusLabels } from "@/lib/orders";

/**
 * Normalise a retail or bulk order into one invoice shape.
 */
export function toInvoice(order) {
  const isBulk = order.type === "bulk";

  const lines = isBulk
    ? order.lines.map((l) => ({
        description: `${l.name} (loose, per kg)`,
        qty: l.kg,
        unit: "kg",
        rate: l.pricePerKg,
        amount: l.amount,
      }))
    : order.items.map((i) => ({
        description: `${i.name} — ${i.weight}`,
        qty: i.qty,
        unit: "box",
        rate: i.price,
        amount: i.price * i.qty,
      }));

  const subtotal = isBulk ? order.itemsTotal : order.subtotal;
  const deliveryFee = order.deliveryFee || 0;
  const total = isBulk ? order.grandTotal : order.total;

  const amountPaid = isBulk
    ? order.advance || 0
    : order.paymentStatus === "pending_verification" || order.paymentStatus === "paid"
      ? total
      : 0;
  const balanceDue = total - amountPaid;

  return {
    number: order.id,
    date: order.date,
    type: isBulk ? "Bulk Order — Proforma Invoice" : "Tax Invoice",
    customer: order.customer,
    deliveryDate: order.deliveryDate || null,
    notes: order.notes || "",
    lines,
    subtotal,
    deliveryFee,
    total,
    amountPaid,
    balanceDue,
    paymentMethod: order.payment === "cod" ? "Cash on Delivery" : "UPI",
    paymentStatus: paymentStatusLabels[order.paymentStatus] || order.paymentStatus || "",
    paymentRef: order.txnRef || "",
  };
}

/**
 * Build and download a PDF for the given invoice model.
 * Dynamically imports jsPDF so it never ships in the initial bundle.
 */
export async function downloadInvoicePdf(invoice) {
  const jspdfMod = await import("jspdf");
  const jsPDF = jspdfMod.jsPDF || jspdfMod.default;
  const autoTableMod = await import("jspdf-autotable");
  const autoTable = autoTableMod.default || autoTableMod.autoTable;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const M = 48;
  const wine = [110, 30, 43];
  const ink = [58, 42, 28];
  const muted = [120, 105, 92];

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...wine);
  doc.text(shop.shortName, M, M);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(shop.legalName, M, M + 16);
  doc.text(doc.splitTextToSize(shop.address, 240), M, M + 30);
  if (shop.gstin) doc.text(`GSTIN: ${shop.gstin}`, M, M + 56);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...ink);
  doc.text(invoice.type, pageW - M, M, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Invoice No:  ${invoice.number}`, pageW - M, M + 18, { align: "right" });
  doc.text(
    `Date:  ${new Date(invoice.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`,
    pageW - M,
    M + 32,
    { align: "right" }
  );
  if (invoice.deliveryDate) {
    doc.text(
      `Delivery:  ${new Date(invoice.deliveryDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`,
      pageW - M,
      M + 46,
      { align: "right" }
    );
  }

  // Bill to
  const c = invoice.customer || {};
  let y = M + 82;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text("Bill To", M, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  y += 15;
  const billLines = [
    c.name,
    c.phone,
    c.email,
    [c.address, c.city].filter(Boolean).join(", "),
    c.pincode ? `PIN ${c.pincode}` : "",
  ].filter(Boolean);
  billLines.forEach((line) => {
    doc.text(String(line), M, y);
    y += 13;
  });

  // Line items
  autoTable(doc, {
    startY: y + 12,
    head: [["#", "Description", "Qty", "Rate", "Amount"]],
    body: invoice.lines.map((l, i) => [
      i + 1,
      l.description,
      `${l.qty} ${l.unit}`,
      formatRupees(l.rate),
      formatRupees(l.amount),
    ]),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 6, textColor: ink },
    headStyles: { fillColor: wine, textColor: [255, 255, 255], halign: "left" },
    columnStyles: {
      0: { cellWidth: 28 },
      2: { halign: "right", cellWidth: 60 },
      3: { halign: "right", cellWidth: 80 },
      4: { halign: "right", cellWidth: 80 },
    },
    margin: { left: M, right: M },
  });

  // Totals
  let ty = doc.lastAutoTable.finalY + 18;
  const rightX = pageW - M;
  const labelX = pageW - M - 150;
  const row = (label, value, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...(bold ? ink : muted));
    doc.text(label, labelX, ty);
    doc.text(value, rightX, ty, { align: "right" });
    ty += bold ? 18 : 15;
  };
  row("Subtotal", formatRupees(invoice.subtotal));
  if (invoice.deliveryFee > 0) row("Delivery", formatRupees(invoice.deliveryFee));
  row("Total", formatRupees(invoice.total), true);
  if (invoice.amountPaid > 0) {
    row("Paid", `- ${formatRupees(invoice.amountPaid)}`);
    row("Balance due", formatRupees(invoice.balanceDue), true);
  }

  // Payment box
  ty += 16;
  doc.setDrawColor(220, 210, 195);
  doc.setFillColor(250, 245, 235);
  doc.roundedRect(M, ty, pageW - 2 * M, 58, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...ink);
  doc.text("Payment", M + 12, ty + 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.text(
    `Method: ${invoice.paymentMethod}   |   Status: ${invoice.paymentStatus}`,
    M + 12,
    ty + 33
  );
  const payExtra = [
    invoice.paymentRef ? `Ref: ${invoice.paymentRef}` : "",
    `UPI: ${upi.vpa}`,
  ]
    .filter(Boolean)
    .join("   |   ");
  doc.text(payExtra, M + 12, ty + 47);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(
    "This is a computer-generated document. Thank you for ordering from Tilanga Ji.",
    pageW / 2,
    doc.internal.pageSize.getHeight() - 30,
    { align: "center" }
  );

  doc.save(`${invoice.number}.pdf`);
}
