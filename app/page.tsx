import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import BrandsMarquee from "@/components/BrandsMarquee";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import Hero from "@/components/Hero";
import { ParallaxStory } from "@/components/TextParallax";
import { Gift, ShieldCheck, MessageCircle } from "lucide-react";

async function getFeatured() {
  try {
    const { data } = await api.get("/products?limit=8");
    return data.items || [];
  } catch {
    return [];
  }
}

async function getOccasions() {
  try {
    const { data } = await api.get("/categories");
    return (data || []).filter((c: any) => !c.parent && !c.isGiftType).slice(0, 8);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [products, occasions] = await Promise.all([getFeatured(), getOccasions()]);

  return (
    <div>
      <Hero />

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Gift, title: "Made to be opened", copy: "Every box is styled and wrapped by hand." },
          { icon: ShieldCheck, title: "Secure checkout", copy: "Paystack-protected payments, every time." },
          { icon: MessageCircle, title: "Real support", copy: "A gift specialist on WhatsApp, not a bot." },
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-brand-pink mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-brand-ink">{title}</p>
              <p className="text-[13px] text-[#8a7a7d] mt-0.5">{copy}</p>
            </div>
          </div>
        ))}
      </section>

      {occasions.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <h2 className="font-display text-[24px] text-brand-ink mb-6">Shop by occasion</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {occasions.map((o: any) => (
              <Link
                key={o._id}
                href={`/category/${o.slug}`}
                className="bg-white border border-brand-blush rounded-2xl px-4 py-6 text-center hover:border-brand-pink transition-colors"
              >
                <p className="text-[14px] font-medium text-brand-ink">{o.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 pb-16">
          <h2 className="font-display text-[24px] text-brand-ink mb-6">Popular right now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {products.map((p: any) => (
              <ProductCard
                key={p._id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                images={p.images}
                categoryName={p.categories?.[0]?.name}
              />
            ))}
          </div>
        </section>
      )}

      <BrandsMarquee />
      <ParallaxStory />
      <Stats />
      <Testimonials />
    </div>
  );
}
