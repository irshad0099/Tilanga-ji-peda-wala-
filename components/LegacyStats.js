const stats = [
  { value: "1975", label: "The year it all started" },
  { value: "50+", label: "Years of the same recipe" },
  { value: "3,100+", label: "Google reviews from travellers" },
  { value: "Daily", label: "Fresh batches, never stored" },
];

export default function LegacyStats() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-gold/40 bg-cream p-5 text-center">
          <p className="font-display text-2xl text-maroon sm:text-3xl">{stat.value}</p>
          <p className="mt-1 text-sm text-ink/70">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
