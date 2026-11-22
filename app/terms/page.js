import { getSettings } from "@/lib/db/settings.server";

export const metadata = { title: "Terms & Conditions - Tilanga Ji Ka Mashahur Peda Dukan" };

const UPDATED = "21 November 2026";

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-xl text-leaf">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

// The shop's name, address and phone come from the admin dashboard → Settings, so they
// always match what the shop has registered (e.g. with Razorpay).
export default async function TermsPage() {
  const { shop, phones } = await getSettings();
  const phone = phones[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-leaf">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-7 text-[15px] leading-relaxed text-ink/80">
        <p>
          This website is run by <strong>{shop.legalName}</strong>, {shop.address} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By placing an order
          here you agree to these terms. Please read them along with our{" "}
          <a href="/privacy" className="font-semibold text-leaf underline decoration-haldi decoration-2 underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>

        <Section title="Our products">
          <p>
            We sell the Classic Khoya Peda, made by hand at our shop in Sakaddi. Because every peda is made by hand, size,
            shape and colour vary a little from piece to piece and from the photos on this site. Our pedas are made from
            milk products (khoya and ghee); please do not order if you are allergic to milk.
          </p>
        </Section>

        <Section title="Orders">
          <p>
            An order is confirmed once payment is received or, for cash on delivery, once it is placed successfully. You
            will see an order ID on screen; please keep it to track your order.
          </p>
          <p>
            We may cancel an order if the day&apos;s batch sells out, if the delivery pincode is outside our service area, or
            if the details given look incorrect. If we cancel, we tell you and refund any online payment in full.
          </p>
        </Section>

        <Section title="Cancellation by you">
          <p>
            We start preparing and packing orders the same day they are placed, so an order cannot be cancelled once it
            has been placed.
          </p>
        </Section>

        <Section title="Prices and payment">
          <p>
            Prices are in Indian Rupees and include applicable taxes. Delivery charges, if any, are shown at checkout
            before you pay. Prices may change without notice; the price shown at checkout is what you pay.
          </p>
          <p>
            Online payments (UPI, cards, netbanking and wallets) are processed securely by Razorpay. You can also choose
            cash on delivery and pay when the box arrives.
          </p>
        </Section>

        <Section title="Delivery">
          <p>
            We deliver within Bihar only. Orders are handed to a courier or our own delivery staff; delivery times shown
            on the site and at checkout are estimates and can vary with courier availability, weather and local
            conditions.
          </p>
          <p>
            Please give a complete address and a phone number that will be answered. If a parcel cannot be delivered
            because the address is wrong, nobody is available, or a cash-on-delivery order is refused, it cannot be
            re-sent or refunded, as the pedas will not stay fresh.
          </p>
        </Section>

        <Section title="Returns & refunds">
          <p>
            Our pedas are fresh food, so orders cannot be returned or refunded once they have been dispatched.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              If we cancel your order ourselves — for example because the day&apos;s batch has sold out — any amount you
              paid online is refunded in full to the original payment method.
            </li>
            <li>
              If your box arrives broken or spoiled, send us a photo on WhatsApp at {phone} within 24 hours of delivery
              and we will send a replacement.
            </li>
          </ul>
        </Section>

        <Section title="Storage and freshness">
          <p>
            Pedas are best within 4–5 days of dispatch. Keep them in a cool, dry place and refrigerate in humid weather.
            We are not responsible for spoilage caused by storage after delivery.
          </p>
        </Section>

        <Section title="Use of this website">
          <p>
            The text, photos, logo and design on this site belong to us and may not be copied for commercial use without
            our permission. Please don&apos;t misuse the site, place fake orders, or try to interfere with how it works.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            We do our best to keep the site accurate and working, but it is provided as it is. To the extent the law
            allows, our responsibility for any order is limited to the amount you paid for that order.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of India. Any dispute will be subject to the courts of Bhojpur (Ara),
            Bihar.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>We may update these terms from time to time. The version on this page on the day you order applies to that order.</p>
        </Section>

        <Section title="Contact & grievances">
          <p>
            For any question or complaint, call or WhatsApp us at <strong>{phone}</strong> ({shop.hours.replace(/^Open /, "")}),
            or write to us at {shop.legalName}, {shop.address}. We aim to reply within 48 hours.
          </p>
        </Section>
      </div>
    </div>
  );
}
