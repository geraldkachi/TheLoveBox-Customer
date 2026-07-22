"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ message, label = "Chat with a gift specialist" }: { message: string; label?: string }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full border border-[#25D366] text-[#1fae52] rounded-full py-3 text-[14px] font-medium hover:bg-[#25D366]/10 transition-colors"
    >
      <MessageCircle className="w-4 h-4" />
      {label}
    </a>
  );
}
