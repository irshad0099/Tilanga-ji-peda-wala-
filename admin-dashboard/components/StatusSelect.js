"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions";
import { SETTABLE_STATUSES, STATUS_STYLES } from "@/lib/orders";

// Status dropdown that saves the moment it changes.
export default function StatusSelect({ id, status, className = "" }) {
  const [pending, start] = useTransition();
  const options = SETTABLE_STATUSES.includes(status) ? SETTABLE_STATUSES : [status, ...SETTABLE_STATUSES];

  function onChange(e) {
    const next = e.target.value;
    if (next === "Cancelled" && !confirm(`Cancel order ${id}? The customer will see it as cancelled.`)) {
      e.target.value = status;
      return;
    }
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", next);
    start(() => updateOrderStatus(fd));
  }

  return (
    <select
      defaultValue={status}
      key={status}
      onChange={onChange}
      disabled={pending}
      aria-label={`Status of ${id}`}
      className={`cursor-pointer rounded-full border-0 py-1 pl-3 pr-7 text-xs font-bold outline-none ring-1 ring-inset ring-black/5 focus:ring-2 focus:ring-leaf disabled:opacity-50 ${STATUS_STYLES[status] || ""} ${className}`}
    >
      {options.map((s) => (
        <option key={s} value={s} disabled={s === "Payment pending"}>
          {s}
        </option>
      ))}
    </select>
  );
}
