"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { naira } from "@/lib/format";
import { useCartStore, useUI } from "@/lib/cartStore";
import { toast } from "@/lib/toast";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product: p, priority }: Props) {
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const img = p.images?.[0];
  const img2 = p.images?.[1];
  const hasSizes = !!p.sizes?.length;
  const fromPrice = hasSizes ? Math.min(...p.sizes!.map((s) => s.price)) : p.price;
  const onSale = !!p.compareAtPrice && p.compareAtPrice > p.price;
  const soldOut = p.stock <= 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({ productId: p._id, slug: p.slug, name: p.name, image: img || "", size: "Standard", price: p.price, qty: 1 });
    toast.success(`${p.name} added to your box`, { action: { label: "View cart", onClick: () => setCartOpen(true) } });
  };

  return (
    <Link href={`/product/${p.slug}`} className="group block focus-visible:outline-offset-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-petal-100">
        {img ? (
          <>
            <Image src={img} alt={p.name} fill priority={priority} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
            {img2 && <Image src={img2} alt="" fill sizes="25vw" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
          </>
        ) : (
          <div className="grid h-full place-items-center">
            <Image src="/brand/logo-mark.png" alt="" width={56} height={62} className="opacity-40" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-1.5">
          {onSale && <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-ribbon-700">Sale</span>}
          {soldOut && <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[12px] font-semibold text-white">Sold out</span>}
        </div>

        {!soldOut &&
          (hasSizes ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-semibold opacity-0 shadow-lift transition group-hover:opacity-100 max-sm:opacity-100">
              Choose size
            </span>
          ) : (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={quickAdd}
              aria-label={`Add ${p.name} to cart`}
              className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-lift transition hover:bg-ribbon-600 hover:text-white sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          ))}
      </div>
      <div className="px-1 pt-3.5">
        {p.categories?.[0] && <p className="mb-0.5 text-[13px] text-ink-muted">{p.categories[0].name}</p>}
        <p className="line-clamp-1 text-[16px] font-semibold tracking-tight">{p.name}</p>
        <p className="mt-1 flex items-baseline gap-2 text-[15px] tabular-nums">
          <span className="font-medium">{hasSizes && "From "}{naira(fromPrice)}</span>
          {onSale && <span className="text-[13.5px] text-ink-muted line-through">{naira(p.compareAtPrice!)}</span>}
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-[20px] bg-petal-100" />
      <div className="mt-4 h-3 w-1/3 rounded bg-petal-100" />
      <div className="mt-2 h-4 w-3/4 rounded bg-petal-100" />
      <div className="mt-2 h-4 w-1/4 rounded bg-petal-100" />
    </div>
  );
}
