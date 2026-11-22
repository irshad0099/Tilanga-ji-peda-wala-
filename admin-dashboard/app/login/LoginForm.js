"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

export default function LoginForm({ next }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-7 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Email</span>
        <input name="email" type="email" required autoComplete="username" className="field mt-1" />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="field mt-1" />
      </label>
      {state?.error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{state.error}</p>}
      <button disabled={pending} className="btn w-full bg-leaf-dark py-3 text-cream hover:bg-leaf">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
