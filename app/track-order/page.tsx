import { Suspense } from "react";
import type { Metadata } from "next";
import TrackOrderForm from "./TrackOrderForm";

export const metadata: Metadata = { title: "Track your order", description: "Enter your order number to see where your gift is." };

export default function TrackOrderPage() {
  return (
    <div className="container-x py-16">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="text-h1 font-bold">Where's my gift?</h1>
        <p className="mt-3 text-[16px] text-ink-soft">Enter the order number from your confirmation email.</p>
      </div>
      <Suspense>
        <TrackOrderForm />
      </Suspense>
    </div>
  );
}
