"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I order flowers or gifts for delivery in Lagos?",
    a: "Browse a category or search for what you want, add it to your cart, then check out with your delivery address and phone number. You'll get an order number to track it once payment is confirmed.",
  },
  {
    q: "Do you deliver the same day?",
    a: "Yes — order before 3pm and we'll deliver the same day across Lagos. Orders placed after 3pm are delivered the next day unless you request a specific date at checkout.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept card payments, bank transfers, and USSD through Paystack's secure checkout.",
  },
  {
    q: "Can I change my order after placing it?",
    a: "Yes, as long as it hasn't been dispatched yet. Message us on WhatsApp with your order number and what you'd like changed, and we'll sort it before it ships.",
  },
  {
    q: "How do I track my order?",
    a: "Head to the Track Order page and enter the order number from your confirmation email or SMS.",
  },
  {
    q: "Do you offer corporate or bulk gifting?",
    a: "Yes — for welcome kits, client gifts, or event favours in bulk, message us on WhatsApp or use the contact form and we'll put a package together for you.",
  },
  {
    q: "What if the recipient isn't home for delivery?",
    a: "Our rider will contact the recipient's phone number directly to arrange a convenient drop-off time within the same day where possible.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-3">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className="bg-white border border-brand-blush rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[14.5px] font-medium text-brand-ink">{item.q}</span>
              <ChevronDown className={`w-4 h-4 text-brand-pink shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="px-5 pb-4 text-[13.5px] text-[#5a4c4f] leading-relaxed">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
