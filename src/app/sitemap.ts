import type { MetadataRoute } from "next";
import { catalogUpdatedAt, collabs, kinds, posts, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalogUpdatedAt);
  return [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    { url: absoluteUrl("/shop"), lastModified, priority: 0.8 },
    ...kinds.map((k) => ({ url: absoluteUrl(`/shop?k=${k.id}`), lastModified, priority: 0.8 })),
    ...collabs.map((c) => ({ url: absoluteUrl(`/shop?x=${c.id}`), lastModified, priority: 0.6 })),
    ...products.map((p) => ({ url: absoluteUrl(`/p/${p.slug}`), lastModified, priority: 0.7 })),
    { url: absoluteUrl("/bespoke"), lastModified, priority: 0.7 },
    { url: absoluteUrl("/journal"), lastModified, priority: 0.5 },
    ...posts.map((p) => ({ url: absoluteUrl(`/journal/${p.slug}`), lastModified: new Date(p.date), priority: 0.4 })),
    { url: absoluteUrl("/info"), lastModified, priority: 0.5 },
  ];
}
