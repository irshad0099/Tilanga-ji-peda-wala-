import Image from "next/image";

const steps = [
  {
    title: "Fresh milk, every morning",
    body: "We start with full-cream milk sourced fresh each morning — no powdered shortcuts.",
    image: "/images/illustrations/process-milk.svg",
  },
  {
    title: "Slow-cooked into khoya",
    body: "The milk is reduced slowly in wide kadhais until it thickens into khoya, stirred by hand the whole way.",
    image: "/images/illustrations/process-khoya.svg",
  },
  {
    title: "Hand-shaped, one by one",
    body: "Each peda is rolled and shaped by hand — no machine pressing, no two pieces perfectly identical.",
    image: "/images/illustrations/process-shaping.svg",
  },
  {
    title: "Packed fresh, shipped fast",
    body: "Boxed the same day and dispatched quickly, so what reaches you is close to what left the kadhai.",
    image: "/images/illustrations/process-packing.svg",
  },
];

export default function ProcessSteps() {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center">
            <Image src={step.image} alt={step.title} width={130} height={130} className="h-32 w-32" />
          </div>
          <p className="mt-2 font-display text-sm text-gold">Step {i + 1}</p>
          <h3 className="mt-1 font-display text-lg text-teal">{step.title}</h3>
          <p className="mt-1 text-[15px] text-ink/75">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
