"use client";
import { motion } from "motion/react";
import { FREE_DELIVERY_THRESHOLD, naira } from "@/lib/format";

export default function FreeDeliveryMeter({ subtotal }: { subtotal: number }) {
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const left = FREE_DELIVERY_THRESHOLD - subtotal;
  return (
    <div>
      <p className="mb-2 text-[13.5px] text-ink-soft">
        {left > 0 ? (
          <>Add <strong className="font-semibold text-ink">{naira(left + 1)}</strong> more for free delivery</>
        ) : (
          <strong className="font-semibold text-leaf">Your delivery is free</strong>
        )}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-petal-100">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-ribbon-400 to-ribbon-600" initial={false} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
    </div>
  );
}
