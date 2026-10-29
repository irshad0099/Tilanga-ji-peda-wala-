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
  const [lead, ...rest] = reviews;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      <figure>
        <span aria-hidden="true" className="block font-display text-7xl leading-none text-saffron/60">“</span>
        <blockquote className="-mt-4 font-display text-2xl leading-snug text-maroon sm:text-3xl">
          {lead.text}
        </blockquote>
        <figcaption className="mt-5 text-[15px] font-semibold text-ink/75">— {lead.name}</figcaption>

        {shop.googleMapsUrl && (
          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-maroon underline decoration-gold decoration-2 underline-offset-4 hover:decoration-saffron"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-saffron">
              <path d="M12 2l2.9 6.26L21.5 9l-4.9 4.4L17.8 21 12 17.4 6.2 21l1.2-7.6L2.5 9l6.6-.74L12 2z" />
            </svg>
            Google par 3,100+ reviews padhein
          </a>
        )}
      </figure>

      <div className="divide-y divide-gold/40 border-y border-gold/40">
        {rest.map((review) => (
          <figure key={review.name} className="py-6">
            <blockquote className="text-[16px] leading-relaxed text-ink/85">{review.text}</blockquote>
            <figcaption className="mt-3 text-sm font-semibold text-ink/65">— {review.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
