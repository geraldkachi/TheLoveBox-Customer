import Link from "next/link";

export default function Pagination({ page, pages, buildHref }: { page: number; pages: number; buildHref: (p: number) => string }) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pages" className="mt-14 flex items-center justify-center gap-2">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={buildHref(p)} aria-current={p === page ? "page" : undefined} className={`grid h-10 w-10 place-items-center rounded-full text-[14px] font-semibold ${p === page ? "bg-ink text-white" : "hover:bg-petal-100"}`}>
          {p}
        </Link>
      ))}
    </nav>
  );
}
