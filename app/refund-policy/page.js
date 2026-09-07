export const metadata = { title: "Refund Policy - Tilanga Ji Ka Mashahur Peda Dukan" };

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-teal">Refund &amp; Cancellation Policy</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: Placeholder — edit this date once finalised.</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80">
        <p>
          Since everything we make is fresh food, our refund policy is
          intentionally strict. Replace this placeholder text with your
          finalised policy before going live.
        </p>
        <section>
          <h2 className="font-display text-xl text-teal">Cancellations</h2>
          <p className="mt-2">
            Orders can be cancelled free of charge before they enter
            preparation. Once a batch has started, it can no longer be
            cancelled.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Damaged or incorrect items</h2>
          <p className="mt-2">
            If an item arrives damaged, spoiled, or different from what you
            ordered, contact us within 24 hours with a photo and your order
            ID, and we'll arrange a replacement or refund.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Refund timelines</h2>
          <p className="mt-2">
            Approved online-payment refunds are processed within 5–7
            business days to the original payment method. Cash on delivery
            refunds are settled via UPI transfer.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Contact us</h2>
          <p className="mt-2">Reach us at +91 94310 55263 or +91 95764 56473 for any refund or cancellation request.</p>
        </section>
      </div>
    </div>
  );
}
