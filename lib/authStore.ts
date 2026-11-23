"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: CustomerUser | null;
  setAuth: (token: string, user: CustomerUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "tlb_customer_auth" }
  )
);
