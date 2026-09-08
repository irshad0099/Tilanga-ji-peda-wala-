"use client";

import { useEffect, useState } from "react";
import { buildUpiLink } from "@/lib/upi";
import { upi } from "@/lib/config";
import { formatRupees } from "@/lib/format";

/**
 * UPI QR + manual-verification payment step.
 *
 * props:
 *   amount      number   — amount to collect
 *   note        string   — transaction note shown in the UPI app
 *   heading     string   — panel title
 *   onConfirmed (ref)    — called with the customer's UPI reference id
 */
export default function UpiQrPayment({ amount, note, heading = "Pay by UPI", onConfirmed }) {
  const [qr, setQr] = useState("");
  const [ref, setRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const link = buildUpiLink({ amount, note });

  useEffect(() => {
    let alive = true;
    import("qrcode").then((mod) => {
      const QRCode = mod.default || mod;
      QRCode.toDataURL(link, { width: 520, margin: 1, errorCorrectionLevel: "M" })
        .then((url) => alive && setQr(url))
        .catch(() => alive && setQr(""));
    });
    return () => {
      alive = false;
    };
  }, [link]);

  function copyVpa() {
    navigator.clipboard?.writeText(upi.vpa).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function confirm(e) {
    e.preventDefault();
    const clean = ref.trim();
    if (clean.length < 6) {
      setError("Enter the UPI reference / UTR number from your payment app (at least 6 characters).");
      return;
    }
    setError("");
    onConfirmed(clean);
  }

  return (
    <div className="rounded-2xl border border-gold/40 bg-cream-dark/30 p-6">
      <h3 className="font-display text-lg text-teal">{heading}</h3>
      <p className="mt-1 text-sm text-ink/70">
        Scan the QR with any UPI app, or pay to the ID below. Amount is pre-filled.
      </p>

      <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="mx-auto w-44 shrink-0 rounded-xl border border-gold/40 bg-cream p-3 sm:mx-0">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="UPI payment QR code" width={520} height={520} className="h-auto w-full" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-xs text-ink/50">
              Generating QR…
            </div>
          )}
        </div>

        <div className="text-sm">
          <dl className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/60">Amount</dt>
              <dd className="font-semibold text-maroon">{formatRupees(amount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/60">Pay to</dt>
              <dd className="font-medium text-ink">{upi.payeeName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink/60">UPI ID</dt>
              <dd className="flex items-center gap-2">
                <span className="font-mono text-[13px] text-ink">{upi.vpa}</span>
                <button
                  type="button"
                  onClick={copyVpa}
                  className="rounded border border-teal/30 px-2 py-0.5 text-xs text-teal hover:bg-cream-dark"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </dd>
            </div>
          </dl>

          <a
            href={link}
            className="mt-4 inline-block rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-cream hover:bg-teal-dark"
          >
            Open in UPI app
          </a>
          <p className="mt-1 text-xs text-ink/45">Works on phones with a UPI app installed.</p>
        </div>
      </div>

      <form onSubmit={confirm} className="mt-6 border-t border-gold/30 pt-5">
        <label className="text-sm font-medium text-ink/80">
          After paying, enter the UPI reference / UTR number
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="e.g. 4193 2210 8845"
            className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-maroon px-5 py-2.5 text-sm font-semibold text-cream hover:bg-maroon/90"
          >
            I&apos;ve paid
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-maroon">{error}</p>}
        <p className="mt-2 text-xs text-ink/45">
          Your payment is confirmed manually by the shop, usually within a few hours during
          working hours. You&apos;ll get the order ID and invoice right away.
        </p>
      </form>
    </div>
  );
}
