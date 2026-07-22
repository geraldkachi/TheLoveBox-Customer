"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference") || params.get("trxref");
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }
    api
      .get(`/payments/verify/${reference}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("failed"));
  }, [reference]);

  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      {status === "checking" && (
        <>
          <Loader2 className="w-10 h-10 text-brand-pink mx-auto mb-4 animate-spin" />
          <p className="font-display text-[22px] text-brand-ink mb-1">Confirming your payment</p>
          <p className="text-[14px] text-[#8a7a7d]">This only takes a moment.</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-[#1fae52] mx-auto mb-4" />
          <p className="font-display text-[24px] text-brand-ink mb-1">Payment confirmed</p>
          <p className="text-[14px] text-[#8a7a7d] mb-8">
            Your order is on its way to being prepared. We've sent a confirmation to your email.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/track-order" className="bg-brand-pink text-white text-[14px] font-medium px-6 py-3 rounded-full hover:bg-brand-pinkDark transition-colors">
              Track your order
            </Link>
            <Link href="/" className="text-[14px] text-brand-ink px-6 py-3 rounded-full border border-brand-ink/15 hover:border-brand-ink transition-colors">
              Continue shopping
            </Link>
          </div>
        </>
      )}
      {status === "failed" && (
        <>
          <XCircle className="w-12 h-12 text-brand-pink mx-auto mb-4" />
          <p className="font-display text-[24px] text-brand-ink mb-1">We couldn't confirm this payment</p>
          <p className="text-[14px] text-[#8a7a7d] mb-8">
            If you were charged, message us on WhatsApp with your reference and we'll sort it out right away.
          </p>
          <button onClick={() => router.push("/cart")} className="bg-brand-pink text-white text-[14px] font-medium px-6 py-3 rounded-full hover:bg-brand-pinkDark transition-colors">
            Back to cart
          </button>
        </>
      )}
    </div>
  );
}
