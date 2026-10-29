"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Can I get any sweet delivered?",
    a: "Only our Classic Khoya Peda ships — we keep delivery to this one item so it always travels well and arrives fresh. Every other peda flavour, our gift boxes, litti-chokha, fresh sweets and chai are made through the day and served at the shop — do visit us for those.",
  },
  {
    q: "Do you deliver outside Bihar?",
    a: "Yes. The Classic Khoya Peda ships pan-India by courier. Local Bhojpur orders arrive same day to next day; the rest of India takes a few days longer.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Pay online at checkout through Razorpay — UPI (Google Pay, PhonePe, Paytm or any bank app), debit or credit card, netbanking or wallets — or choose cash on delivery and pay when the box arrives.",
  },
  {
    q: "How long does the peda stay fresh?",
    a: "Best enjoyed within 4-5 days of dispatch, kept in a cool, dry place. Refrigerate in humid weather for a slightly longer shelf life.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl divide-y divide-gold/40 border-y border-gold/40">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-[16px] font-semibold text-maroon">{item.q}</span>
              <span className="shrink-0 text-xl text-gold">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p className="pb-4 text-[15px] leading-relaxed text-ink/75">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
