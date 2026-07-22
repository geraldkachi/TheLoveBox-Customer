"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import { naira } from "@/lib/format";
import { api } from "@/lib/api";
import toast from "@/lib/toast";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function CheckoutPage() {
  const { items, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const delivery = subtotal > 100000 || subtotal === 0 ? 0 : 3500;
  const total = subtotal + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    try {
      const { data: order } = await api.post("/orders", {
        customer: { name: form.name, email: form.email, phone: form.phone },
        items: items.map((i) => ({
          product: i.productId,
          name: i.name,
          image: i.image,
          size: i.size,
          price: i.price,
          qty: i.qty,
        })),
        deliveryAddress: form.address,
        subtotal,
        deliveryFee: delivery,
        discount: 0,
        total,
      });

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(total * 100),
        ref: order.orderNumber,
        metadata: { orderNumber: order.orderNumber },
        callback: () => {
          clear();
          router.push(`/track-order?order=${order.orderNumber}`);
        },
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    } catch (err: any) {
      toast(err?.response?.data?.message || "Couldn't start checkout. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      <h1 className="font-display text-[28px] text-brand-ink mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-blush rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <label className="text-[13px] font-medium text-brand-ink block mb-1">Full name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-brand-ink block mb-1">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-brand-ink block mb-1">Phone</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
          </div>
        </div>
        <div>
          <label className="text-[13px] font-medium text-brand-ink block mb-1">Delivery address</label>
          <textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
        </div>

        <div className="border-t border-dashed border-brand-blush pt-4 mt-2 flex justify-between items-baseline">
          <span className="text-[15px] font-medium text-brand-ink">Total</span>
          <span className="text-[22px] font-medium text-brand-ink">{naira(total)}</span>
        </div>

        <button disabled={loading || !items.length} className="bg-brand-pink text-white text-[15px] font-medium py-3.5 rounded-full hover:bg-brand-pinkDark transition-colors disabled:opacity-60 mt-2">
          {loading ? "Processing..." : "Pay with Paystack"}
        </button>
      </form>
    </div>
  );
}
