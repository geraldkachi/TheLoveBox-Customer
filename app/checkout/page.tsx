"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { api, errorMessage, fieldErrors } from "@/lib/api";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import { useHydrated } from "@/lib/useHydrated";
import { naira } from "@/lib/format";
import { toast } from "@/lib/toast";
import { toQuoteItems } from "@/lib/useQuote";
import OrderSummary from "@/components/OrderSummary";
import FormField from "@/components/FormField";

const schema = Yup.object({
  name: Yup.string().trim().min(2, "Enter your full name.").required("Your name is required."),
  email: Yup.string().trim().email("Enter a valid email address.").required("Email is required."),
  phone: Yup.string().trim().matches(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number.").required("Phone number is required."),
  address: Yup.string().trim().min(8, "Enter a complete delivery address.").required("Delivery address is required."),
  deliveryDate: Yup.string(),
  giftMessage: Yup.string().max(500, "Keep it under 500 characters."),
});

const today = () => new Date().toLocaleDateString("en-CA");

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const { items, promoCode } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [stage, setStage] = useState<"idle" | "order" | "payment">("idle");

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", address: "", deliveryDate: "", giftMessage: "" },
    validationSchema: schema,
    onSubmit: async (v, helpers) => {
      if (!items.length) return;
      setStage("order");
      try {
        const orderRes = await api.post("/orders", {
          customer: { name: v.name, email: v.email, phone: v.phone },
          items: toQuoteItems(items),
          deliveryAddress: v.address,
          deliveryDate: v.deliveryDate || undefined,
          giftMessage: v.giftMessage || undefined,
          promoCode: promoCode || undefined,
        });
        const order = orderRes.data;
        sessionStorage.setItem("tlb_pending_order", order.orderNumber);
        toast.success((orderRes as any).message || `Order ${order.orderNumber} created`);

        setStage("payment");
        const payRes = await api.post("/payments/initialize", { orderNumber: order.orderNumber });
        toast.loading((payRes as any).message || "Redirecting you to Paystack…");
        window.location.href = payRes.data.authorization_url;
      } catch (err) {
        const map = fieldErrors(err);
        const formErrors: Record<string, string> = {};
        if (map["customer.name"]) formErrors.name = map["customer.name"];
        if (map["customer.email"]) formErrors.email = map["customer.email"];
        if (map["customer.phone"]) formErrors.phone = map["customer.phone"];
        if (map.deliveryAddress) formErrors.address = map.deliveryAddress;
        if (map.deliveryDate) formErrors.deliveryDate = map.deliveryDate;
        if (map.giftMessage) formErrors.giftMessage = map.giftMessage;
        helpers.setErrors(formErrors);
        toast.error(errorMessage(err, "We couldn't start checkout. Please try again."));
        setStage("idle");
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues((v) => ({ ...v, name: v.name || user.name, email: v.email || user.email }), false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!hydrated) return <div className="container-x min-h-[60vh] py-12" />;

  if (!items.length) {
    return (
      <div className="container-x py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-primary-500" />
        <h1 className="text-h2 font-bold">Your cart is empty</h1>
        <p className="mb-8 mt-2 text-ink-muted">Add a gift before checking out.</p>
        <Link href="/categories" className="btn-dark">Browse gifts</Link>
      </div>
    );
  }

  const err = (k: keyof typeof formik.values) => formik.touched[k] && formik.errors[k];
  const field = (k: keyof typeof formik.values) => ({
    id: k,
    name: k,
    value: formik.values[k],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    "aria-invalid": !!err(k),
    "aria-describedby": err(k) ? `${k}-error` : undefined,
    className: `field ${err(k) ? "field-error" : ""}`,
  });
  const busy = stage !== "idle";

  return (
    <div className="container-x py-10">
      <h1 className="mb-2 text-h1 font-bold">Checkout</h1>
      <p className="mb-10 flex items-center gap-2 text-[15px] text-ink-muted"><Lock className="h-4 w-4" /> You'll pay on Paystack's secure page.</p>

      <form onSubmit={formik.handleSubmit} noValidate className="grid items-start gap-10 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="mb-6 flex items-center gap-3 text-[22px] font-semibold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[14px] text-white">1</span> Your details
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField label="Full name" name="name" error={err("name")}><input {...field("name")} autoComplete="name" /></FormField>
              </div>
              <FormField label="Email" name="email" error={err("email")} hint="We'll send your receipt and tracking here.">
                <input {...field("email")} type="email" autoComplete="email" />
              </FormField>
              <FormField label="Phone" name="phone" error={err("phone")} hint="The rider calls this number if needed.">
                <input {...field("phone")} type="tel" autoComplete="tel" placeholder="0801 234 5678" />
              </FormField>
            </div>
          </section>

          <section>
            <h2 className="mb-6 flex items-center gap-3 text-[22px] font-semibold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[14px] text-white">2</span> Delivery
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField label="Recipient's address" name="address" error={err("address")} hint="Include the recipient's name, landmark and area, e.g. Lekki Phase 1.">
                  <textarea {...field("address")} rows={3} autoComplete="street-address" />
                </FormField>
              </div>
              <FormField label="Delivery date (optional)" name="deliveryDate" error={err("deliveryDate")} hint="Leave blank for the earliest delivery.">
                <input {...field("deliveryDate")} type="date" min={today()} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Card message (optional)" name="giftMessage" error={err("giftMessage")} hint={`${formik.values.giftMessage.length}/500. We handwrite it on the card.`}>
                  <textarea {...field("giftMessage")} rows={3} placeholder="Happy birthday! Love, Ada" />
                </FormField>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="mb-4 rounded-[28px] border border-line p-5">
            <ul className="flex flex-col gap-4">
              {items.map((i) => (
                <li key={i.productId + i.size} className="flex items-center gap-3">
                  <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    {i.image && <Image src={i.image} alt="" fill sizes="48px" className="object-cover" />}
                    <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-ink px-1 text-[11px] font-bold text-white">{i.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium">{i.name}</span>
                    {i.custom ? <span className="block truncate text-[13px] text-ink-muted">{i.custom.items.length + i.custom.extras.length} picks inside</span> : i.size !== "Standard" && <span className="block text-[13px] text-ink-muted">{i.size}</span>}
                  </span>
                  <span className="text-[14.5px] tabular-nums">{naira(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          </div>
          <OrderSummary>
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {stage === "order" ? "Placing your order…" : "Opening Paystack…"}</>
              ) : (
                <><Lock className="h-4 w-4" /> Pay securely</>
              )}
            </button>
            <p className="mt-3 text-center text-[12.5px] text-ink-muted">By paying you agree to our delivery terms. Need help? <Link href="/contact" className="underline">Contact us</Link></p>
          </OrderSummary>
        </aside>
      </form>
    </div>
  );
}
