import { formatRupees, formatDay } from "@/lib/format";

// Daily revenue bars with the order count under each day. Plain SVG + CSS,
// no chart library. Hovering a bar shows its exact numbers (title tooltip).
export default function SalesChart({ series }) {
  const max = Math.max(1, ...series.map((d) => d.revenue));
  const step = Math.ceil(series.length / 7);

  return (
    <div>
      <div className="flex h-56 items-end gap-1.5 sm:gap-2">
        {series.map((d, i) => {
          const h = Math.max(d.revenue ? 4 : 1.5, (d.revenue / max) * 100);
          return (
            <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end" title={`${formatDay(d.day)}: ${formatRupees(d.revenue)} · ${d.orders} order${d.orders === 1 ? "" : "s"}`}>
              <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-leaf-dark px-2 py-1 text-[11px] font-bold text-cream shadow group-hover:block">
                {formatRupees(d.revenue)} · {d.orders}
              </span>
              <div
                className={`bar rounded-t-md transition-colors ${d.revenue ? "bg-gradient-to-t from-leaf to-[#8DB33A] group-hover:from-leaf-dark group-hover:to-leaf" : "bg-ink/10"}`}
                style={{ height: `${h}%`, animationDelay: `${i * 25}ms` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2">
        {series.map((d, i) => (
          <span key={d.day} className="flex-1 text-center text-[10px] font-semibold text-ink/45">
            {i % step === 0 || i === series.length - 1 ? formatDay(d.day) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
