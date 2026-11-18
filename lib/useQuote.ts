"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { CartItem } from "./cartStore";

export interface Quote {
  items: { product: string; name: string; size: string; price: number; qty: number; lineTotal: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  promo: { code: string; percent: number } | null;
  freeDeliveryThreshold: number;
}

export const toQuoteItems = (items: CartItem[]) =>
  items.map((i) => ({ product: i.productId, size: i.size === "Standard" ? undefined : i.size, qty: i.qty }));

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
