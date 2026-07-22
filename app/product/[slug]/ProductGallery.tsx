"use client";
import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

interface Props {
  images: string[];
  videos: string[];
  name: string;
}

export default function ProductGallery({ images, videos, name }: Props) {
  const media = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...videos.map((src) => ({ type: "video" as const, src })),
  ];
  const gallery = media.length ? media : [{ type: "image" as const, src: "/placeholder-gift.jpg" }];
  const [active, setActive] = useState(0);
  const current = gallery[active];

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-blush mb-3">
        {current.type === "video" ? (
          <video src={current.src} controls className="w-full h-full object-cover" />
        ) : (
          <Image src={current.src} alt={name} fill className="object-cover" priority />
        )}
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {gallery.map((item, i) => (
            <button
              key={item.src + i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border shrink-0 ${
                active === i ? "border-brand-pink" : "border-transparent"
              }`}
            >
              {item.type === "video" ? (
                <>
                  <video src={item.src} className="w-full h-full object-cover" muted />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </span>
                </>
              ) : (
                <Image src={item.src} alt="" fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
