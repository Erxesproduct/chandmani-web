import data from "@/data/catalog.json";
import journalData from "@/data/journal.json";

export type Img = { src: string; w: number; h: number };
export type Photo = Img & { thumb: Img };
export type Block = { t: "p" | "li"; x: string };
export type Option = { key: "colour" | "engraving"; label: string; values: string[] };
export type KindId = "tie" | "set" | "bow" | "pocket" | "ascot" | "gift" | "scarf" | "clip" | "pin" | "card" | "case";

export type Product = {
  /** Zochil product id (erxes code CH-<id>, old-URL redirects). */
  id: number;
  slug: string;
  /** Name as shown: Zochil caps lowered, «CHANDMANI X …» written «Chandmani × …». */
  name: string;
  /** The name is shared by several products («Бэлгийн багц», «Зангиа»): the article number tells them apart. */
  generic: boolean;
  zochilName: string;
  kind: KindId;
  women: boolean;
  collab: string | null;
  materials: string[];
  patterns: string[];
  /** Main colour estimated from the first photo (null when unclear): a browsing aid, not a product fact. */
  colour: string | null;
  options: Option[];
  price: number;
  compareAt: number | null;
  stock: number | null;
  bestseller: boolean;
  createdAt: string;
  details: Block[];
  images: Photo[];
};

export type Facet = { id: string; name: string; count: number };
export type Kind = Facet & { id: KindId; line: string };
export type Colour = Facet & { hex: string };
export type JournalBlock = { t: "p" | "li"; x: string } | ({ t: "img" } & Img);
export type Post = { id: number; slug: string; title: string; custom: boolean; client: string | null; date: string; cover: Photo | null; body: JournalBlock[] };

export const products = data.products as Product[];
export const kinds = data.kinds as Kind[];
export const collabs = data.collabs as Facet[];
export const materials = data.materials as Facet[];
export const patterns = data.patterns as Facet[];
export const colours = data.colours as Colour[];
export const excluded = data.excluded as { id: number; name: string; price: number }[];
export const faq = data.faq as { q: string; a: string }[];
export const about = data.about as Block[];
export const banners = data.banners as Img[];
export const catalogUpdatedAt = data.updatedAt;
export const posts = journalData as Post[];

const bySlug = new Map(products.map((p) => [p.slug, p]));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getKind = (id: string) => kinds.find((k) => k.id === id);
export const getCollab = (id: string) => collabs.find((c) => c.id === id);
export const getMaterial = (id: string) => materials.find((m) => m.id === id);
export const getPattern = (id: string) => patterns.find((m) => m.id === id);
export const getColour = (id: string) => colours.find((c) => c.id === id);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const soldOut = (p: { stock: number | null }) => p.stock === 0;
export const onSale = (p: Pick<Product, "price" | "compareAt">) => p.compareAt != null && p.compareAt > p.price;
export const inStock = products.filter((p) => !soldOut(p));

/** erxes product code: CH-<zochil id>. */
export const sku = (p: Pick<Product, "id">) => `CH-${p.id}`;
/** Article number shown under generic names. */
export const article = (p: Pick<Product, "id" | "generic">) => (p.generic ? `№ ${p.id}` : null);

/** The product a cart line points at (server side). `opt` = chosen values in option order joined by « / ». */
export function resolveLine(slug: string, opt: string | null) {
  const product = getProduct(slug);
  if (!product) return null;
  if (!product.options.length) return opt ? null : { product, opt: null, price: product.price, stock: product.stock };
  const vals = (opt ?? "").split(" / ");
  if (vals.length !== product.options.length || product.options.some((o, i) => !o.values.includes(vals[i]))) return null;
  return { product, opt: opt!, price: product.price, stock: product.stock };
}

/** First paragraph of a post (teasers, descriptions). */
export const lede = (p: Post) => p.body.find((b): b is { t: "p"; x: string } => b.t === "p")?.x ?? "";
