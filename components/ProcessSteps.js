const steps = [
  {
    title: "Fresh milk, every morning",
    body: "We start with full-cream milk sourced fresh each morning — no powdered shortcuts.",
  },
  {
    title: "Slow-cooked into khoya",
    body: "The milk is reduced slowly in wide kadhais until it thickens into khoya, stirred by hand the whole way.",
  },
  {
    title: "Hand-shaped, one by one",
    body: "Each peda is rolled and shaped by hand — no machine pressing, no two pieces perfectly identical.",
  },
  {
    title: "Packed fresh, shipped fast",
    body: "Boxed the same day and dispatched quickly, so what reaches you is close to what left the kadhai.",
  },
];

export default function ProcessSteps() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="rounded-2xl border border-gold/30 bg-cream p-6 text-center"
        >
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold/50 font-display text-xl text-maroon">
            {i + 1}
          </span>
          <h3 className="mt-4 font-display text-lg text-teal">{step.title}</h3>
          <p className="mt-1 text-[15px] text-ink/75">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
