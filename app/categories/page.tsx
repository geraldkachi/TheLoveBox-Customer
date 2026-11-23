import Link from "next/link";
import type { Metadata } from "next";
import { safeGet } from "@/lib/api";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "All occasions & gift types",
  description: "Browse every gifting occasion and gift type at The Love Box, Lagos.",
  alternates: { canonical: "/categories" },
};
export const revalidate = 120;

export default async function CategoriesPage() {
  const categories = await safeGet<Category[]>("/categories", []);
  const occasions = categories.filter((c) => !c.parent && !c.isGiftType);
  const giftTypes = categories.filter((c) => c.isGiftType);
  const subsOf = (id: string) => categories.filter((c) => c.parent === id);

  return (
    <div className="container-x py-12">
      <h1 className="text-display font-bold">What are we celebrating?</h1>
      <p className="mt-4 max-w-xl text-[17px] text-ink-soft">Start with the occasion, or jump straight to the kind of gift you have in mind.</p>

      {giftTypes.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-[20px] font-semibold tracking-tight">By gift type</h2>
          <div className="flex flex-wrap gap-2">
            {giftTypes.map((c) => (
              <Link key={c._id} href={`/category/${c.slug}`} className="rounded-full bg-cream-100 px-4 py-2.5 text-[15px] font-medium transition hover:bg-primary-600 hover:text-white">
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="mb-6 text-[20px] font-semibold tracking-tight">By occasion</h2>
        {occasions.length === 0 ? (
          <p className="text-ink-muted">Categories couldn't be loaded. Please refresh the page.</p>
        ) : (
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map((o) => (
              <div key={o._id} className="border-t-2 border-ink pt-4">
                <Link href={`/category/${o.slug}`} className="text-[22px] font-semibold tracking-tight hover:text-primary-600">{o.name}</Link>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {subsOf(o._id).slice(0, 8).map((s) => (
                    <li key={s._id}>
                      <Link href={`/category/${s.slug}`} className="link-underline text-[15px] text-ink-soft hover:text-ink">{s.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
