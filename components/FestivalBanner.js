import Link from "next/link";
import { festivals } from "@/lib/content";

// Today's date in India, as YYYY-MM-DD (the server runs in UTC).
function todayIST() {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

function Diya({ className = "" }) {
  return (
    <svg viewBox="0 0 40 32" aria-hidden="true" className={`fb-diya h-7 w-9 shrink-0 ${className}`}>
      <ellipse className="fb-glow" cx="20" cy="9" rx="9" ry="9" fill="#FFD36B" opacity="0.35" />
      <path className="fb-flame" d="M20 2c2.6 3.4 3.8 5.8 3.8 7.6a3.8 3.8 0 0 1-7.6 0c0-1.8 1.2-4.2 3.8-7.6z" fill="#FFB83D" />
      <path d="M20 6c1 1.5 1.5 2.5 1.5 3.4a1.5 1.5 0 0 1-3 0c0-.9.5-1.9 1.5-3.4z" fill="#FFF3C4" />
      <path d="M4 16h32c-1 7-7.6 12-16 12S5 23 4 16z" fill="#C8642B" />
      <path d="M8 16c3 2.4 7.2 3.6 12 3.6s9-1.2 12-3.6" fill="none" stroke="#EBC64C" strokeWidth="1.6" />
      <circle cx="13" cy="22" r="1.2" fill="#EBC64C" />
      <circle cx="20" cy="23.5" r="1.2" fill="#EBC64C" />
      <circle cx="27" cy="22" r="1.2" fill="#EBC64C" />
    </svg>
  );
}

// Decorative strip above the announcement bar while a festival is on (dates
// in lib/content.js → festivals). Renders nothing the rest of the year.
export default function FestivalBanner() {
  const today = todayIST();
  const festival = festivals.find((f) => today >= f.from && today <= f.to);
  if (!festival) return null;

  return (
    <Link
      href="/product/classic-khoya-peda"
      data-anim
      className="fb-strip group relative flex items-center justify-center gap-3 overflow-hidden px-4 py-2.5 text-center text-cream"
    >
      <span aria-hidden="true" className="fb-toran" />
      <Diya />
      <span className="relative text-[13px] font-extrabold leading-snug sm:text-[15px]">
        <span className="text-haldi">{festival.name}</span>
        <span className="hidden sm:inline"> · </span>
        <span className="block sm:inline">{festival.text}</span>
      </span>
      <span className="fb-cta relative hidden shrink-0 rounded-full bg-haldi px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-leaf-dark sm:inline-block">
        Order karein →
      </span>
      <Diya className="hidden sm:block" />
    </Link>
  );
}
