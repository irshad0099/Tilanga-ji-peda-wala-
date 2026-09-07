const reviews = [
  {
    name: "Rakesh V., Ara",
    text: "We stop here every time we drive the Ara–Patna highway. The peda is warm and fresh almost every single time.",
  },
  {
    name: "Sunita M., Patna",
    text: "Ordered the assorted box online for a family function — arrived well packed and every piece was soft, not squashed.",
  },
  {
    name: "Deepak R., Bhojpur",
    text: "This is the peda I grew up eating. Fifty years and it still tastes the way my father describes it from his childhood.",
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reviews.map((review) => (
        <figure key={review.name} className="rounded-xl border border-gold/30 bg-cream p-6">
          <blockquote className="text-[15px] leading-relaxed text-ink/85">"{review.text}"</blockquote>
          <figcaption className="mt-4 font-display text-teal">{review.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
