"use client";
import Accordion from "@/components/Accordion";

const faqs = [
  { q: "How do I order a gift for delivery in Lagos?", a: "Pick a gift, add it to your cart and check out with the recipient's address and your phone number. Once payment is confirmed you'll get an order number to track it." },
  { q: "Do you deliver the same day?", a: "Yes. Order before 3pm and we deliver the same day anywhere in Lagos. Orders after 3pm go out the next morning, unless you choose a later date at checkout." },
  { q: "How much is delivery?", a: "It depends on where the gift is going. You pay for the gift at checkout, then we email your exact delivery fee — usually within the hour — with a secure Paystack link. Your gift ships as soon as delivery is paid." },
  { q: "What payment methods do you accept?", a: "Cards, bank transfer and USSD, all through Paystack's secure checkout." },
  { q: "Can I change my order after placing it?", a: "Yes, as long as it hasn't left the studio. Message us on WhatsApp with your order number and the change." },
  { q: "How do I track my order?", a: "Open the Track order page and enter the order number from your confirmation email." },
  { q: "Do you do corporate or bulk gifting?", a: "Yes. For welcome kits, client gifts or event favours, message us on WhatsApp or send a brief through the contact page and we'll put a proposal together." },
  { q: "What if the recipient isn't home?", a: "Our rider calls the recipient's number to arrange a convenient drop-off, the same day wherever possible." },
];

export default function FaqAccordion() {
  return <Accordion items={faqs} defaultOpen={0} />;
}
