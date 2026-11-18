import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { article, collabs, colours, inStock, kinds, materials, patterns, posts, products, type Product } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { CartLink } from "./cart-link";
import { HeaderShell } from "./header-shell";
import { SearchIcon } from "./icons";
import { Scroller } from "./scroller";

const ticker = ["Гар аргаар урласан торгон зангиа", `${formatPrice(business.freeFrom)}-өөс дээш хүргэлт үнэгүй`, business.rules.giftBox, "Байгууллагын тусгай захиалга", `Утас ${business.phone.display}`];

type Item = { href: string; label: string; panel: React.ReactNode };

const newest = (list: Product[]) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
const heading = "caps mb-4 block text-[10px] text-gold";
const listLink = "group/l flex items-baseline justify-between gap-3 py-1 text-[15px] text-ink-2 transition-colors hover:text-oxblood";

/** Mega-menu panel for a slice of the catalogue: patterns, materials, colours, the newest pieces and a cover tile. */
function CatalogPanel({ title, base, pred }: { title: string; base: string; pred: (p: Product) => boolean }) {
  const pool = inStock.filter(pred);
  const all = products.filter(pred);
  const count = (f: (p: Product) => boolean) => pool.filter(f).length;
  const pats = patterns.map((x) => ({ ...x, n: count((p) => p.patterns.includes(x.id)) })).filter((x) => x.n > 0);
  const mats = materials.map((x) => ({ ...x, n: count((p) => p.materials.includes(x.id)) })).filter((x) => x.n > 0);
  const cols = colours.map((x) => ({ ...x, n: count((p) => p.colour === x.id) })).filter((x) => x.n > 0);
  const fresh = newest(pool.filter((p) => p.images.length)).slice(0, 3);
  const cover = fresh[0]?.images[1] ?? fresh[0]?.images[0];
  const href = (qs: string) => `/shop?${base}${qs ? `&${qs}` : ""}`;
  return (
    <div className="grid grid-cols-[minmax(150px,190px)_minmax(150px,200px)_1fr_minmax(220px,280px)] gap-10">
      <div>
        {pats.length > 0 && (
          <>
            <span className={heading}>Хээгээр</span>
            {pats.map((x) => (
              <Link key={x.id} href={href(`pt=${x.id}`)} className={listLink}>
                {x.name}
                <span className="text-[12px] text-mute">{x.n}</span>
              </Link>
            ))}
          </>
        )}
        {mats.length > 0 && (
          <>
            <span className={`${heading} ${pats.length ? "mt-6" : ""}`}>Материал</span>
            {mats.map((x) => (
              <Link key={x.id} href={href(`m=${x.id}`)} className={listLink}>
                {x.name}
                <span className="text-[12px] text-mute">{x.n}</span>
              </Link>
            ))}
          </>
        )}
      </div>
      <div>
        {cols.length > 0 && (
          <>
            <span className={heading}>Өнгөөр</span>
            <div className="grid gap-0.5">
              {cols.map((c) => (
                <Link key={c.id} href={href(`c=${c.id}`)} className={`${listLink} justify-start`}>
                  <span className="h-3.5 w-3.5 shrink-0 translate-y-0.5 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18)]" style={{ background: c.hex }} />
                  <span className="flex-1">{c.name}</span>
                  <span className="text-[12px] text-mute">{c.n}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <div>
        <span className={heading}>Шинээр ирсэн</span>
        <div className="grid grid-cols-3 gap-4">
          {fresh.map((p) => (
            <Link key={p.id} href={`/p/${p.slug}`} className="group block">
              <span className="frame block aspect-square">
                <Image src={p.images[0].thumb.src} alt="" width={p.images[0].thumb.w} height={p.images[0].thumb.h} sizes="160px" className="absolute inset-0 h-full w-full object-cover" />
              </span>
              <span className="mt-2 line-clamp-1 block font-display text-[15px] group-hover:text-oxblood">{p.name}</span>
              <span className="block text-[13px] text-mute">
                {article(p) ? `${article(p)} · ` : ""}
                {formatPrice(p.price)}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Link href={href("")} className="group relative block min-h-[220px] overflow-hidden bg-night">
        {cover && <Image src={cover.thumb.src} alt="" fill sizes="280px" className="object-cover opacity-75 transition duration-[1.2s] group-hover:scale-105 group-hover:opacity-90" />}
        <span className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" aria-hidden />
        <span className="pointer-events-none absolute inset-2.5 border border-gilt-2/50" aria-hidden />
        <span className="absolute inset-x-0 bottom-0 p-5 text-ivory">
          <span className="caps block text-[9.5px] text-gilt-2">
            {pool.length} бэлэн · нийт {all.length}
          </span>
          <span className="display mt-1 block text-[24px] leading-tight">Бүх {title.toLowerCase()}</span>
          <span className="caps mt-2 block text-[10px] text-gilt-2">Үзэх →</span>
        </span>
      </Link>
    </div>
  );
}

function GiftPanel() {
  const tiles = collabs.filter((c) => c.id !== "spooky");
  return (
    <div className="grid grid-cols-[minmax(170px,220px)_1fr] gap-10">
      <div>
        <span className={heading}>Бэлэглэх</span>
        {[
          ["/shop?k=gift", "Бэлгийн багц", kinds.find((k) => k.id === "gift")?.count],
          ["/shop?k=set", "Зангиа, алчуурын сэт", kinds.find((k) => k.id === "set")?.count],
          ["/shop?k=card", "Бэлгийн карт", kinds.find((k) => k.id === "card")?.count],
          ["/shop?k=case", "Аялалын хайрцаг", kinds.find((k) => k.id === "case")?.count],
          ["/shop?x=spooky", "Spooky ties", collabs.find((c) => c.id === "spooky")?.count],
        ].map(([href, label, n]) => (
          <Link key={href as string} href={href as string} className={listLink}>
            {label}
            <span className="text-[12px] text-mute">{n}</span>
          </Link>
        ))}
        <p className="mt-6 border-t border-line pt-4 text-[14px] text-ink-2">{business.rules.giftBox}</p>
      </div>
      <div>
        <span className={heading}>Хамтын бүтээл</span>
        <div className="grid grid-cols-4 gap-5">
          {tiles.map((c) => {
            const p = newest(products.filter((x) => x.collab === c.id && x.images.length))[0];
            return (
              <Link key={c.id} href={`/shop?x=${c.id}`} className="group block">
                <span className="frame block aspect-square">{p && <Image src={p.images[0].thumb.src} alt="" width={p.images[0].thumb.w} height={p.images[0].thumb.h} sizes="200px" className="absolute inset-0 h-full w-full object-cover" />}</span>
                <span className="mt-2.5 block font-display text-[16px] group-hover:text-oxblood">{c.name}</span>
                <span className="caps block text-[9px] text-mute">{c.count} багц</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BespokePanel() {
  const work = posts.filter((p) => p.custom).slice(0, 4);
  return (
    <div className="grid grid-cols-[minmax(240px,300px)_1fr] gap-10">
      <div>
        <span className={heading}>Тусгай захиалга</span>
        <p className="font-display text-[22px] leading-snug">Байгууллагын өнгө, логог торгонд</p>
        <ol className="mt-4 space-y-1.5 text-[14.5px] text-ink-2">
          {["Хүсэлт: өнгө, хээ, лого, материал", "2–3 загварын хувилбар", "Гар аргаар урлана", "Хүлээлгэн өгөх, 14 хоногийн засвар"].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="w-5 font-display text-gold italic">{["I", "II", "III", "IV"][i]}</span>
              {t}
            </li>
          ))}
        </ol>
        <Link href="/bespoke" className="btn btn-ink mt-6 min-h-11 px-5">
          Дэлгэрэнгүй
        </Link>
      </div>
      <div>
        <span className={heading}>Хийсэн ажил</span>
        <div className="grid grid-cols-4 gap-5">
          {work.map((w) => (
            <Link key={w.id} href={`/journal/${w.slug}`} className="group block">
              <span className="frame block aspect-square">{w.cover && <Image src={w.cover.thumb.src} alt="" width={w.cover.thumb.w} height={w.cover.thumb.h} sizes="200px" className="absolute inset-0 h-full w-full object-cover" />}</span>
              <span className="caps mt-2.5 block text-[9.5px] text-gold">{w.client}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function JournalPanel() {
  const list = posts.filter((p) => !p.custom).slice(0, 3);
  return (
    <div className="grid grid-cols-[minmax(170px,220px)_1fr] gap-10">
      <div>
        <span className={heading}>Сэтгүүл</span>
        <p className="font-display text-[22px] leading-snug">Зангианы түүх, хээ, уях, арчлах ёс</p>
        <Link href="/journal" className="caps link-gold mt-5 inline-block text-[10.5px] text-gold">
          Бүх нийтлэл →
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {list.map((a) => (
          <Link key={a.id} href={`/journal/${a.slug}`} className="group block">
            <span className="frame block aspect-[4/3]">{a.cover && <Image src={a.cover.thumb.src} alt="" width={a.cover.thumb.w} height={a.cover.thumb.h} sizes="300px" className="absolute inset-0 h-full w-full object-cover" />}</span>
            <span className="caps mt-3 block text-[9px] text-mute">{formatDate(a.date)}</span>
            <span className="mt-1 line-clamp-2 block font-display text-[17px] leading-snug group-hover:text-oxblood">{a.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const ofKind = (id: string) => (p: Product) => p.kind === id;
export const NAV: Item[] = [
  { href: "/shop?k=tie", label: "Зангиа", panel: <CatalogPanel title="Зангиа" base="k=tie" pred={ofKind("tie")} /> },
  { href: "/shop?k=set", label: "Сэт", panel: <CatalogPanel title="Сэт" base="k=set" pred={ofKind("set")} /> },
  { href: "/shop?k=bow", label: "Эрвээхэй", panel: <CatalogPanel title="Эрвээхэй зангиа" base="k=bow" pred={ofKind("bow")} /> },
  { href: "/shop?k=pocket", label: "Алчуур", panel: <CatalogPanel title="Энгэрийн алчуур" base="k=pocket" pred={(p) => p.kind === "pocket" || p.kind === "ascot"} /> },
  { href: "/shop?k=gift", label: "Бэлэг", panel: <GiftPanel /> },
  { href: "/shop?w=1", label: "Эмэгтэй", panel: <CatalogPanel title="Эмэгтэй" base="w=1" pred={(p) => p.women} /> },
];
export const NAV_RIGHT: Item[] = [
  { href: "/bespoke", label: "Тусгай захиалга", panel: <BespokePanel /> },
  { href: "/journal", label: "Сэтгүүл", panel: <JournalPanel /> },
];

const navLink = "caps link-gold relative py-1 text-[11px] text-ink transition-colors hover:text-gold";

function MegaItem({ item }: { item: Item }) {
  return (
    <div className="mega-item flex h-full items-center">
      <Link href={item.href} className={navLink}>
        {item.label}
      </Link>
      <div className="mega absolute inset-x-0 top-full border-t border-gilt/60 bg-paper shadow-[0_40px_60px_-30px_rgb(13_17_25/0.45)]">
        <div className="wrap py-10">{item.panel}</div>
        <div className="hair" />
      </div>
    </div>
  );
}

export function Header() {
  return (
    <HeaderShell>
      <div className="overflow-hidden bg-night py-2 text-gilt-2" aria-label="Мэдээлэл">
        <div className="marquee">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0" aria-hidden={k === 1}>
              {ticker.map((t) => (
                <span key={t} className="caps flex items-center gap-8 px-8 text-[10.5px]">
                  {t}
                  <span className="diamond text-gilt" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="relative border-b border-line bg-paper/95 backdrop-blur-xl">
        <div className="wrap grid h-[68px] grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[84px]">
          <nav className="hidden h-full items-center gap-6 xl:flex" aria-label="Үндсэн цэс">
            {NAV.map((item) => (
              <MegaItem key={item.href} item={item} />
            ))}
          </nav>
          <div className="xl:hidden">
            <Link href="/shop" className="-ml-2.5 grid h-11 w-11 place-items-center md:hidden" aria-label="Хайх">
              <SearchIcon size={21} />
            </Link>
            <form action="/shop" role="search" className="relative hidden md:block">
              <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-mute" />
              <input name="q" type="search" placeholder="Хайх" aria-label="Хайх" className="h-10 w-44 border-b border-line bg-transparent pr-2 pl-7 text-[14px] outline-none placeholder:text-mute focus:border-gold" />
            </form>
          </div>

          <Link href="/" aria-label={`${business.name}: нүүр`} className="flex flex-col items-center gap-1.5">
            <Image src="/brand/mark-gold.png" alt="" width={150} height={278} priority className="hidden h-6 w-auto md:block" />
            <Image src="/brand/word-ink.png" alt="CHANDMANI" width={1596} height={240} priority className="h-[15px] w-auto md:h-[17px]" />
          </Link>

          <div className="flex h-full items-center justify-end gap-5">
            <nav className="hidden h-full items-center gap-6 xl:flex" aria-label="Тусгай захиалга, сэтгүүл">
              {NAV_RIGHT.map((item) => (
                <MegaItem key={item.href} item={item} />
              ))}
            </nav>
            <form action="/shop" role="search" className="relative hidden xl:block">
              <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-mute" />
              <input name="q" type="search" placeholder="Хайх" aria-label="Хайх" className="h-10 w-32 border-b border-line bg-transparent pr-2 pl-7 text-[14px] outline-none transition-[width] placeholder:text-mute focus:w-48 focus:border-gold" />
            </form>
            <CartLink />
          </div>
        </div>
        <div className="wrap xl:hidden">
          <Scroller as="nav" label="Үндсэн цэс" small className="flex gap-6 overflow-x-auto pb-3 select-none [scrollbar-width:none] md:justify-center">
            {[...NAV, ...NAV_RIGHT].map((item) => (
              <Link key={item.href} href={item.href} className={`${navLink} shrink-0`}>
                {item.label}
              </Link>
            ))}
          </Scroller>
        </div>
      </div>
    </HeaderShell>
  );
}
