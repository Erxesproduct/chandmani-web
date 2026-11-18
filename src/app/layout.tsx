import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { business } from "@/content/business";
import { banners } from "@/lib/catalog";
import { siteUrl } from "@/lib/site-url";
import { caps, display, sans } from "./fonts";
import "./globals.css";

const og = banners[1] ?? banners[0];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Chandmani: гар аргаар урласан торгон зангиа", template: "%s · Chandmani" },
  description: business.description,
  openGraph: { type: "website", locale: "mn_MN", siteName: business.name, description: business.description, images: og ? [{ url: og.src, width: og.w, height: og.h }] : undefined },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0d1119" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className={`${display.variable} ${sans.variable} ${caps.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
