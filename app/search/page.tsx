import Link from "next/link";
import type { Metadata } from "next";
import { safeGet } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import type { Category, Paginated, Product } from "@/lib/types";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

type SP = { q?: string; occasion?: string; min?: string; max?: string; featured?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || "";
  const filtered = !!(sp.occasion || sp.min || sp.max || sp.featured);

  let products: Product[] = [];
  let categories: Category[] = [];

  if (filtered) {
    const params = new URLSearchParams({ limit: "48" });
    if (q) params.set("search", q);
    if (sp.occasion) params.set("category", sp.occasion);
    if (sp.min) params.set("minPrice", sp.min);
    if (sp.max) params.set("maxPrice", sp.max);
    if (sp.featured) params.set("featured", "true");
    products = (await safeGet<Paginated<Product>>(`/products?${params}`, { items: [], total: 0, page: 1, pages: 1 })).items;
  } else if (q) {
    const r = await safeGet<{ products: Product[]; categories: Category[] }>(`/search?q=${encodeURIComponent(q)}`, { products: [], categories: [] });
    products = r.products;
    categories = r.categories;
  }

  const allCats = sp.occasion ? await safeGet<Category[]>("/categories", []) : [];
  const occasionName = allCats.find((c) => c._id === sp.occasion)?.name;
  const title = sp.featured ? "Curator's picks" : q ? `“${q}”` : occasionName ? `${occasionName} gifts` : "Search";
  const count = products.length;

  return (
    <div className="container-x py-12">
      <p className="mb-2 text-[15px] text-ink-muted">{count} {count === 1 ? "result" : "results"}{(sp.min || sp.max) && " in your budget"}</p>
      <h1 className="mb-10 text-h1 font-bold">{title}</h1>

      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c._id} href={`/category/${c.slug}`} className="rounded-full bg-cream-100 px-4 py-2 text-[14.5px] font-medium hover:bg-cream-200">{c.name}</Link>
          ))}
        </div>
      )}

      {count === 0 ? (
        <div className="rounded-[28px] bg-cream-50 px-6 py-20 text-center">
          <p className="text-[20px] font-semibold tracking-tight">{q || filtered ? "No gifts match that search" : "Search for a gift"}</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-muted">Try a broader word like “flowers” or “hamper”, widen your budget, or browse by occasion.</p>
          <Link href="/categories" className="btn-dark mt-6">Browse occasions</Link>
        </div>
      ) : (
        <ProductGrid products={products} priorityCount={4} />
      )}
    </div>
  );
}
