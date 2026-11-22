import Link from "next/link";
import { listOrders } from "@/lib/data";
import { isDbConfigured } from "@/lib/mongodb";
import { STATUSES, PAYMENT_LABELS } from "@/lib/orders";
import { formatRupees, formatDateTime } from "@/lib/format";
import { PageHeader, PaymentBadge, Empty, DbMissing } from "@/components/ui";
import StatusSelect from "@/components/StatusSelect";
import Icon from "@/components/Icon";

export const metadata = { title: "Orders" };

const KEYS = ["q", "status", "payment", "from", "to"];

function qs(filters, extra = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...filters, ...extra })) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function OrdersPage({ searchParams }) {
  if (!isDbConfigured()) return <DbMissing />;
  const sp = await searchParams;
  const filters = Object.fromEntries(KEYS.map((k) => [k, typeof sp[k] === "string" ? sp[k] : ""]));
  const { orders, total, page, pages, revenue } = await listOrders({ ...filters, page: sp.page });
  const filtered = KEYS.some((k) => filters[k]);

  return (
    <>
      <PageHeader title="Orders" subtitle={`${total} order${total === 1 ? "" : "s"}${filtered ? " match" : " in all"} · ${formatRupees(revenue)} in sales`}>
        <a href={`/orders/export${qs(filters)}`} className="btn border border-ink/15 bg-white text-ink hover:bg-cream">
          <Icon name="download" size={16} />
          Export CSV
        </a>
      </PageHeader>

      {/* Quick status tabs */}
      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1">
        {["", "Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map((s) => (
          <Link
            key={s || "all"}
            href={`/orders${qs({ ...filters, status: s })}`}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition ${filters.status === s ? "bg-leaf-dark text-cream" : "bg-white text-ink/70 ring-1 ring-ink/10 hover:bg-cream"}`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <form className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Search</span>
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input name="q" defaultValue={filters.q} placeholder="Order ID, name, phone or pincode" className="field pl-9" />
        </label>
        <select name="status" defaultValue={filters.status} className="field" aria-label="Status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select name="payment" defaultValue={filters.payment} className="field" aria-label="Payment">
          <option value="">All payments</option>
          {Object.entries(PAYMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input type="date" name="from" defaultValue={filters.from} className="field" aria-label="From date" />
        <input type="date" name="to" defaultValue={filters.to} className="field" aria-label="To date" />
        <div className="flex gap-2">
          <button className="btn bg-leaf-dark text-cream hover:bg-leaf">Filter</button>
          {filtered && <Link href="/orders" className="btn text-ink/60 hover:bg-cream">Clear</Link>}
        </div>
      </form>

      {orders.length === 0 ? (
        <Empty title={filtered ? "No orders match" : "No orders yet"}>{filtered ? "Try a different search or clear the filters." : "Orders will appear here as customers check out."}</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-ink/5 text-left text-xs font-bold uppercase tracking-wider text-ink/50">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {orders.map((o) => (
                <tr key={o._id} className="transition hover:bg-cream/70">
                  <td className="px-4 py-3">
                    <Link href={`/orders/${o._id}`} className="font-mono font-bold text-leaf-dark hover:underline">{o._id}</Link>
                    <p className="text-xs text-ink/50">{formatDateTime(o.date)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{o.customer?.name || "—"}</p>
                    <p className="text-xs text-ink/50">{o.customer?.phone} · {o.customer?.pincode}</p>
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-ink/70">
                    {(o.items || []).map((i) => `${i.qty} × ${i.weight || i.name}`).join(", ")}
                  </td>
                  <td className="px-4 py-3"><PaymentBadge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3 text-right font-black">{formatRupees(o.total)}</td>
                  <td className="px-4 py-3"><StatusSelect id={o._id} status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3 text-sm font-bold">
          {page > 1 && <Link href={`/orders${qs(filters, { page: page - 1 })}`} className="btn bg-white ring-1 ring-ink/10 hover:bg-cream">← Newer</Link>}
          <span className="text-ink/60">Page {page} of {pages}</span>
          {page < pages && <Link href={`/orders${qs(filters, { page: page + 1 })}`} className="btn bg-white ring-1 ring-ink/10 hover:bg-cream">Older →</Link>}
        </div>
      )}
    </>
  );
}
