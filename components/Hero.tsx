"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, Star, Truck, ChevronDown } from "lucide-react";
import type { Category } from "@/lib/types";

const TAG_NOTES = [
  "Happy birthday, Tolu. Love always, Ada",
  "For the best mum in Lagos",
  "Congrats on the new job, Kemi!",
  "Thank you for everything, team",
  "Still choosing you. Happy anniversary",
];

const BUDGETS = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under ₦25k", min: "", max: "25000" },
  { label: "₦25k – ₦75k", min: "25000", max: "75000" },
  { label: "₦75k – ₦150k", min: "75000", max: "150000" },
  { label: "Over ₦150k", min: "150000", max: "" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function SelectShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      {children}
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
    </label>
  );
}

export default function Hero({ occasions = [] }: { occasions?: Category[] }) {
  const router = useRouter();
  const [occasion, setOccasion] = useState("");
  const [q, setQ] = useState("");
  const [budget, setBudget] = useState(0);
  const [note, setNote] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNote((n) => (n + 1) % TAG_NOTES.length), 4200);
    return () => clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = BUDGETS[budget];
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (occasion) params.set("occasion", occasion);
    if (b.min) params.set("min", b.min);
    if (b.max) params.set("max", b.max);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-16">
        {/* Copy + search */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-display font-bold"
          >
            Gifts that arrive before the moment passes.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft"
          >
            Flowers, hampers and curated boxes, styled by hand in Yaba and delivered across Lagos the same day you order.
          </motion.p>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mt-9 grid gap-2.5 rounded-[24px] bg-cream-100 p-2.5 sm:grid-cols-[1fr_1.3fr] lg:max-w-[38rem]"
          >
            <SelectShell label="Occasion">
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="h-[52px] w-full appearance-none rounded-2xl bg-white pl-4 pr-10 text-[15px] outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Any occasion</option>
                {occasions.map((o) => (
                  <option key={o._id} value={o._id}>{o.name}</option>
                ))}
              </select>
            </SelectShell>
            <label className="relative block">
              <span className="sr-only">What are you looking for?</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Roses, cake, hamper…"
                className="h-[52px] w-full rounded-2xl bg-white pl-10 pr-4 text-[15px] outline-none placeholder:text-ink-muted/80 focus:ring-2 focus:ring-primary-500"
              />
            </label>
            <SelectShell label="Budget">
              <select value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="h-[52px] w-full appearance-none rounded-2xl bg-white pl-4 pr-10 text-[15px] outline-none focus:ring-2 focus:ring-primary-500">
                {BUDGETS.map((b, i) => (
                  <option key={b.label} value={i}>{b.label}</option>
                ))}
              </select>
            </SelectShell>
            <button className="btn-dark h-[52px] rounded-2xl py-0">Find a gift</button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-ink-soft">
            <span className="flex items-center gap-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </span>
              4.9 from 3,000+ Lagos senders
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary-600" /> Same-day when you order by 3pm
            </span>
          </motion.div>
        </div>

        {/* Photo collage with the hanging gift tag */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="grid grid-cols-[1.35fr_1fr] gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease }}
              className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-[28px]"
            >
              <Image src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1000&auto=format&fit=crop" alt="A curated Love Box gift, wrapped in pink" fill priority sizes="(max-width: 1024px) 60vw, 330px" className="object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }} className="relative aspect-square overflow-hidden rounded-[28px]">
              <Image src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=700&auto=format&fit=crop" alt="Fresh pink flowers" fill sizes="240px" className="object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.18, ease }} className="relative aspect-square overflow-hidden rounded-[28px] bg-cream-200">
              <Image src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=700&auto=format&fit=crop" alt="A birthday hamper box" fill sizes="240px" className="object-cover" />
            </motion.div>
          </div>

          {/* The gift tag: swings in once, then the handwritten note changes */}
          <motion.div
            className="absolute -left-4 top-[46%] origin-top sm:-left-10"
            initial={{ rotate: -24, opacity: 0, y: -30 }}
            animate={{ rotate: [-24, 10, -6, 3, -2], opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto h-10 w-px bg-ink/50" aria-hidden="true" />
            <div style={{ filter: "drop-shadow(0 22px 30px rgba(30,22,27,0.22))" }}>
            <div
              className="relative w-[210px] bg-white px-6 pb-6 pt-8 sm:w-[240px]"
              style={{ clipPath: "polygon(18% 0, 82% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", borderRadius: 6 }}
            >
              <span className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-gold-400" aria-hidden="true" />
              <div className="relative h-[84px]" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={note}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center text-center font-script text-[30px] leading-[1.05] text-ink"
                  >
                    {TAG_NOTES[note]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="mt-2 border-t border-dashed border-line pt-2 text-center text-[12px] text-ink-muted">Every gift gets a handwritten card</p>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
