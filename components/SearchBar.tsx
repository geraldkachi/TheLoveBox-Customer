"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  if (!open) {
    return (
      <button aria-label="Search" onClick={() => setOpen(true)} className="text-brand-ink hover:text-brand-pink transition-colors">
        <Search className="w-[19px] h-[19px]" />
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-1.5 bg-brand-blush rounded-full pl-3.5 pr-1.5 py-1.5">
      <Search className="w-4 h-4 text-brand-ink/60 shrink-0" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search gifts, occasions..."
        className="bg-transparent outline-none text-[13.5px] text-brand-ink w-36 sm:w-52 placeholder:text-brand-ink/40"
      />
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setQ("");
        }}
        aria-label="Close search"
        className="text-brand-ink/50 hover:text-brand-pink transition-colors p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
