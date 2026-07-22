import Link from "next/link";
import Image from "next/image";
import { Star, Truck } from "lucide-react";

export default function Hero() {
  return (
    <section id="top" className="relative bg-white overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-brand-blush/60 blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-[#FBF6E9] blur-3xl" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 sm:pt-20 sm:pb-28 grid grid-cols-1 md:grid-cols-2 gap-14 items-center relative">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-brand-blush/60 rounded-full pl-1.5 pr-3.5 py-1.5 mb-6">
            <span className="flex -space-x-1.5">
              {[
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=60&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=60&auto=format&fit=crop",
              ].map((src) => (
                <span key={src} className="relative w-5 h-5 rounded-full border-2 border-white overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover" />
                </span>
              ))}
            </span>
            <span className="text-[12px] text-brand-ink">Loved by 3,000+ Lagos senders</span>
          </div>

          <p className="text-[13px] uppercase tracking-wide text-brand-gold mb-3">Lagos' gifting studio</p>
          <h1 className="font-display text-[38px] sm:text-[52px] leading-[1.06] text-brand-ink mb-5">
            Gifts that say it<br />better than words.
          </h1>
          <p className="text-[15px] text-[#5a4c4f] max-w-md mb-8 leading-relaxed">
            Flowers, hampers, cakes and thoughtful boxes, curated for every occasion and delivered
            same-day across Lagos.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/categories"
              className="bg-brand-pink text-white text-[14px] font-medium px-6 py-3.5 rounded-full hover:bg-brand-pinkDark transition-colors"
            >
              Shop gifts
            </Link>
            <Link
              href="/track-order"
              className="text-[14px] font-medium text-brand-ink px-6 py-3.5 rounded-full border border-brand-ink/15 hover:border-brand-ink transition-colors"
            >
              Track an order
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(196,39,92,0.25)]">
              <Image
                src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop"
                alt="Curated gift box from The Love Box"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="col-span-2 flex flex-col gap-3">
              <div className="relative flex-1 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(196,39,92,0.2)]">
                <Image
                  src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=600&auto=format&fit=crop"
                  alt="Fresh flowers being arranged"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative flex-1 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(196,39,92,0.2)]">
                <Image
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop"
                  alt="Birthday hamper box"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(33,26,29,0.2)] border border-brand-blush px-4 py-3 flex items-center gap-3 max-w-[220px]">
            <div className="w-9 h-9 rounded-full bg-brand-blush flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-brand-pink" />
            </div>
            <div>
              <p className="text-[12.5px] font-medium text-brand-ink leading-tight">Same-day delivery</p>
              <p className="text-[11px] text-[#8a7a7d]">Across Lagos, before 3pm</p>
            </div>
          </div>

          <div className="absolute -top-5 -right-3 bg-white rounded-xl shadow-[0_15px_40px_-10px_rgba(33,26,29,0.18)] border border-brand-blush px-3.5 py-2.5 flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <span className="text-[12px] text-brand-ink font-medium">4.9/5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
