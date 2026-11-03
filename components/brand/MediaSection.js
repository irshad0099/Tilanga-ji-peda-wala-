import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import Branch from "@/components/Branch";
import { mediaCoverage, mediaFeature } from "@/lib/content";

// A logo nailed onto a wooden board.
export function WoodBoard({ tilt = 0, children }) {
  return (
    <div className="wood-sign !animate-none flex h-24 w-48 shrink-0 items-center justify-center rounded-xl p-3" style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-cream/95 shadow-inner">{children}</div>
    </div>
  );
}

// "Latest media" feature + an endless strip of press logos on wood boards.
// Empty entries in lib/content.js render as placeholders.
export default function MediaSection() {
  const boards = mediaCoverage.length ? mediaCoverage : Array.from({ length: 5 }, () => null);
  const strip = [...boards, ...boards, ...boards];

  return (
    <section className="relative overflow-hidden bg-butter py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-4xl font-black text-[#7A6A00] sm:text-5xl">Media Mein Charcha</h2>
          {mediaFeature ? (
            <>
              <p className="mt-2 font-extrabold text-leaf-dark">{mediaFeature.title}</p>
              <p className="mt-4 max-w-lg text-[17px] font-semibold leading-relaxed text-[#6B5E00]">{mediaFeature.text}</p>
            </>
          ) : (
            <Placeholder icon="text" label="2-3 lines about a news / TV / YouTube feature" hint="lib/content.js → mediaFeature" className="mt-6 min-h-28 max-w-lg" />
          )}
        </Reveal>
        <Reveal delay={120}>
          {mediaFeature?.youtubeId ? (
            <div className="aspect-video overflow-hidden rounded-3xl shadow-xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${mediaFeature.youtubeId}`}
                title={mediaFeature.title}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <Placeholder icon="video" label="Featured video" hint="lib/content.js → mediaFeature.youtubeId" className="aspect-video !rounded-3xl" />
          )}
        </Reveal>
      </div>

      <div className="relative mt-16">
        <Branch className="absolute -top-10 left-0 z-10 w-56 sm:w-80" />
        <h3 className="text-center font-display text-2xl font-extrabold text-[#7A6A00] sm:text-3xl">Other Media Coverage</h3>
        <div className="marquee mt-8 overflow-hidden py-4">
          <div className="marquee-track" style={{ animationDuration: "40s" }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-6 pr-6">
                {strip.map((m, i) => (
                  <WoodBoard key={`${copy}-${i}`} tilt={[-2, 1.5, -1, 2, -1.5][i % 5]}>
                    {m ? (
                      <a href={m.url} target="_blank" rel="noreferrer">
                        <Image src={m.logo} alt={m.name} width={160} height={64} className="h-12 w-auto object-contain" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink/40">Media logo</span>
                    )}
                  </WoodBoard>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
