import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import { mediaFeature } from "@/lib/content";

// "Media mein charcha": a featured news / TV / YouTube piece with its
// video. Placeholder until lib/content.js → mediaFeature is filled in.
export default function MediaSection() {
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
    </section>
  );
}
