import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle, MapPin, Phone, Mail, Clock } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/categories", label: "All categories" },
      { href: "/category/birthdays", label: "Birthdays" },
      { href: "/category/anniversaries", label: "Anniversaries" },
      { href: "/category/corporate-events", label: "Corporate gifts" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/track-order", label: "Track an order" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact us" },
      { href: "/account", label: "My account" },
    ],
  },
  {
    title: "The Love Box",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/blog", label: "Journal" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Image src="/brand/logo-full-light.png" alt="The Love Box — unique gift box curator" width={180} height={170} className="mb-6 h-auto w-[150px]" />
          <p className="mb-6 max-w-xs text-[15px] leading-relaxed text-white/65">
            Gift boxes, flowers and hampers, styled by hand in Yaba and delivered across Lagos the same day.
          </p>
          <div className="flex gap-2">
            <a href="https://www.instagram.com/thel.ovebox/" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-ribbon-500">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.tiktok.com/@theloveboxgifts" target="_blank" rel="noreferrer" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[12px] font-bold transition hover:bg-ribbon-500">
              Tk
            </a>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-ribbon-500">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="mb-4 text-[15px] font-semibold">{c.title}</p>
              <ul className="flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline text-[14.5px] text-white/65 hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          <p className="mb-2 text-[15px] font-semibold">Gift ideas, now and then</p>
          <p className="mb-4 text-[14px] text-white/60">One email before each big occasion. No spam.</p>
          <NewsletterForm dark />
          <ul className="mt-8 flex flex-col gap-3 text-[14px] text-white/65">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ribbon-400" />206 Borno Way, Adekunle, Yaba, Lagos</li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-ribbon-400" /><a href="tel:+2348105017374" className="hover:text-white">+234 810 501 7374</a></li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-ribbon-400" /><a href="mailto:info@theloveboxgifts.com" className="hover:text-white">info@theloveboxgifts.com</a></li>
            <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-ribbon-400" />Every day, 8am – 8pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-[13px] text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} The Love Box. All rights reserved.</p>
          <p>Payments secured by Paystack</p>
        </div>
      </div>
    </footer>
  );
}
