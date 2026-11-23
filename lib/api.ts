import axios, { AxiosError, AxiosResponse } from "axios";

/**
 * The API wraps everything as { success, message, data }.
 * This client unwraps it so `res.data` is the payload and `res.message`
 * is the server's human-readable message (used for toasts).
 */
export type ApiResponse<T = any> = AxiosResponse<T> & { message?: string };

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("tlb_customer_auth");
      const token = raw ? JSON.parse(raw)?.state?.token : null;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore */
    }
  }
  return config;
});

api.interceptors.response.use(
  (res: ApiResponse) => {
    const body = res.data as any;
    if (body && typeof body === "object" && "success" in body && "data" in body) {
      res.message = body.message;
      res.data = body.data;
    }
    return res;
  },
  (err) => Promise.reject(err)
);

export interface FieldError {
  field: string;
  message: string;
}

/** Best human-readable message for any failed request. */
export function errorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const e = err as AxiosError<any>;
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.code === "ECONNABORTED") return "The request took too long. Check your connection and try again.";
  if (e?.message === "Network Error" || (e?.isAxiosError && !e.response)) {
    return "Can't reach The Love Box right now. Check your internet connection.";
  }
  return fallback;
}

export function fieldErrors(err: unknown): Record<string, string> {
  const list: FieldError[] = (err as AxiosError<any>)?.response?.data?.errors || [];
  return Object.fromEntries(list.map((f) => [f.field, f.message]));
}

/** Server-component helper: returns fallback instead of throwing. */
export async function safeGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const { data } = await api.get(url);
    return (data ?? fallback) as T;
  } catch {
    return fallback;
  }
}
