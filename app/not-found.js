import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="font-display text-6xl text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl text-teal">This page hasn&apos;t been made yet</h1>
      <p className="mt-2 text-[15px] text-ink/70">
        The page you're looking for doesn't exist. It may have moved, or the link might be outdated.
      </p>
      <Link href="/" className="mt-6 rounded-lg bg-teal px-6 py-3 text-[15px] font-semibold text-cream hover:bg-teal-dark">
        Back to home
      </Link>
    </div>
  );
}
