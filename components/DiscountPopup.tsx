"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X, Loader2, Copy, Check } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { useFeaturedDiscount } from "@/lib/useFeaturedDiscount";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "@/lib/toast";
import { naira } from "@/lib/format";
import { create } from "zustand";

/** Lets the announcement bar re-open the popup. */
export const useDiscountPopup = create<{ open: boolean; setOpen: (v: boolean) => void }>((set) => ({ open: false, setOpen: (open) => set({ open }) }));

const KEY = "tlb_discount_popup";
const HIDDEN_ROUTES = ["/checkout", "/account"];

export default function DiscountPopup() {
  const { data: discount } = useFeaturedDiscount();
  const { open, setOpen } = useDiscountPopup();
  const pathname = usePathname();
  const setPromo = useCartStore((s) => s.setPromo);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-open once per code, a few seconds into the visit
  useEffect(() => {
    if (!discount || HIDDEN_ROUTES.some((r) => pathname.startsWith(r))) return;
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (seen === discount.code) return;
    const t = setTimeout(() => setOpen(true), 6000);
    return () => clearTimeout(t);
  }, [discount, pathname, setOpen]);

  const close = () => {
    setOpen(false);
    try {
      if (discount) localStorage.setItem(KEY, discount.code);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/newsletter", { email });
      toast.success((res as any).message || "You're on the list!");
      setRevealed(true);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't sign you up right now."));
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!discount) return;
    setPromo(discount.code);
    toast.success(`${discount.code} will be applied at checkout`);
    close();
  };

  return (
    <AnimatePresence>
      {open && discount && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="discount-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative grid w-full max-w-[820px] overflow-hidden rounded-[28px] bg-white shadow-float md:grid-cols-[0.9fr_1.1fr]"
          >
            <button onClick={close} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 hover:bg-cream-100" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <div className="relative hidden bg-primary-700 md:block">
              <Image src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop" alt="" fill sizes="360px" className="object-cover opacity-80 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-800/90 via-primary-700/30 to-transparent" />
              <p className="absolute bottom-8 left-8 right-8 text-[64px] font-extrabold leading-none tracking-tighter text-gold-300">{discount.label.replace(" off", "")}<span className="block text-[22px] font-semibold tracking-tight text-white">off</span></p>
            </div>

            <div className="p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <motion.div key="form" exit={{ opacity: 0, x: -16 }}>
                    <h2 id="discount-title" className="pr-8 text-[30px] font-bold leading-[1.05] tracking-[-0.03em]">{discount.headline}</h2>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{discount.description}</p>
                    <form onSubmit={submit} className="mt-7 flex flex-col gap-3">
                      <label htmlFor="popup-email" className="sr-only">Email address</label>
                      <input id="popup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="field rounded-full px-5 py-3.5" autoComplete="email" />
                      <button disabled={loading} className="btn-primary">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Get ${discount.label}`}</button>
                    </form>
                    <p className="mt-4 text-[12.5px] leading-relaxed text-ink-muted">
                      You'll get occasional gift ideas and offers. Unsubscribe any time.
                      {discount.minSubtotal > 0 && ` Valid on orders over ${naira(discount.minSubtotal)}.`}
                      {discount.firstOrderOnly && " First order only."}
                    </p>
                    <button onClick={close} className="mt-3 text-[13.5px] font-medium text-ink-muted underline-offset-4 hover:underline">No thanks</button>
                  </motion.div>
                ) : (
                  <motion.div key="code" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="pr-8 text-[30px] font-bold leading-[1.05] tracking-[-0.03em]">Here's your code</h2>
                    <p className="mt-3 text-[15.5px] text-ink-soft">We've also sent it to {email}.</p>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(discount.code);
                        setCopied(true);
                        toast.success("Code copied");
                        setTimeout(() => setCopied(false), 1500);
                      }}
                      className="mt-6 flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-gold-400 bg-gold-50 px-5 py-4"
                    >
                      <span className="text-[26px] font-extrabold tracking-[0.12em] text-primary-700">{discount.code}</span>
                      {copied ? <Check className="h-5 w-5 text-leaf" /> : <Copy className="h-5 w-5 text-ink-muted" />}
                    </button>
                    <button onClick={apply} className="btn-primary mt-4 w-full">Apply to my cart</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
