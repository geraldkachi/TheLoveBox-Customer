"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { api, errorMessage, fieldErrors } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { toast } from "@/lib/toast";
import AuthShell from "@/components/AuthShell";
import FormField from "@/components/FormField";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post("/auth/login", form);
      const d = res.data;
      setAuth(d.token, { id: d.id, name: d.name, email: d.email, role: d.role });
      toast.success((res as any).message || "Welcome back");
      router.push("/account");
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, "Couldn't sign you in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" sub="Sign in to see your orders and check out faster.">
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <FormField label="Email" name="email" error={errors.email}>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`field ${errors.email ? "field-error" : ""}`} />
        </FormField>
        <FormField label="Password" name="password" error={errors.password}>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`field pr-12 ${errors.password ? "field-error" : ""}`} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-muted hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        <button disabled={loading} className="btn-primary mt-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}</button>
        <p className="text-center text-[15px] text-ink-muted">
          New here? <Link href="/account/register" className="font-semibold text-primary-700 hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
