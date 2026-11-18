import Link from "next/link";
import type { Metadata } from "next";
import FaqAccordion from "./FaqAccordion";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Answers about ordering, same-day delivery, payment and tracking with The Love Box.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="container-x grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <h1 className="text-h1 font-bold">Questions, answered</h1>
        <p className="mt-4 max-w-sm text-[16px] text-ink-soft">Can't find what you need? A gift specialist replies on WhatsApp within minutes, 8am to 8pm.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappLink("Hi The Love Box! I have a question.")} target="_blank" rel="noreferrer" className="btn-primary">Chat on WhatsApp</a>
          <Link href="/contact" className="btn-ghost">Send a message</Link>
        </div>
      </div>
      <FaqAccordion />
    </div>
  );
}
