export const naira = (n: number) => "₦" + Math.round(n || 0).toLocaleString("en-NG");

/** Shipping is quoted by the team after the order, so checkout never includes it. */
export const SHIPPING_LABEL = "Confirmed after order";

export const shortDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export const dateTime = (d: string | Date) =>
  new Date(d).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export const whatsappLink = (text?: string) =>
  `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
