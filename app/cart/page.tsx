"use client";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Gift, Trash2, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/cartStore";
import { naira, whatsappLink } from "@/lib/format";
import { toast } from "@/lib/toast";
import { useHydrated } from "@/lib/useHydrated";
import QtyStepper from "@/components/QtyStepper";
import OrderSummary from "@/components/OrderSummary";
import FreeDeliveryMeter from "@/components/FreeDeliveryMeter";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartPage() {
  const hydrated = useHydrated();
  const { items, setQty, remove, add } = useCartStore();

  if (!hydrated) return <div className="container-x min-h-[60vh] py-12" />;

  const removeWithUndo = (i: (typeof items)[number]) => {
    remove(i.productId, i.size);
    toast(`Removed ${i.name}`, { action: { label: "Undo", onClick: () => add(i) } });
  };

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mb-10 text-h1 font-bold">Your cart</h1>

      {items.length === 0 ? (
        <div className="rounded-[32px] bg-petal-50 px-6 py-24 text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-white"><Gift className="h-9 w-9 text-ribbon-500" /></div>
          <p className="text-[22px] font-semibold tracking-tight">Nothing in your box yet</p>
          <p className="mx-auto mb-8 mt-2 max-w-sm text-[15.5px] text-ink-muted">Pick an occasion and we'll take care of the wrapping, the card and the delivery.</p>
          <Link href="/categories" className="btn-dark">Browse gifts</Link>
        </div>
      ) : (
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="mb-6 rounded-[20px] bg-petal-50 p-5"><FreeDeliveryMeter subtotal={cartSubtotal(items)} /></div>
            <ul className="divide-y divide-line border-y border-line">
              <AnimatePresence initial={false}>
                {items.map((it) => (
                  <motion.li key={it.productId + it.size} layout exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="flex gap-5 py-6">
                      <Link href={it.slug ? `/product/${it.slug}` : "#"} className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl bg-petal-100 sm:h-36 sm:w-32">
                        {it.image && <Image src={it.image} alt={it.name} fill sizes="128px" className="object-cover" />}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[17px] font-semibold tracking-tight">{it.name}</p>
                            {it.size !== "Standard" && <p className="mt-0.5 text-[14px] text-ink-muted">{it.size}</p>}
                            <p className="mt-1 text-[14px] text-ink-muted tabular-nums">{naira(it.price)} each</p>
                          </div>
                          <p className="text-[17px] font-semibold tabular-nums">{naira(it.price * it.qty)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <QtyStepper value={it.qty} onChange={(q) => setQty(it.productId, it.size, q)} />
                          <button onClick={() => removeWithUndo(it)} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] text-ink-muted hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <a
              href={whatsappLink("Hi The Love Box! I'd like help with my cart:\n" + items.map((i) => `• ${i.name} (${i.size}) × ${i.qty}`).join("\n"))}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center gap-4 rounded-[20px] border border-line p-5 transition hover:border-[#25D366]/60"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366]/12 text-[#128C4B]"><MessageCircle className="h-5 w-5" /></span>
              <span>
                <span className="block text-[15.5px] font-semibold">Want to change something in the box?</span>
                <span className="block text-[14px] text-ink-muted">Send your cart to a gift specialist on WhatsApp.</span>
              </span>
            </a>
          </div>

          <aside className="lg:sticky lg:top-28">
            <OrderSummary>
              <Link href="/checkout" className="btn-primary w-full">Continue to checkout</Link>
              <Link href="/categories" className="mt-2 block py-2 text-center text-[14px] font-medium text-ink-soft hover:text-ink">Keep shopping</Link>
            </OrderSummary>
            <ul className="mt-5 flex flex-col gap-3 px-2 text-[14px] text-ink-muted">
              <li className="flex gap-2.5"><Truck className="h-4 w-4 shrink-0 text-ribbon-600" />Free same-day delivery in Lagos over ₦100,000</li>
              <li className="flex gap-2.5"><ShieldCheck className="h-4 w-4 shrink-0 text-ribbon-600" />Card, transfer and USSD via Paystack</li>
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
