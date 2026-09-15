import { getSettings } from "@/lib/db/settings.server";

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

export default async function Testimonials() {
  const { shop } = await getSettings();

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <figure key={review.name} className="rounded-xl border border-gold/30 bg-cream p-6">
            <blockquote className="text-[15px] leading-relaxed text-ink/85">&quot;{review.text}&quot;</blockquote>
            <figcaption className="mt-4 font-display text-teal">{review.name}</figcaption>
          </figure>
        ))}
      </div>
      {shop.googleMapsUrl && (
        <div className="mt-8 text-center">
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-teal px-5 py-2.5 text-sm font-semibold text-teal hover:bg-teal hover:text-cream"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.9 6.26L21.5 9l-4.9 4.4L17.8 21 12 17.4 6.2 21l1.2-7.6L2.5 9l6.6-.74L12 2z" />
            </svg>
            Read our reviews on Google
          </a>
        </div>
      )}
    </div>
  );
}
