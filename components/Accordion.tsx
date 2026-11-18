"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

export interface AccordionItem {
  q: string;
  a: React.ReactNode;
}

export default function Accordion({ items, defaultOpen = null }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-5 text-left">
              <span className="text-[16.5px] font-semibold tracking-tight">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isOpen ? "bg-ribbon-600 text-white" : "bg-petal-100"}`}>
                <Plus className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <div className="max-w-[65ch] pb-6 text-[15.5px] leading-relaxed text-ink-soft">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
