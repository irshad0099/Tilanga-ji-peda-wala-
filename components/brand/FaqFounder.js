import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import FAQAccordion from "@/components/FAQAccordion";
import { founder } from "@/lib/content";

// FAQ on the left, the founder's portrait on the right (placeholder until
// lib/content.js → founder.photo is set).
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
          {founder.photo ? (
            <Image
              src={founder.photo}
              alt={`${founder.name} — ${founder.title}`}
              width={836}
              height={900}
              className="float relative mx-auto w-[82%] drop-shadow-[0_24px_30px_rgba(120,60,10,0.35)]"
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
