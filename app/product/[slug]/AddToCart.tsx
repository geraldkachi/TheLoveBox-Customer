"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { useCartStore, useUI } from "@/lib/cartStore";
import { naira } from "@/lib/format";
import { toast } from "@/lib/toast";
import QtyStepper from "@/components/QtyStepper";

interface Size {
  label: string;
  price: number;
}

export default function AddToCart({
  productId, slug, name, image, basePrice, compareAtPrice, sizes, stock,
}: {
  productId: string; slug: string; name: string; image: string; basePrice: number; compareAtPrice?: number; sizes: Size[]; stock: number;
}) {
  const hasVariants = sizes?.length > 0;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const router = useRouter();

  const price = hasVariants ? sizes[sizeIndex].price : basePrice;
  const sizeLabel = hasVariants ? sizes[sizeIndex].label : "Standard";
  const soldOut = stock <= 0;

  const addItem = () => add({ productId, slug, name, image, size: sizeLabel, price, qty });

  const handleAdd = () => {
    addItem();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
    toast.success(`${qty} × ${name} added to your box`, { action: { label: "View cart", onClick: () => setCartOpen(true) } });
  };

  const buyNow = () => {
    addItem();
    router.push("/checkout");
  };

  return (
    <div>
      <div className="mb-7 flex items-baseline gap-3">
        <motion.span key={price * qty} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[30px] font-bold tracking-tight tabular-nums">
          {naira(price * qty)}
        </motion.span>
        {!!compareAtPrice && compareAtPrice > price && <span className="text-[17px] text-ink-muted line-through">{naira(compareAtPrice * qty)}</span>}
      </div>

      {hasVariants && (
        <fieldset className="mb-7">
          <legend className="mb-3 text-[15px] font-semibold">Choose a size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSizeIndex(i)}
                aria-pressed={i === sizeIndex}
                className={`relative rounded-2xl border px-4 py-3 text-left transition-colors ${i === sizeIndex ? "border-transparent text-white" : "border-line hover:border-ink/40"}`}
              >
                {i === sizeIndex && <motion.span layoutId="size-pill" className="absolute inset-0 -z-0 rounded-2xl bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                <span className="relative block text-[15px] font-semibold">{s.label}</span>
                <span className={`relative block text-[13.5px] tabular-nums ${i === sizeIndex ? "text-white/75" : "text-ink-muted"}`}>{naira(s.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, Math.min(99, q)))} />
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd} disabled={soldOut} className="btn-primary min-w-[200px] flex-1">
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span key="ok" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Added to your box
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> {soldOut ? "Sold out" : "Add to cart"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      {!soldOut && (
        <button onClick={buyNow} className="btn-dark mt-3 w-full">Buy now</button>
      )}
      {stock > 0 && stock <= 3 && <p className="mt-3 text-[14px] font-medium text-primary-700">Only {stock} left</p>}
    </div>
  );
}
