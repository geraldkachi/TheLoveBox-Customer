// app/checkout/success/page.tsx
import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display text-[22px] text-brand-ink mb-1">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}