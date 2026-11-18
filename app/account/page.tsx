"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Package } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { useHydrated } from "@/lib/useHydrated";
import { naira, shortDate } from "@/lib/format";
import { toast } from "@/lib/toast";

const LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  paid: "Confirmed",
  processing: "Being styled",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const TONE: Record<string, string> = {
  pending_payment: "bg-amber-50 text-amber-800",
  delivered: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-red-50 text-red-700",
};

export default function AccountPage() {
  const hydrated = useHydrated();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace("/account/login");
  }, [hydrated, user, router]);

  const orders = useQuery<any[]>({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => (await api.get("/orders/mine")).data,
    enabled: !!user,
  });

  useEffect(() => {
    const status = (orders.error as any)?.response?.status;
    if (status === 401) {
      logout();
      toast.error(errorMessage(orders.error, "Please sign in again."));
    }
  }, [orders.error, logout]);

  if (!hydrated || !user) return <div className="min-h-[60vh]" />;

  return (
    <div className="container-x py-12">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[15px] text-ink-muted">{user.email}</p>
          <h1 className="text-h1 font-bold">Hi, {user.name.split(" ")[0]}</h1>
        </div>
        <button
          onClick={async () => {
            api.post("/auth/logout").catch(() => null);
            logout();
            toast.success("You've been signed out.");
            router.push("/");
          }}
          className="btn-ghost py-2.5"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <h2 className="mb-5 text-[22px] font-semibold tracking-tight">Your orders</h2>
      {orders.isLoading ? (
        <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-[20px] bg-petal-100" />)}</div>
      ) : orders.isError ? (
        <p className="rounded-[20px] bg-red-50 p-5 text-red-700">{errorMessage(orders.error, "We couldn't load your orders.")}</p>
      ) : !orders.data?.length ? (
        <div className="rounded-[28px] bg-petal-50 px-6 py-16 text-center">
          <Package className="mx-auto mb-4 h-9 w-9 text-ribbon-500" />
          <p className="text-[18px] font-semibold">No orders yet</p>
          <p className="mt-1 text-ink-muted">Orders you place with {user.email} will show up here.</p>
          <Link href="/categories" className="btn-dark mt-6">Find a gift</Link>
        </div>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {orders.data.map((o) => (
            <li key={o.orderNumber}>
              <Link href={`/track-order?order=${o.orderNumber}`} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-5 hover:bg-petal-50 sm:px-3">
                <span className="w-44 font-semibold tabular-nums">{o.orderNumber}</span>
                <span className="flex-1 text-[14.5px] text-ink-muted">{shortDate(o.createdAt)}, {o.items.length} item{o.items.length > 1 ? "s" : ""}</span>
                <span className={`rounded-full px-3 py-1 text-[13px] font-medium ${TONE[o.status] || "bg-petal-100 text-ribbon-700"}`}>{LABEL[o.status] || o.status}</span>
                <span className="w-28 text-right font-semibold tabular-nums">{naira(o.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
