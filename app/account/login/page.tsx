"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth(data.token, { id: data.id, name: data.name, email: data.email, role: data.role });
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-[26px] text-brand-ink text-center mb-1">Welcome back</h1>
      <p className="text-[13.5px] text-[#8a7a7d] text-center mb-8">Sign in to track orders and check out faster.</p>
      <form onSubmit={submit} className="bg-white border border-brand-blush rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <label className="text-[13px] font-medium text-brand-ink block mb-1">Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
        </div>
        <div>
          <label className="text-[13px] font-medium text-brand-ink block mb-1">Password</label>
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
        </div>
        {error && <p className="text-[13px] text-brand-pink">{error}</p>}
        <button disabled={loading} className="bg-brand-pink text-white text-[14px] font-medium py-3 rounded-full hover:bg-brand-pinkDark transition-colors disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-[13px] text-center text-[#8a7a7d]">
          New here? <Link href="/account/register" className="text-brand-pink font-medium">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
