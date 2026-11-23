import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blogPosts";
import { shortDate, whatsappLink } from "@/lib/format";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Journal" };
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { title: post.title, description: post.excerpt, images: [post.image] } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="container-x py-10">
      <div className="mx-auto max-w-[44rem]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/blog" }, { label: post.title }]} />
        <p className="mb-3 text-[14px] text-ink-muted">{shortDate(post.date)}</p>
        <h1 className="text-h1 font-bold">{post.title}</h1>
      </div>
      <div className="relative mx-auto my-10 aspect-[16/8] max-w-5xl overflow-hidden rounded-[28px] bg-cream-100">
        <Image src={post.image} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="mx-auto flex max-w-[40rem] flex-col gap-6 text-[17.5px] leading-[1.75] text-ink-soft">
        {post.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      <div className="mx-auto mt-12 max-w-[40rem] rounded-[24px] bg-cream-100 p-7">
        <p className="text-[18px] font-semibold tracking-tight">Planning something like this?</p>
        <p className="mt-1 text-[15.5px] text-ink-soft">Tell us what you have in mind and we'll put a box together around it.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={whatsappLink(`Hi! I just read "${post.title}" and need help planning a gift.`)} target="_blank" rel="noreferrer" className="btn-primary py-3">Chat on WhatsApp</a>
          <Link href="/categories" className="btn-ghost py-3">Browse gifts</Link>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mx-auto mt-20 max-w-5xl">
          <h2 className="mb-6 text-[22px] font-semibold tracking-tight">Keep reading</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[22px] bg-cream-100">
                  <Image src={p.image} alt="" fill sizes="50vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="text-[18px] font-semibold tracking-tight group-hover:text-primary-700">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
