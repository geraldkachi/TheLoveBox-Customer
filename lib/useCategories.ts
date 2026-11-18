"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { Category } from "./types";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
