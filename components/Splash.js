import LogoBadge from "@/components/LogoBadge";

// One-moment logo screen on the first page of a visit. It is pure CSS — it
// fades itself out after ~1s even before (or without) JavaScript — and the
// inline script marks the visit so later pages in the same tab skip it
// (html[data-splash-seen], set before first paint). Styles: globals.css,
// "Splash".
export default function Splash() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("tj_splash"))document.documentElement.dataset.splashSeen="1";else sessionStorage.setItem("tj_splash","1")}catch(e){}`,
        }}
      />
      <div aria-hidden="true" className="splash fixed inset-0 z-[300] flex flex-col items-center justify-center bg-cream">
        <span className="splash-ring absolute h-56 w-56 rounded-full border-2 border-haldi/60" />
        <span className="splash-logo relative">
          <LogoBadge size={150} priority className="h-[150px] w-auto" />
        </span>
        <span className="splash-tag mt-5 text-xs font-extrabold uppercase tracking-[0.3em] text-mustard">Since 1975</span>
      </div>
    </>
  );
}
