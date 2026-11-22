import Link from "next/link";
import { getDashboard } from "@/lib/data";
import { isDbConfigured } from "@/lib/mongodb";
import { formatRupees, formatDateTime, timeAgo } from "@/lib/format";
import { PageHeader, StatCard, StatusBadge, PaymentBadge, DbMissing } from "@/components/ui";
import SalesChart from "@/components/SalesChart";
import Icon from "@/components/Icon";

export const metadata = { title: "Dashboard" };

const RANGES = [7, 14, 30, 90];

export default async function DashboardPage({ searchParams }) {
  if (!isDbConfigured()) return <DbMissing />;
  const { range } = await searchParams;
  const days = RANGES.includes(Number(range)) ? Number(range) : 14;
  const d = await getDashboard(days);
  const openTotal = Object.values(d.open).reduce((a, b) => a + b, 0);
  const onlineShare = d.range.revenue ? Math.round((d.range.online / d.range.revenue) * 100) : 0;

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`Namaste! Here's how the shop is doing — ${new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" })}.`}>
        <Link href="/orders?status=Placed" className="btn bg-leaf-dark text-cream hover:bg-leaf">
          <Icon name="orders" size={16} />
          New orders
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's sales" value={formatRupees(d.today.revenue)} hint={`${d.today.orders} order${d.today.orders === 1 ? "" : "s"} today`} icon="rupee" />
        <StatCard label="This month" value={formatRupees(d.month.revenue)} hint={`${d.month.orders} orders so far`} icon="clock" tone="haldi" />
        <StatCard label="To pack & deliver" value={openTotal} hint={`${d.open.Placed} new · ${d.open.Preparing} preparing · ${d.open["Out for Delivery"]} on the way`} icon="truck" tone="sky" />
        <StatCard label="Unfinished payments" value={d.awaitingPayment} hint="Online checkouts not completed (7 days)" icon="alert" tone="rose" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-leaf-dark">Sales</h2>
              <p className="text-sm text-ink/60">
                {formatRupees(d.range.revenue)} from {d.range.orders} orders in the last {days} days
              </p>
            </div>
            <div className="flex rounded-xl bg-cream-dark p-1 text-sm font-bold">
              {RANGES.map((r) => (
                <Link key={r} href={r === 14 ? "/" : `/?range=${r}`} className={`rounded-lg px-3 py-1 transition ${r === days ? "bg-white text-leaf-dark shadow" : "text-ink/55 hover:text-ink"}`}>
                  {r}d
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <SalesChart series={d.series} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/5 pt-5 text-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Avg. order</p>
              <p className="mt-1 text-xl font-black">{formatRupees(d.range.avgOrder)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Boxes sold</p>
              <p className="mt-1 text-xl font-black">{d.range.boxes}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Paid online</p>
              <p className="mt-1 text-xl font-black">{onlineShare}%</p>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="text-lg font-black text-leaf-dark">Payments</h2>
            <p className="text-sm text-ink/60">Last {days} days</p>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-ink/10">
              <div className="bg-leaf" style={{ width: `${onlineShare}%` }} />
              <div className="bg-haldi" style={{ width: `${d.range.revenue ? 100 - onlineShare : 0}%` }} />
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              <p className="flex justify-between">
                <span className="flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-leaf" />Online (Razorpay)</span>
                <span className="font-black">{formatRupees(d.range.online)}</span>
              </p>
              <p className="flex justify-between">
                <span className="flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-haldi" />Cash on delivery</span>
                <span className="font-black">{formatRupees(d.range.cod)}</span>
              </p>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-black text-leaf-dark">Top pincodes</h2>
            <p className="text-sm text-ink/60">Where orders came from</p>
            {d.topPincodes.length ? (
              <ul className="mt-3 space-y-2">
                {d.topPincodes.map(([pin, n]) => (
                  <li key={pin} className="flex items-center gap-3 text-sm">
                    <span className="w-16 font-mono font-bold">{pin}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink/5">
                      <span className="block h-full rounded-full bg-leaf/70" style={{ width: `${(n / d.topPincodes[0][1]) * 100}%` }} />
                    </span>
                    <span className="w-8 text-right font-black">{n}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink/50">No orders in this period yet.</p>
            )}
          </section>
        </div>
      </div>

      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-black text-leaf-dark">Latest orders</h2>
          <Link href="/orders" className="text-sm font-bold text-leaf hover:underline">See all →</Link>
        </div>
        {d.recent.length ? (
          <ul className="divide-y divide-ink/5">
            {d.recent.map((o) => (
              <li key={o._id}>
                <Link href={`/orders/${o._id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 transition hover:bg-cream">
                  <span className="w-24 font-mono text-sm font-bold text-leaf-dark">{o._id}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{o.customer?.name || "—"}</span>
                  <StatusBadge status={o.status} />
                  <PaymentBadge status={o.paymentStatus} />
                  <span className="w-20 text-right text-sm font-black">{formatRupees(o.total)}</span>
                  <span className="w-24 text-right text-xs text-ink/50" title={formatDateTime(o.date)}>{timeAgo(o.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 pb-6 text-sm text-ink/50">No orders yet. They'll appear here the moment a customer checks out.</p>
        )}
      </section>
    </>
  );
}
