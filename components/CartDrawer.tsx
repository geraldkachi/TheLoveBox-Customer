"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X, Trash2, Gift } from "lucide-react";
import { useCartStore, useUI, cartSubtotal, cartCount } from "@/lib/cartStore";
import { naira } from "@/lib/format";
import { toast } from "@/lib/toast";
import QtyStepper from "./QtyStepper";
import FreeDeliveryMeter from "./FreeDeliveryMeter";

export default function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { items, setQty, remove, add } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const subtotal = cartSubtotal(items);

  useEffect(() => setCartOpen(false), [pathname, setCartOpen]);
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, setCartOpen]);

  const removeWithUndo = (i: (typeof items)[number]) => {
    remove(i.productId, i.size);
    toast(`Removed ${i.name}`, { action: { label: "Undo", onClick: () => add(i) } });
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[440px] flex-col bg-white shadow-float"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <p className="text-[20px] font-semibold tracking-tight">
                Your box <span className="text-ink-muted">({cartCount(items)})</span>
              </p>
              <button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-petal-50" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-petal-100">
                  <Gift className="h-9 w-9 text-ribbon-500" />
                </div>
                <p className="mb-1 text-[20px] font-semibold tracking-tight">Your box is empty</p>
                <p className="mb-6 text-[14.5px] text-ink-muted">Start with an occasion and we'll handle the wrapping.</p>
                <Link href="/categories" className="btn-dark">Browse gifts</Link>
              </div>
            ) : (
              <>
                <div className="border-b border-line px-6 py-4">
                  <FreeDeliveryMeter subtotal={subtotal} />
                </div>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li
                        key={i.productId + i.size}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-5">
                          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-petal-100">
                            {i.image && <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />}
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-[15px] font-semibold">{i.name}</p>
                                {i.size !== "Standard" && <p className="text-[13px] text-ink-muted">{i.size}</p>}
                              </div>
                              <button onClick={() => removeWithUndo(i)} className="rounded-full p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${i.name}`}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <QtyStepper size="sm" value={i.qty} onChange={(q) => setQty(i.productId, i.size, q)} />
                              <p className="text-[15px] font-semibold tabular-nums">{naira(i.price * i.qty)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-line bg-petal-50 px-6 py-5">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-[15px] text-ink-soft">Subtotal</span>
                    <span className="text-[22px] font-semibold tracking-tight tabular-nums">{naira(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-[13px] text-ink-muted">Delivery and promo codes are applied at checkout.</p>
                  <button onClick={() => router.push("/checkout")} className="btn-primary w-full">Checkout securely</button>
                  <Link href="/cart" className="mt-2 block py-2 text-center text-[14px] font-medium text-ink-soft hover:text-ink">View full cart</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
