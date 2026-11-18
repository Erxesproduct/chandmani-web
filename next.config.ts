import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Old Zochil URLs keep working: /products/<categoryId|null>/<productId> → /p/<slug>, /products/<categoryId> → /shop?….
const catalog = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")) as { products: { id: number; slug: string }[] };
const journal = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "journal.json"), "utf8")) as { id: number; slug: string; custom: boolean }[];
const productRedirects = catalog.products.map((p) => ({ source: `/products/:category/${p.id}`, destination: `/p/${p.slug}`, permanent: true }));
const postRedirects = journal.map((p) => ({ source: `/posts/${p.id}`, destination: `/journal/${p.slug}`, permanent: true }));
// Zochil categories of shop 11867 → filters on the new site
const CATEGORIES: Record<number, string> = {
  287356: "",
  287357: "k=tie",
  287358: "k=bow",
  287359: "k=pocket",
  351973: "x=spooky",
  326078: "x=lamy",
  282497: "w=1",
  282499: "k=scarf",
  287366: "k=tie&w=1",
  238740: "k=ascot",
  287100: "",
  287360: "k=clip",
  287361: "k=pin",
  78702: "",
  114845: "k=case",
  79264: "k=card",
  274899: "x=plasencia",
  344828: "x=sf-soap",
};
const categoryRedirects = Object.entries(CATEGORIES).map(([id, qs]) => ({ source: `/products/${id}`, destination: qs ? `/shop?${qs}` : "/shop", permanent: true }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos are pre-sized WebP (520 px thumbs, 1100 px large, square), so they are served as-is.
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      ...productRedirects,
      ...categoryRedirects,
      ...postRedirects,
      { source: "/products/:category(\\d+|null)", destination: "/shop", permanent: false },
      { source: "/category/:path*", destination: "/shop", permanent: false },
      { source: "/saled-products", destination: "/shop", permanent: true },
      { source: "/brands/:path*", destination: "/shop", permanent: false },
      { source: "/posts", destination: "/journal", permanent: true },
      { source: "/posts/:path*", destination: "/journal", permanent: false },
      { source: "/shopping-cart", destination: "/cart", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: true },
      { source: "/about", destination: "/info#about", permanent: true },
      { source: "/faq", destination: "/info#faq", permanent: true },
      { source: "/terms", destination: "/info#exchange", permanent: true },
      { source: "/contact", destination: "/info#contact", permanent: true },
      { source: "/accounts/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/(images|brand)/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};

export default nextConfig;
