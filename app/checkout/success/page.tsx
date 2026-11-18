import { Suspense } from "react";
import type { Metadata } from "next";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false } };

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[65vh]" />}>
      <SuccessContent />
    </Suspense>
  );
}
