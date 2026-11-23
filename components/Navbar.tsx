"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Truck } from "lucide-react";
import Logo from "./Logo";
import MegaMenu from "./MegaMenu";
import { useCartStore, useUI, cartCount } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import { useCategories } from "@/lib/useCategories";
import { useHydrated } from "@/lib/useHydrated";
import { useFeaturedDiscount } from "@/lib/useFeaturedDiscount";
import { useDiscountPopup } from "./DiscountPopup";

const links = [
  { href: "/curate", label: "Curate a gift" },
  { href: "/categories", label: "All gifts" },
  { href: "/track-order", label: "Track order" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const count = hydrated ? cartCount(items) : 0;
  const user = useAuthStore((s) => s.user);
  const { setCartOpen, setSearchOpen } = useUI();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: categories = [] } = useCategories();
  const { data: discount } = useFeaturedDiscount();
  const openDiscount = useDiscountPopup((s) => s.setOpen);
  const occasions = categories.filter((c) => !c.parent && !c.isGiftType);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <>
      <div className="bg-ink text-white">
        <AnimatePresence mode="wait" initial={false}>
          {discount ? (
            <motion.button key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => openDiscount(true)} className="container-x flex h-9 w-full items-center justify-center gap-2 text-[13px]">
              <span className="text-gold-300">✦</span>
              <span>{discount.headline}.</span>
              <span className="font-semibold text-gold-300 underline underline-offset-4">Get the code</span>
            </motion.button>
          ) : (
            <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container-x flex h-9 items-center justify-center gap-2 text-[13px]">
              <Truck className="h-3.5 w-3.5 text-gold-400" />
              <span className="sm:hidden">Same-day delivery across Lagos</span>
              <span className="hidden sm:inline">Order before 3pm for same-day delivery anywhere in Lagos</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <header
        className={`sticky top-0 z-40 bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_0_#EFE2EA,0_10px_30px_-20px_rgba(30,22,27,0.25)]" : "shadow-[0_1px_0_#EFE2EA]"}`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            <button
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${megaOpen ? "bg-cream-100 text-primary-700" : "hover:bg-cream-50"}`}
            >
              Occasions
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
            </button>
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => setMegaOpen(false)}
                  className="relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors hover:bg-cream-50"
                >
                  {l.label}
                  {active && <motion.span layoutId="nav-active" className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-primary-500" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-3 rounded-full border border-line py-2 pl-3.5 pr-2 text-[14px] text-ink-muted transition-colors hover:border-ink/30 md:flex"
              aria-label="Search gifts"
            >
              <Search className="h-4 w-4" />
              <span className="pr-6">Search gifts</span>
              <kbd className="rounded-md bg-cream-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-soft">⌘K</kbd>
            </button>
            <button onClick={() => setSearchOpen(true)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream-50 md:hidden" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link
              href={user ? "/account" : "/account/login"}
              className="hidden h-11 w-11 place-items-center rounded-full hover:bg-cream-50 sm:grid"
              aria-label={user ? "Your account" : "Sign in"}
            >
              {hydrated && user ? (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-600 text-[13px] font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-cream-50" aria-label={`Open cart, ${count} items`}>
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary-600 px-1 text-[10.5px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button onClick={() => setMobileOpen(true)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream-50 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>{megaOpen && <MegaMenu categories={categories} onNavigate={() => setMegaOpen(false)} />}</AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-sm flex-col bg-white"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              aria-label="Menu"
            >
              <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream-50" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <p className="mb-3 text-[13px] font-medium text-ink-muted">Shop by occasion</p>
                <div className="mb-8 flex flex-wrap gap-2">
                  {occasions.slice(0, 16).map((o) => (
                    <Link key={o._id} href={`/category/${o.slug}`} className="rounded-full bg-cream-100 px-3.5 py-2 text-[14px] font-medium text-ink">
                      {o.name}
                    </Link>
                  ))}
                </div>
                <nav className="flex flex-col">
                  {[...links, { href: user ? "/account" : "/account/login", label: user ? "My account" : "Sign in" }, { href: "/faq", label: "Help & FAQ" }, { href: "/contact", label: "Contact us" }].map((l) => (
                    <Link key={l.href} href={l.href} className="border-b border-line py-4 text-[20px] font-semibold tracking-tight">
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
