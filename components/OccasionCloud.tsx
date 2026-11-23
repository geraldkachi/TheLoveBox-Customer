import Link from "next/link";
import { Fragment } from "react";
import type { Category } from "@/lib/types";

/** Occasions set as one flowing line of large type — the list itself is the visual. */
export default function OccasionCloud({ occasions }: { occasions: Category[] }) {
  return (
    <p className="text-[clamp(1.6rem,3.6vw,2.9rem)] font-semibold leading-[1.25] tracking-[-0.03em] text-ink/85">
      {occasions.map((o, i) => (
        <Fragment key={o._id}>
        <span className="whitespace-nowrap">
          <Link href={`/category/${o.slug}`} className="rounded-lg transition-colors duration-200 hover:text-primary-600 focus-visible:text-primary-600 [text-decoration-thickness:3px] hover:underline underline-offset-[6px] decoration-gold-300">
            {o.name}
          </Link>
          {i < occasions.length - 1 && (
            <svg viewBox="0 0 20 20" className="mx-[0.35em] inline-block h-[0.42em] w-[0.42em] -translate-y-[0.12em] fill-gold-400" aria-hidden="true">
              <rect x="2" y="7" width="16" height="11" rx="1.5" />
              <rect x="1" y="4" width="18" height="4" rx="1" />
            </svg>
          )}
        </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}
