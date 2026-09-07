"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-gold/40 bg-cream-dark/30 p-8">
        <div className="flex justify-center gap-2">
          <button onClick={() => setMode("login")} className={`rounded-full px-4 py-1.5 text-sm font-medium ${mode === "login" ? "bg-teal text-cream" : "text-teal"}`}>
            Log in
          </button>
          <button onClick={() => setMode("signup")} className={`rounded-full px-4 py-1.5 text-sm font-medium ${mode === "signup" ? "bg-teal text-cream" : "text-teal"}`}>
            Sign up
          </button>
        </div>

        <h1 className="mt-6 text-center font-display text-2xl text-teal">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h1>

        {submitted ? (
          <p className="mt-6 text-center text-[15px] text-teal">
            This is a design preview — account login isn&apos;t wired up to a
            real server yet. Hook this form up once the backend is ready.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <input required placeholder="Full name" className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal" />
            )}
            <input required type="tel" placeholder="Phone number" className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal" />
            <input required type="password" placeholder="Password" className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal" />
            <button type="submit" className="w-full rounded-lg bg-maroon py-3 text-[15px] font-semibold text-cream hover:bg-maroon/90">
              {mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink/60">
          <Link href="/" className="hover:text-maroon">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
