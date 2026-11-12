import { reviews } from "@/lib/content";

function ReviewCard({ r, hidden = false }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="rv-card relative flex w-[300px] shrink-0 flex-col justify-between rounded-3xl border-2 border-leaf/10 bg-cream p-7 text-center shadow-[0_16px_30px_-22px_rgba(47,74,29,0.6)] sm:w-[360px]"
    >
      <span aria-hidden="true" className="font-display text-6xl font-black leading-none text-haldi">“</span>
      <blockquote className="-mt-3 text-[16px] font-semibold leading-relaxed text-ink">{r.text}</blockquote>
      <figcaption className="mt-5 flex flex-col items-center">
        {r.rating ? (
          <span className="block text-xl tracking-wider text-haldi drop-shadow-[0_1px_0_#b8901f]" aria-label={`${r.rating} out of 5`}>
            {"★".repeat(r.rating)}
            <span className="text-ink/20">{"★".repeat(5 - r.rating)}</span>
          </span>
        ) : null}
        <span className="mt-2 flex items-center gap-2.5">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf font-display text-sm font-black text-cream">
            {r.name.charAt(0)}
          </span>
          <span className="font-extrabold text-ink">{r.name}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Review cards drifting sideways in an endless loop; it pauses while the
// pointer (or a finger) is on it. The list is rendered twice so the loop is
// seamless (styles: globals.css, "Reviews"). Stars only show for reviews
// that carry a real `rating` (see lib/content.js).
export default function ReviewsCarousel({ googleUrl }) {
  if (!reviews.length) return null;
  // Short lists repeat so one copy is always wider than the screen.
  const row = reviews.length >= 5 ? reviews : [...reviews, ...reviews, ...reviews].slice(0, Math.max(6, reviews.length));

  return (
    <div data-anim>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="flex items-center gap-2 text-lg font-extrabold text-ink">
          <span className="text-2xl text-haldi drop-shadow-[0_1px_0_#b8901f]">★</span>
          3,100+ reviews on Google
        </p>
        {googleUrl && (
          <a href={googleUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-leaf underline decoration-haldi decoration-2 underline-offset-4">
            Read them all →
          </a>
        )}
      </div>

      <div className="rv-marquee relative -mx-4 mt-8 overflow-hidden py-4 sm:-mx-6">
        <div className="rv-track flex w-max" style={{ "--rv-duration": `${row.length * 7}s` }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-5 pr-5">
              {row.map((r, i) => (
                <ReviewCard key={`${copy}-${i}`} r={r} hidden={copy === 1 || i >= reviews.length} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
