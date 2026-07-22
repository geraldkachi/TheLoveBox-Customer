import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blogPosts";
import { ChevronRight, MessageCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Blog | The Love Box" };
  return {
    title: `${post.title} | The Love Box`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-center gap-1.5 text-[13px] text-[#8a7a7d] mb-6">
        <Link href="/">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-brand-ink font-medium truncate">{post.title}</span>
      </div>

      <p className="text-[11px] text-brand-gold uppercase tracking-wide mb-2">
        {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
      </p>
      <h1 className="font-display text-[30px] sm:text-[36px] text-brand-ink leading-tight mb-6">{post.title}</h1>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-brand-blush mb-8">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
      </div>

      <div className="flex flex-col gap-5">
        {post.body.map((para, i) => (
          <p key={i} className="text-[15.5px] text-[#5a4c4f] leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <div className="mt-10 bg-brand-blush/50 border border-brand-blush rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 text-brand-pink" />
        </div>
        <div>
          <p className="text-[14.5px] font-medium text-brand-ink mb-1">Have a question about this?</p>
          <p className="text-[13.5px] text-[#5a4c4f] leading-relaxed mb-3">
            Our team is happy to help you plan the details — reach out on WhatsApp or through our contact page.
          </p>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-medium text-white bg-brand-pink px-4 py-2 rounded-full hover:bg-brand-pinkDark transition-colors"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="text-[13px] font-medium text-brand-ink border border-brand-ink/20 px-4 py-2 rounded-full hover:border-brand-ink transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <p className="text-[13px] uppercase tracking-wide text-brand-gold mb-4">More from the journal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-blush mb-3">
                  <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-[15px] font-medium text-brand-ink leading-snug">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
