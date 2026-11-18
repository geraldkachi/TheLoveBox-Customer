import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource/mrs-saint-delafield/400.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "The Love Box | Gift boxes, flowers & hampers in Lagos",
    template: "%s | The Love Box",
  },
  description:
    "Hand-styled gift boxes, flowers, cakes and hampers delivered same-day across Lagos. Birthdays, weddings, anniversaries and every occasion — curated by The Love Box.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Love Box | Gift boxes, flowers & hampers in Lagos",
    description: "Hand-styled gifts with same-day delivery across Lagos.",
    siteName: "The Love Box",
    type: "website",
    locale: "en_NG",
    images: ["/brand/logo-original.jpg"],
  },
  twitter: { card: "summary_large_image", title: "The Love Box", description: "Hand-styled gifts with same-day delivery across Lagos." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#FD66C3" };

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "The Love Box",
  description: "Lagos gift box curator — flowers, hampers and curated gift boxes with same-day delivery.",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-original.jpg`,
  address: { "@type": "PostalAddress", streetAddress: "206 Borno Way, Adekunle", addressLocality: "Yaba, Lagos", addressCountry: "NG" },
  sameAs: ["https://www.instagram.com/thel.ovebox/", "https://www.tiktok.com/@theloveboxgifts"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body>
        <Providers>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="min-h-[70vh]">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
        </Providers>
      </body>
    </html>
  );
}
