import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import StoryIntro from "@/components/brand/StoryIntro";

// "The traditional journey" — how a peda is made, as a dotted vertical
// timeline with wooden number medallions and wavy-edged photo stamps.
// Steps without a photo of their own show a placeholder stamp; drop the
// shop's photos into /public/images/journey/ and set `image` below.
const steps = [
  { title: "Subah ka taaza doodh", text: "Full-cream milk arrives fresh every morning — no milk powder, no shortcuts.", image: null },
  { title: "Kadhai mein khoya", text: "The milk is reduced slowly in wide kadhais, stirred by hand the whole way, until it turns to khoya.", image: null },
  { title: "Haath se bane pede", text: "Each peda is rolled and pressed by hand — no machines, no two exactly alike.", image: "/images/photos/peda-platter.jpg" },
  { title: "Usi din packing", text: "Boxed the same day it's made and sent out fast.", image: null },
  { title: "Aapke ghar tak", text: "Couriered across India — Bhojpur the same day, the rest of the country in a few days.", image: null },
];

export default function JourneyTimeline({ story }) {
  return (
    <section id="story" className="relative scroll-mt-24 overflow-hidden bg-cream py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <StoryIntro story={story} />
        </div>

        <ol className="relative">
          <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 border-l-[3px] border-dotted border-wood/50 sm:left-[33px]" />
          {steps.map((s, n) => (
            <Reveal as="li" key={s.title} delay={n * 80} className="relative flex items-center gap-4 pb-8 last:pb-0 sm:gap-6">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-wood font-display text-3xl font-black text-cream shadow-[inset_0_-4px_0_rgba(0,0,0,0.25),0_6px_14px_rgba(107,63,29,0.4)] ring-4 ring-cream sm:h-[68px] sm:w-[68px] sm:text-4xl">
                {n + 1}
              </span>
              <div className="flex flex-1 items-center gap-4 rounded-[28px] border-2 border-wood/70 bg-cream p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_36px_-22px_rgba(107,63,29,0.7)] sm:gap-6 sm:p-6">
                <div className="scallop-frame h-20 w-20 shrink-0 bg-butter sm:h-28 sm:w-28">
                  {s.image ? (
                    <Image src={s.image} alt="" width={224} height={224} className="h-full w-full object-cover" />
                  ) : (
                    <Placeholder label="Photo" className="h-full w-full !rounded-none !border-0 !p-0 !text-[11px]" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-wood sm:text-2xl">{s.title}</h3>
                  <p className="mt-1.5 text-[14px] font-semibold leading-relaxed text-leaf sm:text-[15px]">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
