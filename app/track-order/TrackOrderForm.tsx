"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Search, PackageCheck, CreditCard, Gift, Bike, Home, Ban } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { naira, dateTime, shortDate, whatsappLink } from "@/lib/format";
import { toast } from "@/lib/toast";

const STEPS = [
  { key: "pending_payment", label: "Order placed", icon: CreditCard },
  { key: "paid", label: "Payment confirmed", icon: PackageCheck },
  { key: "processing", label: "Being styled", icon: Gift },
  { key: "out_for_delivery", label: "Out for delivery", icon: Bike },
  { key: "delivered", label: "Delivered", icon: Home },
];

export default function TrackOrderForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState(params.get("order") || "");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (id: string, silent = false) => {
    const clean = id.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(clean)}`);
      setOrder(res.data);
      if (!silent) toast.success((res as any).message || "Order found");
    } catch (err) {
      const m = errorMessage(err, "We couldn't find that order.");
      setOrder(null);
      setError(m);
      if (!silent) toast.error(m);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = params.get("order");
    if (id) lookup(id, true);
  }, [params, lookup]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/track-order?order=${encodeURIComponent(orderNumber.trim().toUpperCase())}`, { scroll: false });
    lookup(orderNumber);
  };

  const cancelled = order?.status === "cancelled";
  const current = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div>
      <form onSubmit={submit} className="mx-auto flex max-w-xl gap-2 rounded-full border border-line bg-white p-2 shadow-lift">
        <label htmlFor="order-number" className="sr-only">Order number</label>
        <input
          id="order-number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="TLB-2611-482913"
          className="min-w-0 flex-1 bg-transparent px-4 text-[16px] uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal"
        />
        <button disabled={loading || !orderNumber.trim()} className="btn-primary px-6 py-3">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Track
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && !order && (
          <motion.p key="err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto mt-6 max-w-xl text-center text-[15px] text-red-600" role="alert">
            {error}
          </motion.p>
        )}

        {order && (
          <motion.div key={order.orderNumber} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[14px] text-ink-muted">Order {order.orderNumber}</p>
                  <h2 className="text-h2 font-bold">
                    {cancelled ? "This order was cancelled" : order.status === "delivered" ? `Delivered, ${order.customer?.name || "there"}!` : `${STEPS[current]?.label || "In progress"}`}
                  </h2>
                </div>
                {order.deliveryDate && <p className="rounded-full bg-petal-100 px-4 py-2 text-[14px] font-medium">Delivery: {shortDate(order.deliveryDate)}</p>}
              </div>

              {cancelled ? (
                <div className="flex items-start gap-4 rounded-[20px] bg-red-50 p-5 text-red-800">
                  <Ban className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-[15px]">If you didn't expect this, message us on WhatsApp with your order number and we'll sort it out.</p>
                </div>
              ) : (
                <ol className="relative">
                  {STEPS.map((s, i) => {
                    const done = i <= current;
                    const Icon = s.icon;
                    const event = [...(order.trackingHistory || [])].reverse().find((h: any) => h.status === s.key);
                    return (
                      <li key={s.key} className="relative flex gap-5 pb-8 last:pb-0">
                        {i < STEPS.length - 1 && (
                          <span className="absolute left-[21px] top-11 h-[calc(100%-44px)] w-[2px] overflow-hidden bg-line">
                            <motion.span className="block w-full bg-ribbon-500" initial={{ height: 0 }} animate={{ height: i < current ? "100%" : 0 }} transition={{ duration: 0.5, delay: 0.25 + i * 0.25 }} />
                          </span>
                        )}
                        <motion.span
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.15 + i * 0.25, type: "spring", stiffness: 400, damping: 22 }}
                          className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full ${done ? "bg-ribbon-600 text-white" : "border-2 border-line bg-white text-ink-muted"} ${i === current ? "ring-4 ring-ribbon-400/25" : ""}`}
                        >
                          {done && i < current ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </motion.span>
                        <div className="pt-2">
                          <p className={`text-[16px] font-semibold ${done ? "" : "text-ink-muted"}`}>{s.label}</p>
                          {event && <p className="mt-0.5 text-[14px] text-ink-muted">{event.note && event.note !== s.label ? `${event.note} — ` : ""}{dateTime(event.at)}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            <div className="h-fit rounded-[28px] bg-petal-50 p-6">
              <p className="mb-4 text-[17px] font-semibold tracking-tight">In this order</p>
              <ul className="flex flex-col gap-4">
                {order.items?.map((it: any, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                      {it.image && <Image src={it.image} alt="" fill sizes="48px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1 text-[14.5px]">
                      <span className="block truncate font-medium">{it.name}</span>
                      <span className="block text-ink-muted">{it.size !== "Standard" ? `${it.size}, ` : ""}qty {it.qty}</span>
                    </span>
                    <span className="text-[14.5px] tabular-nums">{naira(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-between border-t border-line pt-4 text-[16px] font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{naira(order.total)}</span>
              </div>
              <a href={whatsappLink(`Hi! I have a question about order ${order.orderNumber}.`)} target="_blank" rel="noreferrer" className="btn-ghost mt-5 w-full">Questions? Message us</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
