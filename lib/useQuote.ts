"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { CartItem } from "./cartStore";

export interface Quote {
  items: { product: string; name: string; size: string; price: number; qty: number; lineTotal: number }[];
  subtotal: number;
  deliveryFee: number;
  shippingNote?: string;
  discount: number;
  total: number;
  promo: { code: string; type: "percent" | "fixed"; value: number; label: string } | null;
}

export const toQuoteItems = (items: CartItem[]) =>
  items.map((i) =>
    i.custom
      ? {
          custom: {
            box: i.custom.box.option,
            items: i.custom.items.map((x) => ({ option: x.option, qty: x.qty })),
            extras: i.custom.extras.map((x) => ({ option: x.option, qty: x.qty })),
          },
          qty: i.qty,
        }
      : { product: i.productId, size: i.size === "Standard" ? undefined : i.size, qty: i.qty }
  );

/** Live, server-priced totals for the current cart (the server is the source of truth). */
export function useQuote(items: CartItem[], promoCode: string) {
  return useQuery<Quote>({
    queryKey: ["quote", items.map((i) => `${i.productId}:${i.size}:${i.qty}`).join("|"), promoCode],
    queryFn: async () => (await api.post("/orders/quote", { items: toQuoteItems(items), promoCode: promoCode || undefined })).data,
    enabled: items.length > 0,
    retry: false,
    placeholderData: (prev) => prev,
  });
}
