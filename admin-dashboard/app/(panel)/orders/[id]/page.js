import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, getCustomerOrderCount } from "@/lib/data";
import { isDbConfigured } from "@/lib/mongodb";
import { setCodCollected } from "@/app/actions";
import { formatRupees, formatDateTime } from "@/lib/format";
import { SHOP_URL, shopImage } from "@/lib/shop";
import { PaymentBadge, DbMissing } from "@/components/ui";
import StatusSelect from "@/components/StatusSelect";
import NoteForm from "@/components/NoteForm";
import Icon from "@/components/Icon";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Order ${id}` };
}

function Card({ title, children, className = "" }) {
  return (
    <section className={`card p-5 ${className}`}>
      <h2 className="text-xs font-black uppercase tracking-wider text-ink/50">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function OrderPage({ params }) {
  if (!isDbConfigured()) return <DbMissing />;
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const c = order.customer || {};
  const repeat = await getCustomerOrderCount(c.phone);
  const firstName = (c.name || "").split(" ")[0];
  const waText = encodeURIComponent(`Namaste ${firstName} ji, Tilangaji Peda se — aapka order ${order._id} ke baare mein.`);

  // One timeline: when it was placed, paid, every status change and note.
  const events = [
    { at: order.date, title: "Order placed", detail: order.payment === "cod" ? "Cash on delivery" : "Online payment started" },
    order.paidAt && { at: order.paidAt, title: "Paid online", detail: order.paymentMethodDetail ? `via ${order.paymentMethodDetail}` : order.razorpayPaymentId },
    order.paymentStatus === "failed" && { at: order.updatedAt, title: "Payment failed", detail: order.paymentError, tone: "rose" },
    ...(order.statusHistory || []).map((h) => ({ at: h.at, title: h.status, detail: h.by })),
    ...(order.notes || []).map((n) => ({ at: n.at, title: "Note", detail: n.text, note: true, by: n.by })),
  ]
    .filter(Boolean)
    .sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <>
      <Link href="/orders" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-ink/60 hover:text-leaf">
        <Icon name="back" size={16} />
        All orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-black text-leaf-dark sm:text-3xl">{order._id}</h1>
        <StatusSelect id={order._id} status={order.status} className="!py-1.5 !text-sm" />
        <PaymentBadge status={order.paymentStatus} />
        <span className="text-sm text-ink/50">{formatDateTime(order.date)}</span>
        <a href={`${SHOP_URL}/invoice/${order._id}`} target="_blank" rel="noreferrer" className="btn ml-auto border border-ink/15 bg-white text-ink hover:bg-cream">
          <Icon name="download" size={16} />
          Invoice
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Items">
            <ul className="divide-y divide-ink/5">
              {(order.items || []).map((i, n) => (
                <li key={n} className="flex items-center gap-4 py-3">
                  {i.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={shopImage(i.image)} alt="" className="h-14 w-12 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{i.name}</p>
                    <p className="text-xs text-ink/55">{i.weight} · {formatRupees(i.price)} each</p>
                  </div>
                  <span className="text-sm font-semibold text-ink/60">× {i.qty}</span>
                  <span className="w-20 text-right font-black">{formatRupees(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-ink/5 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd className="font-semibold">{formatRupees(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Delivery</dt><dd className="font-semibold">{order.deliveryFee ? formatRupees(order.deliveryFee) : "Free"}</dd></div>
              <div className="flex justify-between text-base"><dt className="font-black">Total</dt><dd className="font-black text-leaf-dark">{formatRupees(order.total)}</dd></div>
            </dl>
          </Card>

          <Card title="Timeline & notes">
            <ol className="relative space-y-4 border-l-2 border-ink/10 pl-5">
              {events.map((e, n) => (
                <li key={n} className="relative">
                  <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${e.note ? "bg-haldi" : e.tone === "rose" ? "bg-rose-500" : "bg-leaf"}`} />
                  <p className="text-sm font-bold">
                    {e.title} <span className="font-normal text-ink/45">· {formatDateTime(e.at)}</span>
                  </p>
                  {e.detail && <p className={`text-sm ${e.note ? "mt-1 rounded-lg bg-cream px-3 py-2 text-ink/80" : "text-ink/55"}`}>{e.detail}</p>}
                  {e.note && e.by && <p className="mt-0.5 text-xs text-ink/40">{e.by}</p>}
                </li>
              ))}
            </ol>
            <NoteForm id={order._id} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Customer">
            <p className="text-lg font-black">{c.name}</p>
            {repeat > 1 && <span className="mt-1 inline-block rounded-full bg-haldi/30 px-2 py-0.5 text-xs font-bold text-mustard">Repeat customer · {repeat} orders</span>}
            <p className="mt-3 whitespace-pre-line text-sm text-ink/75">{c.address}</p>
            <p className="mt-1 font-mono text-sm font-bold">{c.pincode}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:+91${c.phone}`} className="btn bg-leaf-dark text-cream hover:bg-leaf">
                <Icon name="phone" size={16} />
                Call
              </a>
              <a href={`https://wa.me/91${c.phone}?text=${waText}`} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-white hover:brightness-95">
                <Icon name="chat" size={16} />
                WhatsApp
              </a>
            </div>
            <p className="mt-2 text-center font-mono text-sm text-ink/60">+91 {c.phone}</p>
          </Card>

          <Card title="Payment">
            <p className="flex items-center justify-between text-sm">
              <span className="text-ink/60">Method</span>
              <span className="font-bold">{order.payment === "cod" ? "Cash on delivery" : "Online (Razorpay)"}</span>
            </p>
            <p className="mt-2 flex items-center justify-between text-sm">
              <span className="text-ink/60">Status</span>
              <PaymentBadge status={order.paymentStatus} />
            </p>
            {order.razorpayPaymentId && (
              <a href={`https://dashboard.razorpay.com/app/payments/${order.razorpayPaymentId}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-between rounded-lg bg-cream px-3 py-2 font-mono text-xs font-bold text-leaf-dark hover:bg-cream-dark">
                {order.razorpayPaymentId}
                <Icon name="external" size={14} />
              </a>
            )}
            {order.payment === "cod" && order.status !== "Cancelled" && (
              <form action={setCodCollected} className="mt-4">
                <input type="hidden" name="id" value={order._id} />
                <input type="hidden" name="collected" value={order.codCollected ? "0" : "1"} />
                {order.codCollected ? (
                  <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm">
                    <p className="font-bold text-emerald-800">✓ Cash collected</p>
                    <p className="text-xs text-emerald-700/70">{formatDateTime(order.codCollectedAt)}</p>
                    <button className="mt-1 text-xs font-bold text-ink/50 underline">Undo</button>
                  </div>
                ) : (
                  <button className="btn w-full bg-haldi text-leaf-dark hover:brightness-95">Mark {formatRupees(order.total)} cash collected</button>
                )}
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
