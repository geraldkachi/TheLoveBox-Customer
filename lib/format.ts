export const naira = (n: number) => "₦" + Math.round(n || 0).toLocaleString("en-NG");

export const DELIVERY_FEE = 3500;
export const FREE_DELIVERY_THRESHOLD = 100000;

/** Client-side estimate only — the server's quote is the source of truth. */
export const estimateDelivery = (subtotal: number) => (subtotal === 0 || subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);

export const shortDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export const dateTime = (d: string | Date) =>
  new Date(d).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export const whatsappLink = (text?: string) =>
  `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
