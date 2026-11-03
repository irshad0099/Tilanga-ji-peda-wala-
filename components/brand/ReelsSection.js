import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import { reels } from "@/lib/content";
import { formatRupees } from "@/lib/format";

// "Featured videos": vertical reels, each with a mini buy card for the
// product it shows. Empty reels list = placeholder slots.
export default function ReelsSection({ product }) {
  const items = reels.length ? reels : Array.from({ length: 6 }, () => null);
  const off = product && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <section className="bg-butter/60 pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black text-leaf-dark sm:text-5xl">Featured Videos</h2>
        </Reveal>
        <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
          {items.map((r, i) => (
            <div key={r?.url || i} className="w-48 shrink-0 snap-start overflow-hidden rounded-2xl bg-cream shadow-[0_14px_30px_-20px_rgba(47,74,29,0.7)] sm:w-52">
              {r ? (
                <a href={r.url} target="_blank" rel="noreferrer" className="group relative block">
                  <Image src={r.poster} alt={r.title} width={416} height={740} className="aspect-[9/16] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/55 text-cream backdrop-blur">▶</span>
                  </span>
                </a>
              ) : (
                <Placeholder icon="video" label="Reel" hint="lib/content.js → reels" className="aspect-[9/16] !rounded-none !border-0 !border-b-2" />
              )}
              {product && (
                <div className="p-2.5">
                  <div className="flex items-center gap-2">
                    <Image src={product.image} alt="" width={64} height={64} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 text-left">
                      <p className="truncate text-xs font-bold text-ink">{product.name}</p>
                      <p className="text-[13px] font-extrabold text-ink">
                        {formatRupees(product.price)}{" "}
                        {off > 0 && <span className="text-[11px] font-semibold text-ink/40 line-through">{formatRupees(product.mrp)}</span>}
                      </p>
                    </div>
                  </div>
                  <Link href={`/product/${product.slug}`} className="mt-2.5 block rounded-lg bg-leaf py-2 text-center text-[13px] font-extrabold text-cream transition hover:bg-leaf-dark">
                    Buy Now
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
