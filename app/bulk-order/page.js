import BulkOrderForm from "@/components/BulkOrderForm";
import SectionDivider from "@/components/SectionDivider";
import { getAllProducts } from "@/lib/db/products.server";
import { getSettings } from "@/lib/db/settings.server";

export const metadata = {
  title: "Bulk & Wholesale Orders - Tilanga Ji Ka Mashahur Peda Dukan",
  description:
    "Order Classic Khoya Peda by the kilo for weddings, festivals, offices and resale. Home delivery across Bihar, pay a small advance online.",
};

export default async function BulkOrderPage() {
  const [products, settings] = await Promise.all([getAllProducts(), getSettings()]);
  const items = products.filter(
    (p) => p.deliverable && p.inStock !== false && typeof p.pricePerKg === "number"
  );
  const { bulk } = settings;

  const points = [
    {
      title: "Order by the kilo",
      body: `Classic Khoya Peda, wholesale per-kg rate, minimum ${bulk.minKg} kg — not box prices.`,
    },
    {
      title: "Home / venue delivery",
      body: `Delivered to your address or event venue. Free above ${new Intl.NumberFormat("en-IN").format(
        bulk.freeDeliveryAbove
      )} rupees.`,
    },
    {
      title: `${Math.round(bulk.advanceFraction * 100)}% advance, rest on delivery`,
      body: "Pay a small advance by UPI to lock the order. Balance is collected in cash or UPI when it arrives.",
    },
    {
      title: `${bulk.leadTimeDays}-day lead time`,
      body: "Everything is made fresh for your date — please order at least two days ahead.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-maroon">Bulk &amp; Wholesale</p>
        <h1 className="mt-1 font-display text-4xl text-teal">Order Peda By The Kilo</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink/75">
          For weddings, tilak, festivals, office hampers and shop resale. Tell us the weights and
          the date, pay a small advance, and we deliver it fresh to your door.
        </p>
        <SectionDivider />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p) => (
          <div key={p.title} className="rounded-xl border border-gold/30 bg-cream-dark/30 p-5">
            <h2 className="font-display text-base text-teal">{p.title}</h2>
            <p className="mt-1.5 text-sm text-ink/70">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        {items.length === 0 ? (
          <p className="text-center text-ink/60">
            Nothing is available for bulk order right now — check back soon.
          </p>
        ) : (
          <BulkOrderForm items={items} />
        )}
      </div>
    </div>
  );
}
