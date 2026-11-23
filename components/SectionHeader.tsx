import Link from "next/link";

export default function SectionHeader({ title, sub, href, linkLabel = "See all" }: { title: string; sub?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <h2 className="text-h2 font-bold">{title}</h2>
        {sub && <p className="mt-2 max-w-xl text-[16px] text-ink-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="link-underline shrink-0 pb-1 text-[15px] font-semibold text-ink-soft hover:text-ink">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
