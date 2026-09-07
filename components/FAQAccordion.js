"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How fresh is the peda when it ships?",
    a: "We make in small batches and dispatch the same day an order is packed — nothing sits in storage before it ships.",
  },
  {
    q: "Do you deliver outside Bihar?",
    a: "Yes. We ship pan-India by courier. Local Bhojpur orders arrive same day to next day; the rest of India takes a few days longer.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on delivery, UPI QR, and online payment via Razorpay — pick whichever works for you at checkout.",
  },
  {
    q: "How long does the peda stay fresh?",
    a: "Best enjoyed within 4-5 days of dispatch, kept in a cool, dry place. Refrigerate in humid weather for a slightly longer shelf life.",
  },
  {
    q: "Can I order for a wedding or bulk event?",
    a: "Yes — message us on WhatsApp with your quantity and date, and we'll work out bulk pricing and a delivery schedule.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-gold/30 rounded-xl border border-gold/30 bg-cream">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-display text-teal">{item.q}</span>
              <span className="shrink-0 text-xl text-gold">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p className="px-5 pb-4 text-[15px] leading-relaxed text-ink/75">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
