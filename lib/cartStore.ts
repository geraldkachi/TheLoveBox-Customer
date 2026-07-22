"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  updateQty: (productId: string, size: string, delta: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId && i.size === item.size);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.size === item.size ? { ...i, qty: i.qty + item.qty } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      updateQty: (productId, size, delta) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i
          ),
        })),
      remove: (productId, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "tlb_cart" }
  )
);
