import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { safeGet } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import type { Category, Paginated, Product } from "@/lib/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string; page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await safeGet<Category[]>("/categories", []);
  const c = categories.find((x) => x.slug === slug);
  return {
    title: c ? `${c.name} gifts` : "Shop",
    description: c ? `${c.name} gifts, flowers and hampers, delivered same-day across Lagos by The Love Box.` : "Thoughtful gifts delivered same-day across Lagos.",
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const categories = await safeGet<Category[]>("/categories", []);
  const category = categories.find((c) => c.slug === slug);
  if (!category && categories.length) notFound();

  const parent = category?.parent ? categories.find((c) => c._id === category.parent) : null;
  const groupId = category?.parent || category?._id;
  const siblings = categories.filter((c) => c.parent && c.parent === groupId);
  const page = Math.max(1, Number(sp.page) || 1);
  const sort = ["newest", "price_asc", "price_desc", "name"].includes(sp.sort || "") ? sp.sort : "newest";
  const data = category
    ? await safeGet<Paginated<Product>>(`/products?${category.isGiftType ? "giftType" : "category"}=${category._id}&limit=24&page=${page}&sort=${sort}`, { items: [], total: 0, page: 1, pages: 1 })
    : { items: [], total: 0, page: 1, pages: 1 };

  // Gift types may be attached via categories too — fall back if giftType filter is empty
  let products = data;
  if (category?.isGiftType && data.total === 0) {
    products = await safeGet<Paginated<Product>>(`/products?category=${category._id}&limit=24&page=${page}&sort=${sort}`, data);
  }

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All gifts", href: "/categories" }, ...(parent ? [{ label: parent.name, href: `/category/${parent.slug}` }] : []), { label: category?.name || "Shop" }]} />

      <div className="mb-8 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-display font-bold">{category?.name || "Shop"}</h1>
          <p className="mt-3 text-[16px] text-ink-muted">
            {products.total} {products.total === 1 ? "gift" : "gifts"}, ready for same-day delivery
          </p>
        </div>
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>

      {siblings.length > 0 && (
        <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          {parent || category ? (
            <Link href={`/category/${(parent || category)!.slug}`} className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium ${!category?.parent ? "bg-ink text-white" : "bg-cream-100 hover:bg-cream-200"}`}>
              All
            </Link>
          ) : null}
          {siblings.map((s) => (
            <Link key={s._id} href={`/category/${s.slug}`} className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium ${s._id === category?._id ? "bg-ink text-white" : "bg-cream-100 hover:bg-cream-200"}`}>
              {s.name}
            </Link>
          ))}
        </div>
      )}

      {products.items.length === 0 ? (
        <div className="rounded-[28px] bg-cream-50 px-6 py-20 text-center">
          <p className="text-[20px] font-semibold tracking-tight">Nothing here yet</p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-muted">We're curating new {category?.name.toLowerCase()} gifts. In the meantime, browse another occasion or ask us for something custom.</p>
          <Link href="/categories" className="btn-dark mt-6">See all occasions</Link>
        </div>
      ) : (
        <>
          <ProductGrid products={products.items} priorityCount={4} />
          <Pagination page={products.page} pages={products.pages} buildHref={(p) => `/category/${slug}?page=${p}${sort !== "newest" ? `&sort=${sort}` : ""}`} />
        </>
      )}
    </div>
  );
}
