import type { CustomBox } from "@/lib/cartStore";

/** One-line list of what's inside a curated box (cart, drawer, checkout). */
export default function CustomBoxSummary({ box, className = "" }: { box: CustomBox; className?: string }) {
  const parts = [...box.items, ...box.extras].map((p) => (p.qty > 1 ? `${p.name} ×${p.qty}` : p.name));
  return <p className={`line-clamp-2 text-[13px] text-ink-muted ${className}`}>{parts.join(", ")}</p>;
}
