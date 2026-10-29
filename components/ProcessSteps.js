const steps = [
  {
    title: "सुबह का ताज़ा दूध",
    body: "Full-cream milk, fresh every morning — no powder.",
  },
  {
    title: "कड़ाही में खोया",
    body: "Reduced slowly in wide kadhais, stirred by hand.",
  },
  {
    title: "हाथ से पेड़ा",
    body: "Rolled one by one — no two exactly alike.",
  },
  {
    title: "उसी दिन पैकिंग",
    body: "Boxed the day it's made and sent out fast.",
  },
];

// Sits on the dark maroon story band on the home page.
export default function ProcessSteps() {
  return (
    <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="font-display text-3xl leading-none text-gold">{i + 1}</span>
          <div>
            <h3 className="font-display text-lg text-cream">{step.title}</h3>
            <p className="mt-0.5 text-[15px] text-cream/75">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
