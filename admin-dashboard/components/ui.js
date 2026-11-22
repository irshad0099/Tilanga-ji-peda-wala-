import Icon from "@/components/Icon";
import { STATUS_STYLES, PAYMENT_STYLES, PAYMENT_LABELS } from "@/lib/orders";

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-leaf-dark sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[status] || "bg-stone-100 text-stone-600"}`}>{status || "—"}</span>;
}

export function PaymentBadge({ status }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${PAYMENT_STYLES[status] || "bg-stone-100 text-stone-600"}`}>
      {PAYMENT_LABELS[status] || status || "—"}
    </span>
  );
}

export function StatCard({ label, value, hint, icon, tone = "leaf" }) {
  const tones = {
    leaf: "bg-leaf/10 text-leaf-dark",
    haldi: "bg-haldi/25 text-mustard",
    sky: "bg-sky-100 text-sky-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div className="card fade-in p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-ink/60">{label}</p>
        {icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-black tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs font-semibold text-ink/50">{hint}</p>}
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-dark text-leaf">
        <Icon name="orders" size={26} />
      </span>
      <p className="mt-4 text-lg font-black text-leaf-dark">{title}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-ink/60">{children}</div>}
    </div>
  );
}

export function DbMissing() {
  return (
    <Empty title="Database not connected">
      Set <code className="rounded bg-cream-dark px-1">MONGODB_URI</code> for this admin app — the same value the shop site uses.
    </Empty>
  );
}
