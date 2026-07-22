"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import CategoryMenu from "./CategoryMenu";
import SearchBar from "./SearchBar";

const links = [
  { href: "/about", label: "About" },
  { href: "/track-order", label: "Track order" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-blush">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-[21px] text-brand-ink shrink-0">
          The Love Box
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <CategoryMenu />
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13.5px] text-brand-ink hover:text-brand-pink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <Link
            href={user ? "/account" : "/account/login"}
            aria-label="Account"
            className="text-brand-ink hover:text-brand-pink transition-colors hidden sm:block"
          >
            <User className="w-[19px] h-[19px]" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-brand-ink hover:text-brand-pink transition-colors">
            <ShoppingBag className="w-[20px] h-[20px]" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden text-brand-ink" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-brand-blush bg-white px-5 py-4 flex flex-col gap-4">
          <div className="sm:hidden">
            <SearchBar />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-brand-gold mb-2">Shop by occasion</p>
            <CategoryMenu mobile onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-brand-blush pt-3 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[14px] text-brand-ink">
                {l.label}
              </Link>
            ))}
            <Link
              href={user ? "/account" : "/account/login"}
              onClick={() => setOpen(false)}
              className="text-[14px] text-brand-ink"
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
