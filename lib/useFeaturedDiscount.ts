"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export interface FeaturedDiscount {
  code: string;
  type: "percent" | "fixed";
  value: number;
  label: string;
  headline: string;
  description: string;
  minSubtotal: number;
  firstOrderOnly: boolean;
  endsAt?: string | null;
}

/** The discount the admin switched to "Show on website" (or null). */
export function useFeaturedDiscount() {
  return useQuery<FeaturedDiscount | null>({
    queryKey: ["featured-discount"],
    queryFn: async () => (await api.get("/discounts/featured")).data ?? null,
    staleTime: 60_000,
    retry: false,
  });
}
