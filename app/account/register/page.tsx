"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, errorMessage, fieldErrors } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { toast } from "@/lib/toast";
import AuthShell from "@/components/AuthShell";
import FormField from "@/components/FormField";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters." });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post("/auth/register", { ...form, role: "customer" });
      const d = res.data;
      setAuth(d.token, { id: d.id, name: d.name, email: d.email, role: d.role });
      toast.success((res as any).message || "Account created");
      router.push("/account");
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, "Couldn't create your account."));
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <AuthShell title="Create your account" sub="Your details are saved for next time, and every order appears in one place.">
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <FormField label="Full name" name="name" error={errors.name}>
          <input id="name" required autoComplete="name" value={form.name} onChange={set("name")} className={`field ${errors.name ? "field-error" : ""}`} />
        </FormField>
        <FormField label="Email" name="email" error={errors.email}>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={`field ${errors.email ? "field-error" : ""}`} />
        </FormField>
        <FormField label="Password" name="password" error={errors.password} hint="At least 8 characters.">
          <input id="password" type="password" required autoComplete="new-password" value={form.password} onChange={set("password")} className={`field ${errors.password ? "field-error" : ""}`} />
        </FormField>
        <button disabled={loading} className="btn-primary mt-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}</button>
        <p className="text-center text-[15px] text-ink-muted">
          Already have an account? <Link href="/account/login" className="font-semibold text-primary-700 hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
