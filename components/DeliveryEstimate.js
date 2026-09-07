"use client";

import { useState } from "react";
import { estimateDelivery } from "@/lib/shipping";

export default function DeliveryEstimate() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleCheck(e) {
    e.preventDefault();
    const estimate = estimateDelivery(pin);
    if (!estimate) {
      setError("Enter a valid 6-digit pincode.");
      setResult(null);
      return;
    }
    setError("");
    setResult(estimate);
  }

  return (
    <div>
      <form onSubmit={handleCheck} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter your pincode"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal sm:w-56"
        />
        <button type="submit" className="rounded-lg bg-maroon px-5 py-2.5 text-sm font-semibold text-cream hover:bg-maroon/90">
          Check delivery time
        </button>
      </form>

      {error && <p className="mt-3 text-[15px] font-medium text-maroon">{error}</p>}
      {result && (
        <p className="mt-3 text-[15px] font-medium text-teal">
          {result.zone}: estimated delivery in {result.days}.
        </p>
      )}
    </div>
  );
}
