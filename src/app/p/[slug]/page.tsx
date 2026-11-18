import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks";
import { BuyBox } from "@/components/buy-box";
import { Gallery } from "@/components/gallery";
import { GiftIcon, ScissorsIcon, TruckIcon } from "@/components/icons";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { article, getCollab, getColour, getKind, getMaterial, getPattern, getProduct, inStock, products, sku, soldOut } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = p.generic ? `${p.name} № ${p.id}` : p.name;
  const description = `${title}: ${getKind(p.kind)?.name}, ${formatPrice(p.price)}. ${p.details[0]?.x ?? ""} ${business.rules.delivery}`.trim();
  const img = p.images[0];
  return { title, description, alternates: { canonical: `/p/${p.slug}` }, openGraph: { title, description, images: img ? [{ url: img.src, width: img.w, height: img.h }] : undefined } };
}

const TIE_KINDS = new Set(["tie", "set", "bow", "pocket", "ascot", "scarf"]);

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const out = soldOut(p);
  const kind = getKind(p.kind)!;
  const collab = getCollab(p.collab ?? "");
  const no = article(p);
  const colour = getColour(p.colour ?? "");
  const score = (x: typeof p) => Number(x.kind === p.kind) * 3 + Number(!!p.colour && x.colour === p.colour) * 2 + x.patterns.filter((t) => p.patterns.includes(t)).length + Number(!!p.collab && x.collab === p.collab) * 3;
  const related = inStock
    .filter((x) => x.id !== p.id && x.images.length)
    .map((x) => [x, score(x)] as const)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || b[0].id - a[0].id)
    .slice(0, 12)
    .map(([x]) => x);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: sku(p),
    brand: { "@type": "Brand", name: "Chandmani" },
    image: p.images.map((m) => absoluteUrl(m.src)),
    category: kind.name,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: p.price, availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: absoluteUrl(`/p/${p.slug}`) },
  };
  const facts = [
    ["Төрөл", kind.name, `/shop?k=${kind.id}`],
    collab && ["Хамтын бүтээл", collab.name, `/shop?x=${collab.id}`],
    p.patterns.length > 0 && ["Хээ", p.patterns.map((x) => getPattern(x)?.name).join(", "), `/shop?pt=${p.patterns[0]}`],
    p.materials.length > 0 && ["Материал", p.materials.map((x) => getMaterial(x)?.name).join(", "), null],
    colour && ["Өнгө (ойролцоо)", colour.name, `/shop?k=${kind.id}&c=${colour.id}`],
    ["Код", sku(p), null],
  ].filter(Boolean) as [string, string, string | null][];

  return (
    <div className="wrap pt-8 md:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="caps flex flex-wrap items-center gap-2 text-[10px] text-mute" aria-label="Зам">
        <Link href="/" className="hover:text-gold">
          Нүүр
        </Link>
        <span aria-hidden>·</span>
        <Link href={`/shop?k=${kind.id}`} className="hover:text-gold">
          {kind.name}
        </Link>
        {collab && (
          <>
            <span aria-hidden>·</span>
            <Link href={`/shop?x=${collab.id}`} className="hover:text-gold">
              {collab.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Gallery images={p.images} name={p.name} />

        <div className="lg:pt-4">
          <p className="caps text-gold">
            {kind.name}
            {no && <span className="text-mute"> · {no}</span>}
          </p>
          <h1 className="display mt-4 text-[38px] md:text-[50px]">{p.name}</h1>
          <div className="mt-5 flex items-center gap-4">
            <Price price={p.price} compareAt={p.compareAt} size="lg" />
            {out && <span className="caps border border-ink px-2 py-1 text-[10px]">Дууссан</span>}
          </div>
          <div className="hair my-7" />
          <BuyBox slug={p.slug} />

          <ul className="mt-8 space-y-3 text-[15px] text-ink-2">
            <li className="flex gap-3">
              <TruckIcon size={20} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Улаанбаатарт {formatPrice(business.cityFee)}, {formatPrice(business.freeFrom)}-өөс дээш захиалгад үнэгүй. {business.rules.delivery.split(".")[0]}.
              </span>
            </li>
            {TIE_KINDS.has(p.kind) && (
              <li className="flex gap-3">
                <GiftIcon size={20} className="mt-0.5 shrink-0 text-gold" />
                <span>{business.rules.giftBox}</span>
              </li>
            )}
            <li className="flex gap-3">
              <ScissorsIcon size={20} className="mt-0.5 shrink-0 text-gold" />
              <span>
                {business.rules.exchange}{" "}
                <Link href="/info#exchange" className="text-gold underline underline-offset-4">
                  Дэлгэрэнгүй
                </Link>
              </span>
            </li>
          </ul>

          {p.details.length > 0 && (
            <section className="mt-10">
              <h2 className="caps text-[11px] text-gold">Тайлбар</h2>
              <Blocks blocks={p.details} className="prose-silk mt-2" />
            </section>
          )}

          <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-line pt-6 text-[14.5px]">
            {facts.map(([k, v, href]) => (
              <div key={k} className="contents">
                <dt className="caps self-center text-[10px] text-mute">{k}</dt>
                <dd>{href ? <Link href={href} className="link-gold">{v}</Link> : v}</dd>
              </div>
            ))}
          </dl>

          {TIE_KINDS.has(p.kind) && (
            <div className="mt-10 border border-gilt/60 bg-ivory p-6">
              <p className="display text-[22px]">Өөрийн загвараар хийлгэх үү?</p>
              <p className="mt-2 text-[15px] text-ink-2">Өнгө, хээ, лого, өргөнийг тусгай захиалгаар сонгоно.</p>
              <Link href="/bespoke" className="caps link-gold mt-4 inline-block text-[11px] text-gold">
                Тусгай захиалга →
              </Link>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <div className="flex flex-col items-center text-center">
            <p className="caps text-gold">Хослуулах</p>
            <h2 className="display mt-3 text-[34px] md:text-[44px]">Танд таалагдаж магадгүй</h2>
          </div>
          <Scroller label="Төстэй бүтээгдэхүүн" className="scroller mt-10 select-none">
            {related.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </Scroller>
        </section>
      )}
    </div>
  );
}
