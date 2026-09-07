const points = [
  {
    title: "The same recipe since 1975",
    body: "Started as a small tea stall by Tilanga Ji and grown purely on word of mouth — the peda recipe hasn't changed.",
    icon: <path d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8-5v5l3 2" />,
  },
  {
    title: "Pure khoya, nothing else",
    body: "No vanaspati, no synthetic colour, no preservatives — just milk, sugar and time.",
    icon: <path d="M12 3c-3 3-5 6-5 9a5 5 0 0 0 10 0c0-3-2-6-5-9z" />,
  },
  {
    title: "A highway landmark",
    body: "On the Ara–Patna highway, travellers have been stopping here for a plate of hot peda for decades.",
    icon: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    title: "Now shipped across India",
    body: "You no longer need to be on the highway — order online and we'll courier it to your door.",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {points.map((point) => (
        <div key={point.title} className="flex gap-4">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#DB8A1F" strokeWidth="1.6" className="mt-1 shrink-0">
            {point.icon}
          </svg>
          <div>
            <h3 className="font-display text-lg text-teal">{point.title}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-ink/75">{point.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
