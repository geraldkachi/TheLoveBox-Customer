"use client";
import Link from "next/link";
import { useState } from "react";
import { Instagram, MessageCircle, Facebook, ArrowUp } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#F8F4F3] border-t border-brand-blush mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-[20px] text-brand-ink mb-3">The Love Box</p>
          <p className="text-[13px] text-[#8a7a7d] leading-relaxed mb-4">
            Lagos' gifting studio — flowers, hampers and curated boxes with same-day delivery.
          </p>
          <div className="flex items-center gap-3 mb-6">
            <a
              href="https://www.instagram.com/thel.ovebox/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-white border border-brand-blush flex items-center justify-center text-brand-ink hover:text-brand-pink hover:border-brand-pink transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.tiktok.com/@theloveboxgifts"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="w-8 h-8 rounded-full bg-white border border-brand-blush flex items-center justify-center text-brand-ink hover:text-brand-pink hover:border-brand-pink transition-colors text-[11px] font-bold"
            >
              TT
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-full bg-white border border-brand-blush flex items-center justify-center text-brand-ink hover:text-brand-pink hover:border-brand-pink transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-[13px] font-medium text-brand-ink mb-2">Subscribe for gifting ideas</p>
          {subscribed ? (
            <p className="text-[12.5px] text-[#1fae52]">You're on the list — thank you.</p>
          ) : (
            <form onSubmit={subscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-white border border-brand-blush rounded-full px-3.5 py-2 text-[12.5px] outline-none focus:border-brand-pink"
              />
              <button className="bg-brand-pink text-white text-[12.5px] font-medium px-4 rounded-full hover:bg-brand-pinkDark transition-colors shrink-0">
                Subscribe
              </button>
            </form>
          )}
          <p className="text-[11px] text-[#8a7a7d] mt-2">We care about your data.</p>
        </div>

        <div>
          <p className="text-[13px] font-medium text-brand-ink mb-3">Quick links</p>
          <ul className="flex flex-col gap-2 text-[13px] text-[#8a7a7d]">
            <li><Link href="/categories" className="hover:text-brand-pink transition-colors">All categories</Link></li>
            <li><Link href="/about" className="hover:text-brand-pink transition-colors">About us</Link></li>
            <li><Link href="/blog" className="hover:text-brand-pink transition-colors">Our blog</Link></li>
            <li><Link href="/faq" className="hover:text-brand-pink transition-colors">FAQ</Link></li>
            <li><Link href="/track-order" className="hover:text-brand-pink transition-colors">Track order</Link></li>
            <li><Link href="/contact" className="hover:text-brand-pink transition-colors">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-medium text-brand-ink mb-3">Contact</p>
          <ul className="flex flex-col gap-2 text-[13px] text-[#8a7a7d]">
            <li>206 Borno Way, Adekunle, Yaba, Lagos</li>
            <li>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hover:text-brand-pink transition-colors">
                WhatsApp us
              </a>
            </li>
            <li>hello@theloveboxgifts.com</li>
            <li>Mon – Sun, 8am – 8pm</li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-medium text-brand-ink mb-3">Why The Love Box</p>
          <ul className="flex flex-col gap-2 text-[13px] text-[#8a7a7d]">
            <li>Same-day delivery across Lagos</li>
            <li>Every box styled by hand</li>
            <li>Secure checkout via Paystack</li>
            <li>Real support on WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-blush">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
          <p className="text-[12px] text-[#8a7a7d]">© {new Date().getFullYear()} The Love Box. All rights reserved.</p>
          <a href="#top" className="flex items-center gap-1 text-[12px] text-[#8a7a7d] hover:text-brand-pink transition-colors">
            Back to top <ArrowUp className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
