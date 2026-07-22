"use client";
import { useState } from "react";
import { MapPin, Mail, MessageCircle, Instagram } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-display text-[32px] text-brand-ink mb-3">Let's talk gifting</h1>
        <p className="text-[14px] text-[#8a7a7d] leading-relaxed mb-8">
          Questions about an order, a custom gift box, or a corporate arrangement? Reach us directly, we usually reply within the hour.
        </p>

        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-brand-pink mt-1 shrink-0" />
            <p className="text-[14px] text-brand-ink">206 Borno Way, Adekunle, Yaba, Lagos, Nigeria</p>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-brand-pink mt-1 shrink-0" />
            <p className="text-[14px] text-brand-ink">hello@theloveboxgifts.com</p>
          </div>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-start gap-3">
            <MessageCircle className="w-4 h-4 text-brand-pink mt-1 shrink-0" />
            <p className="text-[14px] text-brand-ink">Chat with us on WhatsApp</p>
          </a>
          <a href="https://www.instagram.com/thel.ovebox/" target="_blank" rel="noreferrer" className="flex items-start gap-3">
            <Instagram className="w-4 h-4 text-brand-pink mt-1 shrink-0" />
            <p className="text-[14px] text-brand-ink">@thel.ovebox</p>
          </a>
        </div>
      </div>

      <div>
        {sent ? (
          <div className="bg-white border border-brand-blush rounded-2xl p-8 text-center">
            <p className="font-display text-[20px] text-brand-ink mb-1">Message sent</p>
            <p className="text-[14px] text-[#8a7a7d]">We'll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white border border-brand-blush rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-medium text-brand-ink block mb-1">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-brand-ink block mb-1">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-brand-ink block mb-1">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-brand-blush rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-pink" />
            </div>
            <button className="bg-brand-pink text-white text-[14px] font-medium py-3 rounded-full hover:bg-brand-pinkDark transition-colors">
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
