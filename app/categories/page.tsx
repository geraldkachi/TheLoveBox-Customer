import Link from "next/link";
import { api } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Categories | The Love Box",
  description: "Browse every gifting occasion and category at The Love Box, Lagos.",
  alternates: { canonical: "/categories" },
};

async function getCategories() {
  try {
    const { data } = await api.get("/categories");
    return data || [];
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  const occasions = categories?.filter((c: any) => !c.parent && !c.isGiftType);
  const giftTypes = categories?.filter((c: any) => c.isGiftType);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="font-display text-[30px] text-brand-ink mb-1">All categories</h1>
      <p className="text-[14px] text-[#8a7a7d] mb-10">Shop by occasion, or filter by the type of gift.</p>

      <p className="text-[13px] uppercase tracking-wide text-brand-gold mb-4">By occasion</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {occasions.map((c: any) => (
          <Link
            key={c._id}
            href={`/category/${c.slug}`}
            className="bg-white border border-brand-blush rounded-2xl px-4 py-6 text-center hover:border-brand-pink transition-colors"
          >
            <p className="text-[14px] font-medium text-brand-ink">{c.name}</p>
          </Link>
        ))}
      </div>

      {giftTypes.length > 0 && (
        <>
          <p className="text-[13px] uppercase tracking-wide text-brand-gold mb-4">By gift type</p>
          <div className="flex flex-wrap gap-2">
            {giftTypes.map((c: any) => (
              <Link
                key={c._id}
                href={`/category/${c.slug}`}
                className="text-[13.5px] text-brand-ink border border-brand-blush rounded-full px-4 py-2 hover:border-brand-pink hover:text-brand-pink transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
