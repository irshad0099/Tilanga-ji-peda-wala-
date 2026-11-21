export const metadata = { title: "Terms - Tilanga Ji Ka Mashahur Peda Dukan" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-leaf">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: Placeholder — edit this date once finalised.</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80">
        <p>
          These terms govern your use of this site and any order placed
          through it. Replace this placeholder text with your finalised
          terms before going live.
        </p>
        <section>
          <h2 className="font-display text-xl text-leaf">Orders</h2>
          <p className="mt-2">
            An order is confirmed once payment is received or, for cash on
            delivery, once it is placed successfully. We reserve the right
            to cancel an order if an item goes out of stock.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-leaf">Shipping</h2>
          <p className="mt-2">
            We deliver within Bihar only, by courier. Delivery windows shown at
            checkout are estimates and can vary with courier availability
            and local conditions.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-leaf">Returns &amp; refunds</h2>
          <p className="mt-2">
            Our pedas are fresh food, so orders cannot be returned or refunded
            once they have been dispatched.
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              If we cancel your order ourselves — for example because the day&apos;s
              batch has sold out — any amount you paid online is refunded in
              full to the original payment method.
            </li>
            <li>
              If your box arrives broken or spoiled, send us a photo on WhatsApp
              at +91 91234 14885 within 24 hours of delivery and we will send a
              replacement.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl text-leaf">Pricing</h2>
          <p className="mt-2">
            Prices shown on the site are current at the time of browsing and
            may change without prior notice. The price at checkout is what
            you will be charged.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-leaf">Contact us</h2>
          <p className="mt-2">Questions about these terms can be sent to +91 91234 14885.</p>
        </section>
      </div>
    </div>
  );
}
