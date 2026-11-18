import { safeGet } from "@/lib/api";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import OccasionCloud from "@/components/OccasionCloud";
import ProductGrid from "@/components/ProductGrid";
import HowItWorks from "@/components/HowItWorks";
import CorporateBand from "@/components/CorporateBand";
import BrandsMarquee from "@/components/BrandsMarquee";
import Testimonials from "@/components/Testimonials";
import type { Category, Paginated, Product } from "@/lib/types";

export const revalidate = 120;

const empty = { items: [], total: 0, page: 1, pages: 1 };

export default async function Home() {
  const [latest, featured, categories] = await Promise.all([
    safeGet<Paginated<Product>>("/products?limit=8", empty),
    safeGet<Paginated<Product>>("/products?featured=true&limit=4", empty),
    safeGet<Category[]>("/categories", []),
  ]);
  const allOccasions = categories.filter((c) => !c.parent && !c.isGiftType);
  const occasions = allOccasions.slice(0, 14);

  return (
    <>
      <Hero occasions={allOccasions} />

      {occasions.length > 0 && (
        <section className="container-x py-16">
          <SectionHeader title="Shop by occasion" href="/categories" linkLabel="All occasions" />
          <OccasionCloud occasions={occasions} />
        </section>
      )}

      {featured.items.length > 0 && (
        <section className="container-x py-12">
          <SectionHeader title="Our curator's picks" sub="The boxes we'd send to our own people this week." href="/search?featured=true" />
          <ProductGrid products={featured.items} priorityCount={4} />
        </section>
      )}

      <section className="container-x py-12">
        <SectionHeader title="Popular right now" href="/categories" linkLabel="Shop everything" />
        {latest.items.length > 0 ? (
          <ProductGrid products={latest.items} priorityCount={featured.items.length ? 0 : 4} />
        ) : (
          <div className="rounded-[24px] bg-petal-50 px-6 py-16 text-center">
            <p className="text-[18px] font-semibold">New boxes are on their way</p>
            <p className="mt-1 text-[15px] text-ink-muted">Our catalogue is being refreshed. Message us on WhatsApp to order today.</p>
          </div>
        )}
      </section>

      <div className="mt-12">
        <HowItWorks />
      </div>
      <div className="py-16">
        <CorporateBand />
      </div>
      <BrandsMarquee />
      <Testimonials />
    </>
  );
}
