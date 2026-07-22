"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { naira } from "@/lib/format";

interface Size {
  label: string;
  price: number;
}

export default function AddToCart({
  productId,
  name,
  image,
  basePrice,
  sizes,
}: {
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  sizes: Size[];
}) {
  const hasVariants = sizes && sizes.length > 0;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const router = useRouter();

  const price = hasVariants ? sizes[sizeIndex].price : basePrice;
  const sizeLabel = hasVariants ? sizes[sizeIndex].label : "Standard";

  const handleAdd = () => {
    add({ productId, name, image, size: sizeLabel, price, qty });
    router.push("/cart");
  };

  return (
    <div>
      {hasVariants && (
        <div className="mb-5">
          <p className="text-[13px] font-medium text-brand-ink mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSizeIndex(i)}
                className={`text-[13px] px-3.5 py-2 rounded-full border transition-colors ${
                  i === sizeIndex ? "border-brand-pink text-brand-pink bg-brand-blush" : "border-brand-blush text-brand-ink"
                }`}
              >
                {s.label} · {naira(s.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center border border-brand-blush rounded-full">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 text-brand-ink hover:bg-brand-blush rounded-full">
            −
          </button>
          <span className="w-9 text-center text-[14px]">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 text-brand-ink hover:bg-brand-blush rounded-full">
            +
          </button>
        </div>
        <span className="text-[20px] font-medium text-brand-ink">{naira(price * qty)}</span>
      </div>

      <button
        onClick={handleAdd}
        className="w-full bg-brand-pink text-white text-[15px] font-medium py-3.5 rounded-full hover:bg-brand-pinkDark active:scale-[0.99] transition-all"
      >
        Add to cart
      </button>
    </div>
  );
}
