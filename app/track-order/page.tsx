import { Suspense } from "react";
import TrackOrderForm from "./TrackOrderForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track your order | The Love Box",
  description: "Enter your order number to see where your gift is.",
};

export default function TrackOrderPage() {
  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-display text-[30px] text-brand-ink text-center mb-2">Track your order</h1>
      <p className="text-[14px] text-[#8a7a7d] text-center mb-10">Simply input your order number to track it.</p>
      <Suspense>
        <TrackOrderForm />
      </Suspense>
    </div>
  );
}
