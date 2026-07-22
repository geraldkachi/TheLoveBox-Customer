// import Link from "next/link";
// import { api } from "@/lib/api";
// import ProductCard from "@/components/ProductCard";
// import type { Metadata } from "next";
// import { ChevronRight } from "lucide-react";

// async function getCategories() {
//   try {
//     const { data } = await api.get("/categories");
//     return data || [];
//   } catch {
//     return [];
//   }
// }

// async function getProducts(categoryId: string) {
//   try {
//     const { data } = await api.get(`/products?category=${categoryId}&limit=48`);
//     return data.items || [];
//   } catch {
//     return [];
//   }
// }

// export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
//   const categories = await getCategories();
//   const category = categories.find((c: any) => c.slug === params.slug);
//   return {
//     title: category ? `${category.name} Gifts | The Love Box` : "Shop | The Love Box",
//     description: category
//       ? `Shop ${category.name.toLowerCase()} gifts, flowers and hampers, delivered same-day across Lagos by The Love Box.`
//       : "Shop thoughtful gifts delivered same-day across Lagos.",
//     alternates: { canonical: `/category/${params.slug}` },
//   };
// }

// export default async function CategoryPage({ params }: { params: { slug: string } }) {
//   const categories = await getCategories();
//   const category = categories.find((c: any) => c.slug === params.slug);
//   const parent = category?.parent ? categories.find((c: any) => c._id === category.parent) : null;
//   const siblings = category && !category.parent ? categories.filter((c: any) => c.parent === category._id) : [];
//   const products = category ? await getProducts(category._id) : [];

//   return (
//     <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
//       <div className="flex items-center gap-1.5 text-[13px] text-[#8a7a7d] mb-6 flex-wrap">
//         <Link href="/">Home</Link>
//         <ChevronRight className="w-3.5 h-3.5" />
//         {parent && (
//           <>
//             <Link href={`/category/${parent.slug}`}>{parent.name}</Link>
//             <ChevronRight className="w-3.5 h-3.5" />
//           </>
//         )}
//         <span className="text-brand-ink font-medium">{category?.name || "Shop"}</span>
//       </div>

//       <h1 className="font-display text-[28px] text-brand-ink mb-1">{category?.name || "Shop"}</h1>
//       <p className="text-[14px] text-[#8a7a7d] mb-6">{products.length} gifts curated for this occasion.</p>

//       {siblings.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-8">
//           {siblings.map((s: any) => (
//             <Link
//               key={s._id}
//               href={`/category/${s.slug}`}
//               className="text-[13px] text-brand-ink border border-brand-blush rounded-full px-3.5 py-1.5 hover:border-brand-pink hover:text-brand-pink transition-colors"
//             >
//               {s.name}
//             </Link>
//           ))}
//         </div>
//       )}

//       {products.length === 0 ? (
//         <p className="text-[14px] text-[#8a7a7d] py-16 text-center">
//           Nothing here yet — check back soon or explore another occasion.
//         </p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
//           {products.map((p: any) => (
//             <ProductCard
//               key={p._id}
//               slug={p.slug}
//               name={p.name}
//               price={p.price}
//               images={p.images}
//               categoryName={p.categories?.[0]?.name}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

async function getCategories() {
  try {
    const { data } = await api.get("/categories");
    return data || [];
  } catch {
    return [];
  }
}

async function getProducts(categoryId: string) {
  try {
    const { data } = await api.get(`/products?category=${categoryId}&limit=48`);
    return data.items || [];
  } catch {
    return [];
  }
}

// ✅ FIX: params is now a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; // ✅ Await params
  const categories = await getCategories();
  const category = categories.find((c: any) => c.slug === slug);
  return {
    title: category ? `${category.name} Gifts | The Love Box` : "Shop | The Love Box",
    description: category
      ? `Shop ${category.name.toLowerCase()} gifts, flowers and hampers, delivered same-day across Lagos by The Love Box.`
      : "Shop thoughtful gifts delivered same-day across Lagos.",
    alternates: { canonical: `/category/${slug}` },
  };
}

// ✅ FIX: params is now a Promise
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ Await params
  const categories = await getCategories();
  const category = categories.find((c: any) => c.slug === slug);
  const parent = category?.parent ? categories.find((c: any) => c._id === category.parent) : null;
  const siblings = category && !category.parent ? categories.filter((c: any) => c.parent === category._id) : [];
  const products = category ? await getProducts(category._id) : [];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-center gap-1.5 text-[13px] text-[#8a7a7d] mb-6 flex-wrap">
        <Link href="/">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {parent && (
          <>
            <Link href={`/category/${parent.slug}`}>{parent.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-brand-ink font-medium">{category?.name || "Shop"}</span>
      </div>

      <h1 className="font-display text-[28px] text-brand-ink mb-1">{category?.name || "Shop"}</h1>
      <p className="text-[14px] text-[#8a7a7d] mb-6">{products.length} gifts curated for this occasion.</p>

      {siblings.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {siblings.map((s: any) => (
            <Link
              key={s._id}
              href={`/category/${s.slug}`}
              className="text-[13px] text-brand-ink border border-brand-blush rounded-full px-3.5 py-1.5 hover:border-brand-pink hover:text-brand-pink transition-colors"
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-[14px] text-[#8a7a7d] py-16 text-center">
          Nothing here yet — check back soon or explore another occasion.
        </p>
      ) : (
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
      )}
    </div>
  );
}