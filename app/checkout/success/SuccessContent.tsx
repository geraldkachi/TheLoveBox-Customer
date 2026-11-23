"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, XCircle, Copy } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { useCartStore } from "@/lib/cartStore";
import { naira, whatsappLink } from "@/lib/format";
import { toast } from "@/lib/toast";

type State = { status: "checking" } | { status: "success"; kind: "order" | "shipping"; orderNumber: string; total: number } | { status: "failed"; message: string };

export default function SuccessContent() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const clear = useCartStore((s) => s.clear);
  const [state, setState] = useState<State>({ status: "checking" });
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!reference) {
      setState({ status: "failed", message: "We didn't receive a payment reference." });
      return;
    }
    api
      .get(`/payments/verify/${encodeURIComponent(reference)}`)
      .then((res) => {
        const kind = res.data.kind === "shipping" ? "shipping" : "order";
        if (kind === "order") {
          clear();
          sessionStorage.removeItem("tlb_pending_order");
        }
        setState({ status: "success", kind, orderNumber: res.data.orderNumber, total: res.data.total });
        toast.success((res as any).message || "Payment confirmed");
      })
      .catch((err) => {
        const message = errorMessage(err, "We couldn't confirm this payment.");
        setState({ status: "failed", message });
        toast.error(message);
      });
  }, [reference, clear]);

  return (
    <div className="container-x flex min-h-[65vh] items-center justify-center py-16">
      <div className="w-full max-w-lg text-center">
        {state.status === "checking" && (
          <>
            <Loader2 className="mx-auto mb-5 h-10 w-10 animate-spin text-primary-600" />
            <h1 className="text-h2 font-bold">Confirming your payment</h1>
            <p className="mt-2 text-ink-muted">This usually takes a few seconds. Please keep this page open.</p>
          </>
        )}

        {state.status === "success" && (
          <>
            <motion.svg viewBox="0 0 52 52" className="mx-auto mb-6 h-20 w-20" initial="hidden" animate="visible">
              <motion.circle cx="26" cy="26" r="24" fill="none" className="stroke-gold-400" strokeWidth="3" variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.6 } } }} />
              <motion.path d="M15 27 l7 7 l15 -16" fill="none" className="stroke-primary-600" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.4, delay: 0.5 } } }} />
            </motion.svg>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <h1 className="text-h1 font-bold">{state.kind === "shipping" ? "Delivery paid — thank you" : "Your gift is on its way to the studio"}</h1>
              <p className="mx-auto mt-3 max-w-md text-[16px] text-ink-soft">
                {state.kind === "shipping"
                  ? `We've received ${naira(state.total)} for delivery. We'll email you the moment your gift leaves the studio.`
                  : `We've received ${naira(state.total)} and started preparing your order. Your receipt is on its way, and we'll email your shipping fee shortly.`}
              </p>
              <button
                onClick={() => { navigator.clipboard?.writeText(state.orderNumber); toast.success("Order number copied"); }}
                className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-cream-100 px-5 py-2.5 text-[15px] font-semibold tabular-nums hover:bg-cream-200"
              >
                {state.orderNumber} <Copy className="h-4 w-4" />
              </button>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href={`/track-order?order=${state.orderNumber}`} className="btn-primary">Track this order</Link>
                <Link href="/" className="btn-ghost">Back to the shop</Link>
              </div>
            </motion.div>
          </>
        )}

        {state.status === "failed" && (
          <>
            <XCircle className="mx-auto mb-5 h-14 w-14 text-primary-500" />
            <h1 className="text-h2 font-bold">We couldn't confirm this payment</h1>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">{state.message}</p>
            {reference && <p className="mt-2 text-[14px] text-ink-muted">Reference: <span className="font-medium tabular-nums">{reference}</span></p>}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/checkout" className="btn-primary">Try paying again</Link>
              <a href={whatsappLink(`Hi, I need help with my payment. Reference: ${reference || "none"}`)} target="_blank" rel="noreferrer" className="btn-ghost">Get help on WhatsApp</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
