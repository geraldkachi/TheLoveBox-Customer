"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { naira } from "@/lib/format";

interface Props {
  slug: string;
  name: string;
  price: number;
  images: string[];
  categoryName?: string;
}

export default function ProductCard({ slug, name, price, images, categoryName }: Props) {
  const [hoverIndex, setHoverIndex] = useState(0);
  const gallery = images.length ? images : ["/placeholder-gift.jpg"];

  return (
    <Link
      href={`/product/${slug}`}
      className="group block"
      onMouseEnter={() => setHoverIndex(1 % gallery.length)}
      onMouseLeave={() => setHoverIndex(0)}
    >
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-brand-blush">
        {gallery.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(${(i - hoverIndex) * 100}%)`,
            }}
          />
        ))}
      </div>
      <div className="pt-3">
        {categoryName && <p className="text-[11px] uppercase tracking-wide text-brand-gold mb-0.5">{categoryName}</p>}
        <p className="text-[14px] text-brand-ink font-medium truncate">{name}</p>
        <p className="text-[13.5px] text-[#8a7a7d] mt-0.5">{naira(price)}</p>
      </div>
    </Link>
  );
}
