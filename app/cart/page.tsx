"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { naira } from "@/lib/format";
import { Minus, Plus, X, Truck, ShieldCheck, MessageCircle, ChevronRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQty, remove } = useCartStore();
  const router = useRouter();
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const delivery = subtotal === 0 || subtotal > 100000 ? 0 : 3500;
  const discount = promoMsg?.ok ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "LOVE10") {
      setPromoMsg({ ok: true, text: "LOVE10 applied — 10% off your order." });
    } else if (promo.trim() === "") {
      setPromoMsg(null);
    } else {
      setPromoMsg({ ok: false, text: "That code isn't valid. Try LOVE10." });
    }
  };

  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi The Love Box! I'd like to discuss my cart:\n" + items.map((it) => `• ${it.name} (x${it.qty})`).join("\n")
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-center gap-1.5 text-[13px] text-[#8a7a7d] mb-6">
        <Link href="/">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-brand-ink font-medium">Your cart</span>
      </div>

      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-display text-[32px] sm:text-[38px] text-brand-ink leading-none">Your cart</h1>
        <span className="text-[14px] text-[#8a7a7d]">{items.length} {items.length === 1 ? "item" : "items"}</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-blush py-20 text-center">
          <p className="font-display text-[22px] text-brand-ink mb-2">Your box is empty</p>
          <p className="text-[14px] text-[#8a7a7d] mb-6">Find something thoughtful to send someone today.</p>
          <Link href="/" className="bg-brand-pink text-white text-[14px] font-medium px-6 py-3 rounded-full hover:bg-brand-pinkDark transition-colors">
            Browse gifts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="flex flex-col gap-4">
            {items.map((it) => (
              <div key={it.productId + it.size} className="group bg-white rounded-2xl border border-brand-blush p-4 sm:p-5 flex gap-4 sm:gap-5 hover:border-[#e8c3cf] transition-colors">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-brand-blush shrink-0">
                  {it.image && <Image src={it.image} alt={it.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-brand-ink truncate">{it.name}</p>
                      <p className="text-[13px] text-[#8a7a7d] mt-0.5">{it.size}</p>
                    </div>
                    <button onClick={() => remove(it.productId, it.size)} aria-label={`Remove ${it.name}`} className="text-[#c8b8bb] hover:text-brand-pink transition-colors shrink-0">
                      <X className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div className="flex items-center border border-brand-blush rounded-full">
                      <button onClick={() => updateQty(it.productId, it.size, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand-blush rounded-full transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-[13px] font-medium">{it.qty}</span>
                      <button onClick={() => updateQty(it.productId, it.size, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand-blush rounded-full transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[15px] font-medium text-brand-ink">{naira(it.price * it.qty)}</p>
                  </div>
                </div>
              </div>
            ))}

            <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white rounded-2xl border border-brand-blush p-4 sm:p-5 hover:border-[#e8c3cf] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#1fae52]" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-brand-ink">Want to tweak something first?</p>
                  <p className="text-[12.5px] text-[#8a7a7d]">Chat with a gift specialist on WhatsApp before you check out.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#c8b8bb] shrink-0" />
            </a>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="relative bg-white rounded-2xl border border-brand-blush overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "repeating-linear-gradient(90deg,#e8c3cf 0,#e8c3cf 6px,transparent 6px,transparent 12px)" }} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-display text-[19px] text-brand-ink">Order summary</p>
                  <span className="text-[11px] tracking-wide uppercase text-brand-gold border border-[#e9dcb8] bg-[#FBF6E9] px-2 py-0.5 rounded-full">Gift tag</span>
                </div>

                <div className="flex flex-col gap-2.5 text-[14px]">
                  <div className="flex justify-between text-[#5a4c4f]"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
                  <div className="flex justify-between text-[#5a4c4f]"><span>Delivery</span><span>{delivery === 0 ? "Free" : naira(delivery)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-[#1fae52]"><span>Discount (LOVE10)</span><span>-{naira(discount)}</span></div>}
                </div>

                <div className="my-4 border-t border-dashed border-brand-blush" />

                <div className="flex justify-between items-baseline mb-5">
                  <span className="text-[15px] font-medium text-brand-ink">Total</span>
                  <span className="text-[22px] font-medium text-brand-ink">{naira(total)}</span>
                </div>

                <div className="flex gap-2 mb-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 min-w-0 text-[13px] border border-brand-blush rounded-full px-4 py-2.5 outline-none focus:border-brand-pink transition-colors"
                  />
                  <button onClick={applyPromo} className="text-[13px] font-medium border border-brand-ink text-brand-ink px-4 rounded-full hover:bg-brand-ink hover:text-white transition-colors shrink-0">
                    Apply
                  </button>
                </div>
                {promoMsg && <p className={`text-[12.5px] mb-3 ${promoMsg.ok ? "text-[#1fae52]" : "text-brand-pink"}`}>{promoMsg.text}</p>}

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-brand-pink text-white text-[15px] font-medium py-3.5 rounded-full hover:bg-brand-pinkDark active:scale-[0.99] transition-all mt-2"
                >
                  Checkout with Paystack
                </button>
                <Link href="/" className="block text-center w-full text-[13px] text-[#8a7a7d] py-3 hover:text-brand-ink transition-colors">
                  Continue shopping
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-2.5 mt-4 px-1">
              <Truck className="w-4 h-4 text-[#8a7a7d] mt-0.5 shrink-0" />
              <p className="text-[12.5px] text-[#8a7a7d] leading-relaxed">Free same-day delivery in Lagos on orders over ₦100,000.</p>
            </div>
            <div className="flex items-start gap-2.5 mt-2 px-1">
              <ShieldCheck className="w-4 h-4 text-[#8a7a7d] mt-0.5 shrink-0" />
              <p className="text-[12.5px] text-[#8a7a7d] leading-relaxed">Secure payment powered by Paystack.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
