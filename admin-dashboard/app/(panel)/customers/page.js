import Link from "next/link";
import { listCustomers } from "@/lib/data";
import { isDbConfigured } from "@/lib/mongodb";
import { formatRupees, formatDateTime } from "@/lib/format";
import { PageHeader, Empty, DbMissing } from "@/components/ui";
import Icon from "@/components/Icon";

export const metadata = { title: "Customers" };

// Everyone who has ordered, grouped by phone number.
export default async function CustomersPage({ searchParams }) {
  if (!isDbConfigured()) return <DbMissing />;
  const { q = "" } = await searchParams;
  const customers = await listCustomers({ q });
  const repeat = customers.filter((c) => c.orders > 1).length;

  return (
    <>
      <PageHeader title="Customers" subtitle={`${customers.length} customer${customers.length === 1 ? "" : "s"} · ${repeat} ordered more than once`} />

      <form className="card mb-5 flex gap-2 p-4">
        <label className="relative flex-1">
          <span className="sr-only">Search customers</span>
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input name="q" defaultValue={q} placeholder="Name, phone or pincode" className="field pl-9" />
        </label>
        <button className="btn bg-leaf-dark text-cream hover:bg-leaf">Search</button>
      </form>

      {customers.length === 0 ? (
        <Empty title={q ? "No customers match" : "No customers yet"}>Customers appear here after their first order.</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink/5 text-left text-xs font-bold uppercase tracking-wider text-ink/50">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Pincode</th>
                <th className="px-4 py-3 text-right">Orders</th>
                <th className="px-4 py-3 text-right">Spent</th>
                <th className="px-4 py-3">Last order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-cream/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{c.name}</p>
                    <p className="font-mono text-xs text-ink/50">+91 {c._id}</p>
                  </td>
                  <td className="px-4 py-3 font-mono">{c.pincode}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`rounded-full px-2 py-0.5 font-black ${c.orders > 1 ? "bg-haldi/30 text-mustard" : ""}`}>{c.orders}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-black">{formatRupees(c.spent)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/orders/${c.lastOrderId}`} className="font-mono text-xs font-bold text-leaf-dark hover:underline">{c.lastOrderId}</Link>
                    <p className="text-xs text-ink/50">{formatDateTime(c.lastOrder)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/orders?q=${c._id}`} title="All orders" className="rounded-lg p-2 text-ink/50 hover:bg-cream hover:text-leaf"><Icon name="orders" size={16} /></Link>
                      <a href={`tel:+91${c._id}`} title="Call" className="rounded-lg p-2 text-ink/50 hover:bg-cream hover:text-leaf"><Icon name="phone" size={16} /></a>
                      <a href={`https://wa.me/91${c._id}`} target="_blank" rel="noreferrer" title="WhatsApp" className="rounded-lg p-2 text-ink/50 hover:bg-cream hover:text-[#1da851]"><Icon name="chat" size={16} /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
