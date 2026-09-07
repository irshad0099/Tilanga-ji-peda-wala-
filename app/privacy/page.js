export const metadata = { title: "Privacy Policy - Tilanga Ji Ka Mashahur Peda Dukan" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-teal">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: Placeholder — edit this date once finalised.</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80">
        <p>
          Tilanga Ji Ka Mashahur Peda Dukan ("we", "us") respects your
          privacy. This page explains, in plain terms, what information we
          collect and how it is used. Replace this placeholder text with
          your finalised policy before going live.
        </p>
        <section>
          <h2 className="font-display text-xl text-teal">Information we collect</h2>
          <p className="mt-2">
            Name, phone number, delivery address and pincode when you place
            an order; basic usage data such as pages visited, for improving
            the site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">How we use it</h2>
          <p className="mt-2">
            To process and ship your order, to contact you about order
            status, and to improve our menu and delivery coverage over time.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Payment information</h2>
          <p className="mt-2">
            Online payments are processed by our payment partner; we do not
            store your card or UPI credentials on our own servers.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-teal">Contact us</h2>
          <p className="mt-2">Questions about this policy can be sent to +91 94310 55263.</p>
        </section>
      </div>
    </div>
  );
}
