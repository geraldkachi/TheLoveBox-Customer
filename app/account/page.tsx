"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { LogOut, Package, MapPin } from "lucide-react";

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/account/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="bg-white border border-brand-blush rounded-2xl p-6">
        <p className="text-[12px] uppercase tracking-wide text-brand-gold mb-1">Your account</p>
        <h1 className="font-display text-[24px] text-brand-ink mb-1">{user.name}</h1>
        <p className="text-[13.5px] text-[#8a7a7d] mb-6">{user.email}</p>

        <div className="flex flex-col gap-1 border-t border-brand-blush pt-4">
          <Link href="/track-order" className="flex items-center gap-3 py-2.5 text-[14px] text-brand-ink hover:text-brand-pink transition-colors">
            <Package className="w-4 h-4" /> Track an order
          </Link>
          <Link href="/contact" className="flex items-center gap-3 py-2.5 text-[14px] text-brand-ink hover:text-brand-pink transition-colors">
            <MapPin className="w-4 h-4" /> Delivery details
          </Link>
          <button onClick={() => { logout(); router.push("/"); }} className="flex items-center gap-3 py-2.5 text-[14px] text-brand-pink">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
