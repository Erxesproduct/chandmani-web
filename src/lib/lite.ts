import data from "@/data/lite.json";

/**
 * Slim product record for client components: s slug, n name, a article number (generic names only), p price,
 * o price before discount, k stock (null = not tracked), t thumbnail, z options [label, values].
 */
export type Lite = { s: string; n: string; a: number | null; p: number; o: number | null; k: number | null; t: string | null; z: [string, string[]][] };

export const liteProducts = data as Lite[];
const bySlug = new Map(liteProducts.map((p) => [p.s, p]));

export const getLite = (slug: string) => bySlug.get(slug);

/** Same rules as the server's resolveLine: every option chosen from its list. */
export function resolveLine(slug: string, opt: string | null) {
  const product = bySlug.get(slug);
  if (!product) return null;
  if (!product.z.length) return opt ? null : { product, opt: null, price: product.p, stock: product.k };
  const vals = (opt ?? "").split(" / ");
  if (vals.length !== product.z.length || product.z.some(([, values], i) => !values.includes(vals[i]))) return null;
  return { product, opt: opt!, price: product.p, stock: product.k };
}
