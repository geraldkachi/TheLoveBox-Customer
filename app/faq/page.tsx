import Link from "next/link";
import FaqAccordion from "./FaqAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | The Love Box",
  description: "Answers to common questions about ordering, delivery, payment, and tracking with The Love Box.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-2">Support</p>
        <h1 className="font-display text-[32px] text-brand-ink mb-2">Frequently asked questions</h1>
        <p className="text-[14px] text-[#8a7a7d] max-w-md mx-auto">
          Can't find what you're looking for?{" "}
          <Link href="/contact" className="text-brand-pink font-medium">
            Contact us
          </Link>{" "}
          and we'll get back to you shortly.
        </p>
      </div>
      <FaqAccordion />
    </div>
  );
}
