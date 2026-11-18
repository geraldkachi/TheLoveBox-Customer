import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Truck, PenLine, ShieldCheck } from "lucide-react";
import { api, safeGet } from "@/lib/api";
import ProductGallery from "./ProductGallery";
import AddToCart from "./AddToCart";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductGrid from "@/components/ProductGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import Accordion from "@/components/Accordion";
import type { Product } from "@/lib/types";

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data } = await api.get(`/products/${encodeURIComponent(slug)}`);
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Gift not found" };
  const description = product.description?.slice(0, 155) || `Send ${product.name} anywhere in Lagos, same day, with The Love Box.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description, images: product.images?.[0] ? [product.images[0]] : [], type: "website" },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await safeGet<Product[]>(`/products/${encodeURIComponent(slug)}/related`, []);
  const primary = product.categories?.[0];

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
    <div className="container-x py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, ...(primary ? [{ label: primary.name, href: `/category/${primary.slug}` }] : []), { label: product.name }]} />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images || []} videos={product.videos || []} name={product.name} />

        <div className="lg:pt-4">
          {!!product.categories?.length && (
            <div className="mb-4 flex flex-wrap gap-2">
              {product.categories.map((c) => (
                <Link key={c._id} href={`/category/${c.slug}`} className="rounded-full bg-petal-100 px-3 py-1 text-[13.5px] font-medium text-ink-soft hover:bg-petal-200">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-h1 font-bold">{product.name}</h1>
          <div className="mt-6">
            <AddToCart
              productId={product._id}
              slug={product.slug}
              name={product.name}
              image={product.images?.[0] || ""}
              basePrice={product.price}
              compareAtPrice={product.compareAtPrice}
              sizes={product.sizes || []}
              stock={product.stock}
            />
          </div>
          <div className="mt-3">
            <WhatsAppButton message={`Hi The Love Box! I'd like to ask about "${product.name}" before I order.`} />
          </div>

          <ul className="mt-8 grid gap-4 rounded-[24px] bg-petal-50 p-6 text-[14.5px] sm:grid-cols-3 sm:gap-3">
            <li className="flex gap-2.5 sm:flex-col"><Truck className="h-5 w-5 shrink-0 text-ribbon-600" />Same-day delivery in Lagos before 3pm</li>
            <li className="flex gap-2.5 sm:flex-col"><PenLine className="h-5 w-5 shrink-0 text-ribbon-600" />Free handwritten card</li>
            <li className="flex gap-2.5 sm:flex-col"><ShieldCheck className="h-5 w-5 shrink-0 text-ribbon-600" />Secure payment with Paystack</li>
          </ul>

          <div className="mt-8">
            <Accordion
              defaultOpen={product.description ? 0 : null}
              items={[
                ...(product.description ? [{ q: "About this gift", a: <p className="whitespace-pre-line">{product.description}</p> }] : []),
                { q: "Delivery", a: "Order before 3pm for same-day delivery anywhere in Lagos. Later orders go out first thing the next morning, or on the date you choose at checkout. Free delivery on orders over ₦100,000." },
                { q: "Personalising your gift", a: "Add your card message at checkout. For a different colour palette, extra items or a specific delivery time, message us on WhatsApp before your order ships." },
              ]}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-h2 font-bold">Pairs well with</h2>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
