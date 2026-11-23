"use client";
import { Minus, Plus } from "lucide-react";

export default function QtyStepper({ value, onChange, size = "md" }: { value: number; onChange: (next: number) => void; size?: "sm" | "md" }) {
  const s = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} className={`${s} grid place-items-center rounded-full transition hover:bg-cream-100 disabled:opacity-35`} aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-[14px] font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= 99} className={`${s} grid place-items-center rounded-full transition hover:bg-cream-100 disabled:opacity-35`} aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
