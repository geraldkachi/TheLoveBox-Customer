import Link from "next/link";
import { api } from "@/lib/api";
import ProductGallery from "./ProductGallery";
import AddToCart from "./AddToCart";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

async function getProduct(slug: string) {
  try {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  } catch {
    return null;
  }
}

async function getRelated(slug: string) {
  try {
    const { data } = await api.get(`/products/${slug}/related`);
    return data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; // ✅ Await params
  const product = await getProduct(slug);
  // const product = await getProduct(params.slug);
  if (!product) return { title: "Product | The Love Box" };
  const description = product.description?.slice(0, 155) || `Shop ${product.name} at The Love Box, Lagos.`;
  return {
    title: `${product.name} | The Love Box`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.images?.[0] ? [product.images[0]] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ Await params
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelated(slug);

  const whatsappMessage = `Hi The Love Box! I'd like to ask about "${product.name}" before I order.`;
  const primaryCategory = product.categories?.[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-1.5 text-[13px] text-[#8a7a7d] mb-6 flex-wrap">
        <Link href="/">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {primaryCategory && (
          <>
            <Link href={`/category/${primaryCategory.slug}`}>{primaryCategory.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-brand-ink font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} videos={product.videos || []} name={product.name} />

        <div>
          {product.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.categories.map((c: any) => (
                <Link
                  key={c._id}
                  href={`/category/${c.slug}`}
                  className="text-[11px] uppercase tracking-wide text-brand-gold border border-[#e9dcb8] bg-[#FBF6E9] px-2 py-0.5 rounded-full hover:bg-brand-gold hover:text-white transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          <h1 className="font-display text-[28px] text-brand-ink mb-3">{product.name}</h1>
          {product.description && (
            <p className="text-[14px] text-[#5a4c4f] leading-relaxed mb-6 whitespace-pre-line">
              {product.description}
            </p>
          )}

          <AddToCart
            productId={product._id}
            name={product.name}
            image={product.images?.[0] || ""}
            basePrice={product.price}
            sizes={product.sizes || []}
          />

          <div className="mt-4">
            <WhatsAppButton message={whatsappMessage} />
          </div>

          <p className="text-[12.5px] text-[#8a7a7d] mt-4 leading-relaxed">
            Need changes to this gift, a different message on the card, or a specific delivery time? Message us on
            WhatsApp and we'll sort it before your order ships.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-[24px] text-brand-ink mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {related.map((p: any) => (
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
    </div>
  );
}
