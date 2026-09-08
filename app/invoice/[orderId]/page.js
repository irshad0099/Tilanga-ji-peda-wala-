"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { findOrder } from "@/lib/orders";
import InvoicePreview from "@/components/InvoicePreview";

export default function InvoicePage({ params }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState(undefined); // undefined = loading

  useEffect(() => {
    setOrder(findOrder(orderId) || null);
  }, [orderId]);

  if (order === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-ink/50 sm:px-6">Loading invoice…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-teal">Invoice not found</h1>
        <p className="mt-3 text-[15px] text-ink/70">
          No order with ID <span className="font-mono">{orderId}</span> exists on this device.
          Invoices are only available on the device the order was placed from.
        </p>
        <Link href="/menu" className="mt-6 inline-block rounded-lg bg-teal px-6 py-3 text-[15px] font-semibold text-cream hover:bg-teal-dark">
          Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/track-order" className="hover:text-maroon">Track order</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Invoice {order.id}</span>
      </nav>
      <InvoicePreview order={order} />
    </div>
  );
}
