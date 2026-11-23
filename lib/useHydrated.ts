"use client";
import { useEffect, useState } from "react";

/** Avoids hydration mismatches for values read from localStorage (cart, auth). */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
