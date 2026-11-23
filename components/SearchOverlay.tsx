"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Loader2 } from "lucide-react";
import { useUI } from "@/lib/cartStore";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

const SUGGESTIONS = ["Birthday hamper", "Roses", "Anniversary", "Chocolates", "For him", "Corporate"];

function useDebounced<T>(value: T, ms = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState("");
  const dq = useDebounced(q.trim());
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setSearchOpen(false), [pathname, setSearchOpen]);
  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  const { data, isFetching, isError } = useQuery<{ products: Product[]; categories: Category[] }>({
    queryKey: ["search", dq],
    queryFn: async () => (await api.get(`/search?q=${encodeURIComponent(dq)}`)).data,
    enabled: searchOpen && dq.length >= 2,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/45 px-4 pt-[10vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSearchOpen(false)}>
          <motion.div
            role="dialog"
            aria-label="Search"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-float"
          >
            <form onSubmit={submit} className="flex items-center gap-3 border-b border-line px-5">
              {isFetching ? <Loader2 className="h-5 w-5 animate-spin text-primary-600" /> : <Search className="h-5 w-5 text-ink-muted" />}
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search gifts, flowers, occasions…"
                className="h-16 flex-1 bg-transparent text-[17px] outline-none placeholder:text-ink-muted/70"
                aria-label="Search"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="rounded-full p-2 hover:bg-cream-50" aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              {dq.length < 2 ? (
                <>
                  <p className="mb-3 text-[13px] font-medium text-ink-muted">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="rounded-full bg-cream-100 px-3.5 py-2 text-[14px] font-medium hover:bg-cream-200">
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              ) : isError ? (
                <p className="py-8 text-center text-[14.5px] text-ink-muted">Search isn't available right now. Try again in a moment.</p>
              ) : data && data.products.length + data.categories.length === 0 && !isFetching ? (
                <p className="py-8 text-center text-[14.5px] text-ink-muted">No gifts match “{dq}”. Try a broader word like “flowers” or “hamper”.</p>
              ) : (
                <>
                  {!!data?.categories.length && (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {data.categories.map((c) => (
                        <Link key={c._id} href={`/category/${c.slug}`} className="rounded-full border border-line px-3.5 py-1.5 text-[14px] hover:border-primary-500 hover:text-primary-700">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  <ul className="flex flex-col">
                    {data?.products.slice(0, 6).map((p) => (
                      <li key={p._id}>
                        <Link href={`/product/${p.slug}`} className="flex items-center gap-4 rounded-2xl p-2 hover:bg-cream-50">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                            {p.images?.[0] && <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-medium">{p.name}</p>
                            <p className="text-[13px] text-ink-muted">{p.categories?.[0]?.name}</p>
                          </div>
                          <span className="text-[15px] font-semibold tabular-nums">{naira(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {!!data?.products.length && (
                    <button onClick={submit as any} className="mt-3 w-full rounded-2xl bg-cream-50 py-3 text-[14px] font-semibold text-primary-700 hover:bg-cream-100">
                      See all results for “{dq}”
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
