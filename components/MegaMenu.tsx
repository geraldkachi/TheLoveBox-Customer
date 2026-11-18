"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import type { Category } from "@/lib/types";

export default function MegaMenu({ categories, onNavigate }: { categories: Category[]; onNavigate: () => void }) {
  const occasions = categories.filter((c) => !c.parent && !c.isGiftType);
  const giftTypes = categories.filter((c) => c.isGiftType);
  const [activeId, setActiveId] = useState<string | null>(occasions[0]?._id || null);
  const active = occasions.find((o) => o._id === activeId);
  const subs = categories.filter((c) => c.parent && c.parent === activeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full border-t border-line bg-white shadow-float"
    >
      <div className="container-x grid grid-cols-12 gap-8 py-8">
        <div className="col-span-4 max-h-[420px] overflow-y-auto pr-2 no-scrollbar">
          <p className="mb-3 text-[13px] font-medium text-ink-muted">Occasions</p>
          <ul className="flex flex-col">
            {occasions.map((o) => (
              <li key={o._id}>
                <Link
                  href={`/category/${o.slug}`}
                  onMouseEnter={() => setActiveId(o._id)}
                  onFocus={() => setActiveId(o._id)}
                  onClick={onNavigate}
                  className={`relative flex items-center rounded-xl px-3 py-2 text-[15.5px] font-medium transition-colors ${activeId === o._id ? "text-ribbon-700" : "text-ink hover:text-ribbon-700"}`}
                >
                  {activeId === o._id && <motion.span layoutId="mega-hl" className="absolute inset-0 -z-10 rounded-xl bg-petal-100" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-5 border-l border-line pl-8">
          {active && (
            <motion.div key={active._id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <p className="mb-4 text-[22px] font-semibold tracking-tight">{active.name}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {subs.map((s) => (
                  <Link key={s._id} href={`/category/${s.slug}`} onClick={onNavigate} className="link-underline w-fit py-1.5 text-[15px] text-ink-soft hover:text-ink">
                    {s.name}
                  </Link>
                ))}
              </div>
              <Link href={`/category/${active.slug}`} onClick={onNavigate} className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-white hover:bg-ink-soft">
                Shop all {active.name.toLowerCase()}
              </Link>
            </motion.div>
          )}
        </div>

        <div className="col-span-3">
          <p className="mb-3 text-[13px] font-medium text-ink-muted">By gift type</p>
          <div className="flex flex-wrap gap-2">
            {giftTypes.slice(0, 14).map((g) => (
              <Link key={g._id} href={`/category/${g.slug}`} onClick={onNavigate} className="rounded-full border border-line px-3 py-1.5 text-[13.5px] hover:border-ribbon-500 hover:text-ribbon-700">
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
