"use client";
import { useState } from "react";
import { Loader2, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api, errorMessage } from "@/lib/api";
import { naira, estimateDelivery } from "@/lib/format";
import { toast } from "@/lib/toast";
import { useCartStore, cartSubtotal } from "@/lib/cartStore";
import { useQuote, toQuoteItems } from "@/lib/useQuote";

export default function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { items, promoCode, setPromo } = useCartStore();
  const quote = useQuote(items, promoCode);
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);

  const est = cartSubtotal(items);
  const subtotal = quote.data?.subtotal ?? est;
  const delivery = quote.data?.deliveryFee ?? estimateDelivery(est);
  const discount = quote.data?.discount ?? 0;
  const total = quote.data?.total ?? subtotal + delivery;

  const apply = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    setApplying(true);
    try {
      const res = await api.post("/orders/quote", { items: toQuoteItems(items), promoCode: c });
      setPromo(c);
      setCode("");
      toast.success((res as any).message || `${c} applied`);
    } catch (err) {
      toast.error(errorMessage(err, "That code couldn't be applied."));
    } finally {
      setApplying(false);
    }
  };

  const row = (label: React.ReactNode, value: React.ReactNode, cls = "") => (
    <div className={`flex items-center justify-between text-[15px] ${cls}`}>
      <span className="text-ink-soft">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="rounded-[28px] border border-line bg-white p-6 sm:p-7">
      <p className="mb-5 text-[20px] font-semibold tracking-tight">Order summary</p>
      <div className="flex flex-col gap-3">
        {row("Subtotal", naira(subtotal))}
        {row("Delivery", delivery === 0 ? <span className="text-leaf">Free</span> : naira(delivery))}
        <AnimatePresence>
          {discount > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              {row(
                <span className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-leaf" />
                  {quote.data?.promo?.code}
                  <button onClick={() => { setPromo(""); toast("Promo code removed"); }} className="rounded-full p-0.5 hover:bg-petal-100" aria-label="Remove promo code"><X className="h-3.5 w-3.5" /></button>
                </span>,
                <span className="text-leaf">−{naira(discount)}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!promoCode && (
        <div className="mt-5 flex gap-2">
          <label htmlFor="promo" className="sr-only">Promo code</label>
          <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" onKeyDown={(e) => { if (e.key === "Enter") apply(e); }} className="field py-2.5 uppercase placeholder:normal-case" />
          <button type="button" onClick={apply} disabled={applying || !code.trim()} className="btn shrink-0 border border-ink px-5 text-[14px] hover:bg-ink hover:text-white">
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </button>
        </div>
      )}

      <div className="my-5 border-t border-dashed border-line" />
      <div className="flex items-baseline justify-between">
        <span className="text-[16px] font-semibold">Total</span>
        <span className="flex items-center gap-2 text-[28px] font-bold tracking-tight tabular-nums">
          {quote.isFetching && <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />}
          {naira(total)}
        </span>
      </div>
      {quote.isError && <p className="mt-2 text-[13.5px] text-red-600">{errorMessage(quote.error, "We couldn't confirm prices right now.")}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
