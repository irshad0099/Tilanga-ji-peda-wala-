import { getSettings } from "@/lib/db/settings.server";

export const metadata = { title: "Privacy Policy - Tilanga Ji Ka Mashahur Peda Dukan" };

const UPDATED = "21 November 2026";

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-xl text-leaf">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

// Describes what the site actually does: an order form (name, phone,
// address, pincode), orders kept in MongoDB, payments via Razorpay, the cart
// and recent order IDs in the browser's own storage, and no analytics or
// advertising trackers. Update it if any of that changes.
export default async function PrivacyPage() {
  const { shop, phones } = await getSettings();
  const phone = phones[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-leaf">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-7 text-[15px] leading-relaxed text-ink/80">
        <p>
          <strong>{shop.legalName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This page explains what
          information we collect when you use this website, why, and what we do with it.
        </p>

        <Section title="What we collect">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Order details</strong> you type at checkout: your name, mobile number, delivery address and
              pincode, and what you ordered.
            </li>
            <li>
              <strong>Payment status</strong> from Razorpay — for example that a payment succeeded and its payment ID.
              We never see or store your card number, UPI PIN or bank login.
            </li>
            <li>
              <strong>Messages</strong> you send us on WhatsApp or by phone.
            </li>
          </ul>
          <p>We do not use advertising or analytics trackers on this website.</p>
        </Section>

        <Section title="How we use it">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>To prepare, pack and deliver your order, and to contact you about it.</li>
            <li>To show your order status and invoice when you track your order.</li>
            <li>To answer your questions and complaints.</li>
            <li>To keep the accounts and tax records the law requires.</li>
          </ul>
          <p>We do not sell your information, and we do not send marketing messages unless you ask to join our updates.</p>
        </Section>

        <Section title="Who we share it with">
          <p>Only with the services needed to complete your order:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Razorpay</strong>, our payment partner, to process online payments.
            </li>
            <li>
              <strong>Courier and delivery partners</strong>, who receive your name, phone number and address to deliver
              the box.
            </li>
            <li>
              <strong>Our hosting and database providers</strong>, which store the website and order records securely.
            </li>
          </ul>
          <p>We may also share information if the law or a government authority requires it.</p>
        </Section>

        <Section title="Stored on your device">
          <p>
            Your cart and the IDs of orders you placed are saved in your own browser (local storage), so they are still
            there when you come back. You can clear them at any time by clearing your browser&apos;s site data.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep order records for as long as needed to deliver the order and handle any query about it, and
            afterwards for as long as tax and accounting laws require.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask us to show, correct or delete the personal information we hold about you, except what we must
            keep by law. Contact us using the details below.
          </p>
        </Section>

        <Section title="Security">
          <p>
            The website uses HTTPS encryption, payments are handled by Razorpay, and order records are kept in a
            password-protected database that only the shop can access.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>If we change how we use your information, we will update this page and the date at the top.</p>
        </Section>

        <Section title="Contact us">
          <p>
            For any privacy question or request, call or WhatsApp us at <strong>{phone}</strong>, or write to{" "}
            {shop.legalName}, {shop.address}.
          </p>
        </Section>
      </div>
    </div>
  );
}
