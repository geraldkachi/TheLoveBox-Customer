import Image from "next/image";
import type { Metadata } from "next";
import { Heart, Target, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | The Love Box",
  description:
    "The Love Box is a Lagos-based gifting studio curating flowers, hampers and thoughtful boxes for every occasion.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: Heart, title: "Thoughtfulness first", body: "Every box is put together as if we were sending it to someone we love." },
  { icon: Sparkles, title: "Craft over speed", body: "We'd rather take the extra ten minutes to style it right than rush it out the door." },
  { icon: Users, title: "Real people, real support", body: "A message to us reaches an actual gift specialist, not a queue." },
  { icon: Target, title: "Reliability", body: "If we say same-day, we mean same-day — every time, not just on a good day." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-3">About The Love Box</p>
          <h1 className="font-display text-[34px] sm:text-[42px] leading-[1.1] text-brand-ink mb-5">
            A Lagos gifting studio, built around one idea.
          </h1>
          <p className="text-[15px] text-[#5a4c4f] leading-relaxed">
            The Love Box started from a simple frustration: most gifting in Lagos felt rushed, generic, or
            impersonal. We set out to build something different — a studio where every order is styled by hand,
            delivered on time, and actually feels like it was chosen for the person receiving it.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=900&auto=format&fit=crop"
            alt="The Love Box gift styling studio"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-brand-blush/40 py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl p-8 border border-brand-blush">
            <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-3">Our vision</p>
            <p className="font-display text-[22px] text-brand-ink leading-snug mb-3">
              To be the first name Lagos thinks of when a moment matters.
            </p>
            <p className="text-[14px] text-[#5a4c4f] leading-relaxed">
              We want gifting to be something people look forward to, not scramble for at the last minute.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-brand-blush">
            <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-3">Our mission</p>
            <p className="font-display text-[22px] text-brand-ink leading-snug mb-3">
              Make thoughtful, high-quality gifting effortless and reliable.
            </p>
            <p className="text-[14px] text-[#5a4c4f] leading-relaxed">
              From browsing to same-day delivery, every step is designed so you can send something meaningful
              without the stress of getting it wrong.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-3">What we do</p>
        <h2 className="font-display text-[26px] text-brand-ink mb-6 max-w-lg">
          Flowers, hampers, cakes and curated boxes, for every occasion on the calendar.
        </h2>
        <p className="text-[14.5px] text-[#5a4c4f] leading-relaxed max-w-2xl mb-4">
          We design and deliver gifts for birthdays, weddings, anniversaries, corporate events, and every
          celebration in between — sourcing fresh flowers, quality hampers, and personalised touches, then
          styling and wrapping each order by hand before it leaves our studio in Yaba.
        </p>
        <p className="text-[14.5px] text-[#5a4c4f] leading-relaxed max-w-2xl">
          Need something specific — a custom message, a particular colour palette, or a bulk corporate order?
          Our gift specialists are a WhatsApp message away and happy to build something around your brief.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-3">Company objective</p>
        <h2 className="font-display text-[26px] text-brand-ink mb-6 max-w-lg">
          Same-day, every time — without cutting corners on craft.
        </h2>
        <p className="text-[14.5px] text-[#5a4c4f] leading-relaxed max-w-2xl">
          Our operating goal is simple: hit same-day delivery across Lagos on every order placed before 3pm,
          while keeping the standard of styling and packaging consistent whether it's a ₦5,000 bouquet or a
          six-figure corporate order.
        </p>
      </section>

      <section className="bg-brand-ink py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-3">Our values</p>
          <h2 className="font-display text-[26px] text-white mb-8 max-w-lg">What guides how we work.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-brand-pink mt-0.5 shrink-0" />
                <div>
                  <p className="text-[14.5px] font-medium text-white">{title}</p>
                  <p className="text-[13px] text-white/60 mt-1 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
