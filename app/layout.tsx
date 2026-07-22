import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "The Love Box | Gifts, Flowers & Hampers in Lagos",
    template: "%s | The Love Box",
  },
  description:
    "Thoughtful gifts, flowers, cakes and hampers delivered same-day across Lagos. Birthdays, weddings, anniversaries and every occasion, curated by The Love Box.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Love Box | Gifts, Flowers & Hampers in Lagos",
    description: "Thoughtful gifts and same-day delivery across Lagos, curated by The Love Box.",
    siteName: "The Love Box",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Love Box | Gifts, Flowers & Hampers in Lagos",
    description: "Thoughtful gifts and same-day delivery across Lagos, curated by The Love Box.",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "The Love Box",
  description: "Lagos gifting studio for flowers, hampers and curated gift boxes with same-day delivery.",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: "206 Borno Way, Adekunle",
    addressLocality: "Yaba, Lagos",
    addressCountry: "NG",
  },
  sameAs: [
    "https://www.instagram.com/thel.ovebox/",
    "https://www.tiktok.com/@theloveboxgifts",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
