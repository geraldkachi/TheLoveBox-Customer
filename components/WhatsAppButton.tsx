import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/format";

export default function WhatsAppButton({ message, label = "Ask a gift specialist on WhatsApp" }: { message: string; label?: string }) {
  return (
    <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="btn w-full border border-[#25D366]/50 px-6 py-3.5 text-[15px] text-[#128C4B] hover:bg-[#25D366]/10">
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
