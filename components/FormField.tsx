"use client";
import { AnimatePresence, motion } from "motion/react";

export default function FormField({
  label, name, error, hint, children,
}: { label: string; name: string; error?: string | false; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p key="e" id={`${name}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-[13.5px] font-medium text-red-600" role="alert">
            {error}
          </motion.p>
        ) : hint ? (
          <p className="mt-1.5 text-[13px] text-ink-muted">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
