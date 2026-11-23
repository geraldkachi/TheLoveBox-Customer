"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Mail, MessageCircle, Instagram, Loader2, CheckCircle2 } from "lucide-react";
import { api, errorMessage, fieldErrors } from "@/lib/api";
import { toast } from "@/lib/toast";
import { whatsappLink } from "@/lib/format";
import FormField from "@/components/FormField";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post("/contact", form);
      toast.success((res as any).message || "Message sent");
      setSentTo(form.name.split(" ")[0]);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, "Your message couldn't be sent."));
    } finally {
      setLoading(false);
    }
  };
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container-x grid gap-14 py-16 lg:grid-cols-2">
      <div>
        <h1 className="text-h1 font-bold">Let's plan a gift together</h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-soft">A question about an order, a custom box, or a corporate brief — we usually reply within the hour.</p>
        <ul className="mt-10 flex flex-col gap-5 text-[15.5px]">
          <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 text-primary-600" />206 Borno Way, Adekunle, Yaba, Lagos</li>
          <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 text-primary-600" /><a href="mailto:info@theloveboxgifts.com" className="link-underline">info@theloveboxgifts.com</a></li>
          <li className="flex gap-3"><MessageCircle className="mt-0.5 h-5 w-5 text-primary-600" /><a href={whatsappLink()} target="_blank" rel="noreferrer" className="link-underline">Chat with us on WhatsApp</a></li>
          <li className="flex gap-3"><Instagram className="mt-0.5 h-5 w-5 text-primary-600" /><a href="https://www.instagram.com/thel.ovebox/" target="_blank" rel="noreferrer" className="link-underline">@thel.ovebox</a></li>
        </ul>
      </div>

      <div className="rounded-[32px] bg-cream-50 p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {sentTo ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-leaf" />
              <p className="text-[22px] font-semibold tracking-tight">Thanks, {sentTo}. Your message is with us.</p>
              <p className="mt-2 text-ink-muted">We'll reply by email, usually within the hour.</p>
              <button onClick={() => setSentTo(null)} className="btn-ghost mt-6">Send another message</button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="flex flex-col gap-5" exit={{ opacity: 0 }}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Your name" name="name" error={errors.name}><input id="name" value={form.name} onChange={set("name")} className={`field ${errors.name ? "field-error" : ""}`} /></FormField>
                <FormField label="Phone (optional)" name="phone" error={errors.phone}><input id="phone" type="tel" value={form.phone} onChange={set("phone")} className="field" /></FormField>
              </div>
              <FormField label="Email" name="email" error={errors.email}><input id="email" type="email" value={form.email} onChange={set("email")} className={`field ${errors.email ? "field-error" : ""}`} /></FormField>
              <FormField label="How can we help?" name="message" error={errors.message}><textarea id="message" rows={6} value={form.message} onChange={set("message")} className={`field ${errors.message ? "field-error" : ""}`} /></FormField>
              <button disabled={loading} className="btn-primary">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}</button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
