"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/toast";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/newsletter", { email });
      notifySuccess(res as { message?: string }, "You're on the list!");
      setEmail("");
    } catch (err) {
      notifyError(err, "Couldn't subscribe you right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={`flex rounded-full p-1.5 ${dark ? "bg-white/10 ring-1 ring-white/15" : "border border-line bg-white"}`}>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={`min-w-0 flex-1 bg-transparent px-4 text-[15px] outline-none ${dark ? "text-white placeholder:text-white/50" : "placeholder:text-ink-muted"}`}
      />
      <button disabled={loading} className="btn bg-ribbon-500 px-5 py-2.5 text-[14px] text-white hover:bg-ribbon-600">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
      </button>
    </form>
  );
}
