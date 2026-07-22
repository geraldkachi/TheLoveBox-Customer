import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | The Love Box",
  robots: { index: false },
};

async function search(q: string) {
  try {
    const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
    return data as { products: any[]; categories: any[] };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() || "";
  const { products, categories } = q ? await search(q) : { products: [], categories: [] };
  const hasResults = products.length > 0 || categories.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-display text-[26px] text-brand-ink mb-1">
        {q ? `Results for "${q}"` : "Search"}
      </h1>
      <p className="text-[14px] text-[#8a7a7d] mb-10">
        {q ? `${products.length + categories.length} results found.` : "Search for a gift, occasion, or category."}
      </p>

      {q && !hasResults && (
        <p className="text-[14px] text-[#8a7a7d] py-16 text-center">
          Nothing matched "{q}" — try a different word, or browse{" "}
          <Link href="/categories" className="text-brand-pink font-medium">
            all categories
          </Link>
          .
        </p>
      )}

      {categories.length > 0 && (
        <div className="mb-10">
          <p className="text-[13px] uppercase tracking-wide text-brand-gold mb-3">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c: any) => (
              <Link
                key={c._id}
                href={`/category/${c.slug}`}
                className="text-[13.5px] text-brand-ink border border-brand-blush rounded-full px-4 py-2 hover:border-brand-pink hover:text-brand-pink transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div>
          <p className="text-[13px] uppercase tracking-wide text-brand-gold mb-4">Products</p>
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
        </div>
      )}
    </div>
  );
}
