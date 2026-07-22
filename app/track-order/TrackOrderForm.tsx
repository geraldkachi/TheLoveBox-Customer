"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { Check } from "lucide-react";

const steps = ["paid", "processing", "out_for_delivery", "delivered"];
const stepLabels: Record<string, string> = {
  paid: "Order confirmed",
  processing: "Being prepared",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export default function TrackOrderForm() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("order") || "");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${orderNumber.trim()}`);
      setOrder(data);
    } catch {
      setError("We couldn't find an order with that number. Double-check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? Math.max(steps.indexOf(order.status), order.status === "pending_payment" ? -1 : 0) : -1;

  return (
    <div>
      <form onSubmit={search} className="flex gap-3 mb-10">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. TLB-2601-482913"
          className="flex-1 border border-brand-blush rounded-full px-5 py-3 text-[14px] outline-none focus:border-brand-pink"
        />
        <button disabled={loading} className="bg-brand-pink text-white text-[14px] font-medium px-6 py-3 rounded-full hover:bg-brand-pinkDark transition-colors disabled:opacity-60">
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && <p className="text-[14px] text-brand-pink text-center">{error}</p>}

      {order && (
        <div className="bg-white border border-brand-blush rounded-2xl p-6">
          <div className="flex justify-between items-baseline mb-6">
            <p className="text-[15px] font-medium text-brand-ink">{order.orderNumber}</p>
            <p className="text-[15px] font-medium text-brand-ink">{naira(order.total)}</p>
          </div>

          <div className="flex items-center mb-8">
            {steps.map((step, i) => (
              <div key={step} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium ${
                      i <= currentStepIndex ? "bg-brand-pink text-white" : "bg-brand-blush text-[#8a7a7d]"
                    }`}
                  >
                    {i <= currentStepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <p className="text-[11px] text-center text-[#8a7a7d] mt-1.5 max-w-[70px]">{stepLabels[step]}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-[2px] flex-1 -mt-5 ${i < currentStepIndex ? "bg-brand-pink" : "bg-brand-blush"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-brand-blush pt-4 flex flex-col gap-2">
            {order.trackingHistory?.slice().reverse().map((h: any, i: number) => (
              <div key={i} className="flex justify-between text-[13px]">
                <span className="text-brand-ink">{h.note || stepLabels[h.status] || h.status}</span>
                <span className="text-[#8a7a7d]">{new Date(h.at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
