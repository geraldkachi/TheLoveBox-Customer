"use client";
import { brand } from "@/lib/brand";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Props {
  images: string[];
  videos: string[];
  name: string;
}

export default function ProductGallery({ images, videos, name }: Props) {
  const media = [...images.map((src) => ({ type: "image" as const, src })), ...videos.map((src) => ({ type: "video" as const, src }))];
  const [[active, dir], setActive] = useState<[number, number]>([0, 0]);
  const go = (i: number) => setActive([(i + media.length) % media.length, i > active ? 1 : -1]);

  if (!media.length) {
    return (
      <div className="grid aspect-[4/5] place-items-center rounded-[28px] bg-cream-100">
        <Image src={brand.logoMark} alt="" width={90} height={100} className="opacity-40" />
      </div>
    );
  }
  const current = media[active];

  return (
    <div className="lg:sticky lg:top-28">
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-cream-100">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={active}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            drag={media.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(active + 1);
              else if (info.offset.x > 60) go(active - 1);
            }}
          >
            {current.type === "video" ? (
              <video src={current.src} controls playsInline className="h-full w-full object-cover" />
            ) : (
              <Image src={current.src} alt={name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" draggable={false} />
            )}
          </motion.div>
        </AnimatePresence>

        {media.length > 1 && (
          <>
            <button onClick={() => go(active - 1)} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-lift transition group-hover:opacity-100 focus-visible:opacity-100" aria-label="Previous image">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(active + 1)} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-lift transition group-hover:opacity-100 focus-visible:opacity-100" aria-label="Next image">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1 text-[12.5px] font-medium text-white tabular-nums">
              {active + 1} / {media.length}
            </span>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {media.map((m, i) => (
            <button key={m.src + i} onClick={() => go(i)} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100" aria-label={`Show ${m.type} ${i + 1}`}>
              {m.type === "video" ? (
                <span className="grid h-full w-full place-items-center bg-ink/80"><Play className="h-5 w-5 fill-white text-white" /></span>
              ) : (
                <Image src={m.src} alt="" fill sizes="64px" className="object-cover" />
              )}
              {i === active && <motion.span layoutId="thumb-ring" className="absolute inset-0 rounded-xl ring-2 ring-inset ring-primary-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
