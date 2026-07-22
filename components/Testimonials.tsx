import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amaka O.",
    role: "Sent a birthday hamper",
    quote:
      "Ordered at 11am for same-day delivery and it arrived beautifully wrapped, exactly as pictured. My sister cried, in a good way.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Tunde A.",
    role: "Corporate gifting, RedBeryl Tech",
    quote:
      "We used The Love Box for 30 staff welcome kits. Communication on WhatsApp made last-minute changes painless.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Ifeoma N.",
    role: "Proposal flowers",
    quote:
      "The team helped me plan the whole surprise, down to delivery timing. Genuinely felt like they cared about it going well.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "David E.",
    role: "Anniversary gift box",
    quote:
      "Easy to track the order and the quality matched the photos on the site. Will be reordering for Val's day.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

function TestimonialCard({ name, role, quote, avatar }: (typeof testimonials)[number]) {
  return (
    <div className="w-[320px] shrink-0 bg-white border border-brand-blush rounded-2xl p-5 mx-2.5">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
        ))}
      </div>
      <p className="text-[13.5px] text-[#5a4c4f] leading-relaxed mb-4">"{quote}"</p>
      <div className="flex items-center gap-2.5">
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
          <Image src={avatar} alt={name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-brand-ink">{name}</p>
          <p className="text-[11.5px] text-[#8a7a7d]">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const track = [...testimonials, ...testimonials];

  return (
    <section className="bg-white py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-8 flex items-end justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-2">Testimonials</p>
          <h2 className="font-display text-[26px] text-brand-ink">What Lagos is saying</h2>
        </div>
      </div>
      <div className="flex marquee-track w-max" style={{ animationDuration: "40s" }}>
        {track.map((t, i) => (
          <TestimonialCard key={t.name + i} {...t} />
        ))}
      </div>
    </section>
  );
}
