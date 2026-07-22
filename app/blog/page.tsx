import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog | The Love Box",
  description: "Gifting ideas, occasion guides and stories from The Love Box team in Lagos.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="font-display text-[32px] text-brand-ink mb-1">The Love Box journal</h1>
      <p className="text-[14px] text-[#8a7a7d] mb-10">Gifting ideas and occasion guides from our team.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {blogPosts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-blush mb-3">
              <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <p className="text-[11px] text-brand-gold uppercase tracking-wide mb-1">
              {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <p className="text-[16px] font-medium text-brand-ink leading-snug mb-1">{p.title}</p>
            <p className="text-[13.5px] text-[#8a7a7d] leading-relaxed">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
