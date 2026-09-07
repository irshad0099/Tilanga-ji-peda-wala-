export const metadata = { title: "Terms - Tilanga Ji Ka Mashahur Peda Dukan" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-teal">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: Placeholder — edit this date once finalised.</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80">
        <p>
          These terms govern your use of this site and any order placed
          through it. Replace this placeholder text with your finalised
          terms before going live.
        </p>
        <section>
          <h2 className="font-display text-xl text-teal">Orders</h2>
          <p className="mt-2">
            An order is confirmed once payment is received or, for cash on
            delivery, once it is placed successfully. We reserve the right
            to cancel an order if an item goes out of stock.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Shipping</h2>
          <p className="mt-2">
            We ship across India by courier. Delivery windows shown at
            checkout are estimates and can vary with courier availability
            and local conditions.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Pricing</h2>
          <p className="mt-2">
            Prices shown on the site are current at the time of browsing and
            may change without prior notice. The price at checkout is what
            you will be charged.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Contact us</h2>
          <p className="mt-2">Questions about these terms can be sent to +91 94310 55263.</p>
        </section>
      </div>
    </div>
  );
}
