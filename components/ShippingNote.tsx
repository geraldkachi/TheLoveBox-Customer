import { Truck } from "lucide-react";

/** Shipping isn't charged at checkout — the team quotes it after the order. */
export default function ShippingNote({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-[16px] bg-cream-100 ${compact ? "p-3.5 text-[13px]" : "p-4 text-[14px]"} text-ink-soft`}>
      <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
      <p>
        <strong className="font-semibold text-ink">Shipping is confirmed after you order.</strong>{" "}
        We'll email your delivery fee with a secure payment link, usually within the hour.
      </p>
    </div>
  );
}
