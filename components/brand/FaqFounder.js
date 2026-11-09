import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import FAQAccordion from "@/components/FAQAccordion";
import { founder } from "@/lib/content";

// FAQ on the left, the founder's portrait over a yellow brush stroke on the
// right (placeholder until lib/content.js → founder.photo is set).
export default function FaqFounder() {
  return (
    <section className="relative overflow-hidden bg-cream py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Reveal>
            <h2 className="font-display text-4xl font-black text-leaf-dark sm:text-5xl">FAQ&apos;s</h2>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <FAQAccordion />
          </Reveal>
        </div>
        <Reveal delay={150} className="relative mx-auto w-full max-w-md">
          {/* Yellow brush strokes behind the (background-free) portrait. */}
          <svg viewBox="0 0 400 400" className="absolute inset-x-0 top-[6%] aspect-square w-full" aria-hidden="true">
            <path d="M40 250 C70 140 170 60 300 40 C330 36 350 50 330 70 C250 120 150 200 110 300 C100 330 60 320 40 250Z" fill="#F7E04A" opacity="0.9" />
            <path d="M90 330 C150 230 250 150 360 120 C380 116 384 134 368 146 C290 200 210 270 170 350 C150 380 70 370 90 330Z" fill="#F7E04A" opacity="0.75" />
          </svg>
          {founder.photo ? (
            <Image
              src={founder.photo}
              alt={`${founder.name} — ${founder.title}`}
              width={667}
              height={852}
              className="float relative mx-auto w-[86%] drop-shadow-[0_24px_30px_rgba(120,60,10,0.35)]"
            />
          ) : (
            <Placeholder label="Founder ki photo / illustration" hint="lib/content.js → founder.photo" className="float relative aspect-[6/7] w-full !rounded-[40px] !bg-none !bg-transparent" />
          )}
          <p className="relative mt-4 text-center font-display text-2xl font-black text-leaf-dark">{founder.name}</p>
          <p className="relative text-center text-sm font-bold text-ink/60">{founder.title}</p>
        </Reveal>
      </div>
    </section>
  );
}
