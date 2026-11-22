"use client";

import { useActionState, useEffect, useRef } from "react";
import { addOrderNote } from "@/app/actions";

// Private notes on an order — only staff see them, never the customer.
export default function NoteForm({ id }) {
  const [state, action, pending] = useActionState(addOrderNote, null);
  const ref = useRef(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="mt-4">
      <input type="hidden" name="id" value={id} />
      <textarea name="text" rows={2} placeholder="Add a private note — e.g. 'Called, deliver after 5 PM'" className="field resize-y" />
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-rose-600">{state?.error}</p>
        <button disabled={pending} className="btn bg-leaf-dark text-cream hover:bg-leaf">
          {pending ? "Saving…" : "Add note"}
        </button>
      </div>
    </form>
  );
}
