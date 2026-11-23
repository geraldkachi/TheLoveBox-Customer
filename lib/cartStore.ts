"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomPick {
  option: string;
  name: string;
  price: number;
  qty: number;
}

/** A box the customer curated themselves (see /curate). */
export interface CustomBox {
  box: CustomPick;
  items: CustomPick[];
  extras: CustomPick[];
}

export interface CartItem {
  /** Catalogue product id, or "custom:<id>" for a curated box */
  productId: string;
  custom?: CustomBox;
  slug?: string;
  name: string;
  image: string;
  size: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  promoCode: string;
  add: (item: CartItem) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  updateQty: (productId: string, size: string, delta: number) => void;
  remove: (productId: string, size: string) => void;
  setPromo: (code: string) => void;
  clear: () => void;
}

const same = (a: CartItem, id: string, size: string) => a.productId === id && a.size === size;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promoCode: "",
      add: (newItem) =>
        set((s) => {
          const exists = s.items.some((i) => same(i, newItem.productId, newItem.size));
          return {
            items: exists
              ? s.items.map((i) => (same(i, newItem.productId, newItem.size) ? { ...i, qty: Math.min(99, i.qty + newItem.qty), price: newItem.price } : i))
              : [...s.items, newItem],
          };
        }),
      setQty: (id, size, qty) =>
        set((s) => ({ items: s.items.map((i) => (same(i, id, size) ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)) })),
      updateQty: (id, size, delta) =>
        set((s) => ({ items: s.items.map((i) => (same(i, id, size) ? { ...i, qty: Math.max(1, Math.min(99, i.qty + delta)) } : i)) })),
      remove: (id, size) => set((s) => ({ items: s.items.filter((i) => !same(i, id, size)) })),
      setPromo: (promoCode) => set({ promoCode }),
      clear: () => set({ items: [], promoCode: "" }),
    }),
    { name: "tlb_cart", version: 2 }
  )
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.price * i.qty, 0);

/** Non-persisted UI state (drawers, overlays). */
interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
}
export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
