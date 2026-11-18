"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChevronDown } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  isGiftType: boolean;
}

export default function CategoryMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // const { data: categories = [] } = useQuery<Category[]>({
  //   queryKey: ["categories"],
  //   queryFn: async () => (await api.get("/categories")).data,
  //   staleTime: 5 * 60 * 1000,
  // });
   const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      // SAFE EXTRACTION: Check if res is an array, or if res.data is an array
      const rawData = Array.isArray(res) ? res : res.data;
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const occasions = categories.filter((c) => !c.parent && !c.isGiftType);

  useEffect(() => {
    if (mobile) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobile]);

  if (mobile) {
    return (
      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {occasions.map((c) => (
          <Link key={c._id} href={`/category/${c.slug}`} onClick={onNavigate} className="text-[14px] text-brand-ink py-1.5">
            {c.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[13.5px] text-brand-ink hover:text-brand-pink transition-colors"
      >
        Shop by occasion
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[520px] bg-white border border-brand-blush rounded-2xl shadow-[0_20px_50px_-15px_rgba(33,26,29,0.15)] p-5">
          <div className="grid grid-cols-2 gap-1 max-h-96 overflow-y-auto pr-1">
            {occasions.map((c) => (
              <Link
                key={c._id}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="text-[13.5px] text-brand-ink px-3 py-2 rounded-lg hover:bg-brand-blush hover:text-brand-pink transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-brand-blush mt-3 pt-3">
            <Link href="/categories" onClick={() => setOpen(false)} className="text-[13px] text-brand-pink font-medium">
              View all categories →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
