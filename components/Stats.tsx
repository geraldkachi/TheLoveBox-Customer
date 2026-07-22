"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";

const stats = [
  { value: 3200, suffix: "+", label: "Gifts delivered" },
  { value: 40, suffix: "+", label: "Corporate partners" },
  { value: 98, suffix: "%", label: "On-time delivery" },
  { value: 4.9, suffix: "/5", label: "Average rating", decimals: 1 },
];

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const rounded = useTransform(count, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.6, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, count, rounded]);

  return (
    <span ref={ref} className="font-display text-[38px] sm:text-[44px] text-brand-ink">
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="bg-brand-ink">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="[&_span]:text-white">
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <p className="text-[12.5px] text-white/60 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
