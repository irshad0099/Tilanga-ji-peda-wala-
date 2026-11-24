import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Page not found", robots: { index: false } };

// Branded 404: the "0" is a peda, slowly turning. Points people back to the
// product, the home page and order tracking.
export default function NotFound() {
  return (
    <div className="relative overflow-hidden bg-cream">
      <span aria-hidden="true" className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-haldi/20 blur-3xl" />
      <span aria-hidden="true" className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-leaf/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <p aria-label="404" className="flex items-center gap-2 font-display text-[110px] font-black leading-none text-leaf-dark sm:text-[150px]">
          <span aria-hidden="true">4</span>
          <span aria-hidden="true" className="nf-peda relative inline-block h-[92px] w-[92px] overflow-hidden rounded-full border-[6px] border-haldi shadow-[0_14px_30px_-12px_rgba(47,74,29,0.6)] sm:h-[124px] sm:w-[124px]">
            <Image src="/images/peda/peda-brass-bowl.jpg" alt="" fill sizes="124px" className="object-cover" />
          </span>
          <span aria-hidden="true">4</span>
        </p>

        <h1 className="mt-6 font-display text-3xl font-black text-leaf-dark sm:text-4xl">Ye page nahi mila</h1>
        <p className="mt-3 max-w-md text-[16px] text-ink/70">
          Lagta hai ye peda kisi ne pehle hi kha liya! Jo page aap dhoondh rahe hain wo yahan nahi hai — par taaze pede abhi bhi
          taiyaar hain.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/product/classic-khoya-peda" className="btn-3d rounded-xl bg-leaf px-6 py-3 text-[15px] font-extrabold text-cream">
            Pede dekhein
          </Link>
          <Link href="/" className="rounded-xl border-2 border-leaf/30 bg-cream px-6 py-3 text-[15px] font-extrabold text-leaf transition hover:border-leaf hover:bg-butter">
            Home par jaayein
          </Link>
        </div>
        <Link href="/track-order" className="mt-5 text-sm font-bold text-leaf underline decoration-haldi decoration-2 underline-offset-4">
          Apna order track karein →
        </Link>
      </div>
    </div>
  );
}
