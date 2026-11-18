import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blogPosts";
import { shortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Journal",
  description: "Gifting ideas and occasion guides from The Love Box team in Lagos.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const [lead, ...rest] = blogPosts;
  return (
    <div className="container-x py-14">
      <h1 className="mb-12 text-display font-bold">The journal</h1>
      {lead && (
        <Link href={`/blog/${lead.slug}`} className="group mb-16 grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-petal-100">
            <Image src={lead.image} alt="" fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
          </div>
          <div>
            <p className="mb-3 text-[14px] text-ink-muted">{shortDate(lead.date)}</p>
            <h2 className="text-h2 font-bold group-hover:text-ribbon-700">{lead.title}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{lead.excerpt}</p>
          </div>
        </Link>
      )}
      <div className="grid gap-10 sm:grid-cols-2">
        {rest.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
            <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[24px] bg-petal-100">
              <Image src={p.image} alt="" fill sizes="(max-width:640px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
            </div>
            <p className="mb-2 text-[14px] text-ink-muted">{shortDate(p.date)}</p>
            <h2 className="text-[22px] font-semibold leading-snug tracking-tight group-hover:text-ribbon-700">{p.title}</h2>
            <p className="mt-2 text-[15.5px] text-ink-soft">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
