import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Amaka O.", role: "Birthday hamper", quote: "Ordered at 11am for same-day delivery and it arrived beautifully wrapped, exactly as pictured. My sister cried, in a good way.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
  { name: "Tunde A.", role: "30 staff welcome kits", quote: "Communication on WhatsApp made last-minute changes painless. Every kit arrived on the same morning.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { name: "Ifeoma N.", role: "Proposal flowers", quote: "They helped me plan the whole surprise down to delivery timing. It felt like they genuinely cared that it went well.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop" },
];

export default function Testimonials() {
  return (
    <section className="container-x py-20">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_2fr]">
        <div>
          <p className="text-[72px] font-extrabold leading-none tracking-tighter">4.9</p>
          <div className="mt-3 flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
            ))}
          </div>
          <p className="mt-3 max-w-[14rem] text-[15px] text-ink-soft">Average rating from more than 3,000 deliveries across Lagos.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col">
              <blockquote className="flex-1 text-[17px] leading-relaxed text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={t.avatar} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">{t.name}</span>
                  <span className="block text-[13.5px] text-ink-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
